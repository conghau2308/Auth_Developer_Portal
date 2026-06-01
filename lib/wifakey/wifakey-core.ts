"use client";

import * as ort from "onnxruntime-web";
import { getDecoderSession, getWiFaKeyData } from "./model-loader";

// Tham số cố định từ WiFaKey_252 (wifakey_handler.py)
const FEATURE_LENGTH = 832; // N*Z = 52*16
const KEY_LENGTH = 160;     // (N-m)*Z = 10*16
const KAPPA = 0.3125;

export interface EnrollResult {
  helperData: Uint8Array; // 832 bits
  maskR: Uint8Array;      // full_binary_length bits
  keyHash: Uint8Array;    // 32 bytes SHA-256
}

// ─── Math utilities ────────────────────────────────────────────────────────────

function matmulFloat(A: Float32Array, aRows: number, aCols: number, B: Float32Array, bCols: number): Float32Array {
  const out = new Float32Array(aRows * bCols);
  for (let i = 0; i < aRows; i++) {
    for (let j = 0; j < bCols; j++) {
      let sum = 0;
      for (let k = 0; k < aCols; k++) {
        sum += A[i * aCols + k] * B[k * bCols + j];
      }
      out[i * bCols + j] = sum;
    }
  }
  return out;
}

function matmulBinaryMod2(A: Uint8Array, aRows: number, aCols: number, B: Uint8Array, bCols: number): Uint8Array {
  const out = new Uint8Array(aRows * bCols);
  for (let i = 0; i < aRows; i++) {
    for (let j = 0; j < bCols; j++) {
      let sum = 0;
      for (let k = 0; k < aCols; k++) {
        sum += A[i * aCols + k] * B[k * bCols + j];
      }
      out[i * bCols + j] = sum & 1;
    }
  }
  return out;
}

async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hashBuffer);
}

// ─── WiFaKey protocol steps ────────────────────────────────────────────────────

/**
 * Bước 1: M_matrix projection + LSSC binarization → full binary vector
 * Mirrors _binarize_full() trong wifakey_handler.py
 */
function binarizeFull(
  embedding: Float32Array,
  M: Float32Array,
  mRows: number,
  mCols: number,
  intervals: Float32Array,
  numIntervals: number
): Uint8Array {
  // projected = embedding @ M  (1×512) × (512×mCols) → (1×mCols)
  const projected = matmulFloat(embedding, 1, mRows, M, mCols);

  // LSSC: mirrors Python's lssc_binary() với lookup table lkut
  // lkut[i][b] = 1 if b >= numIntervals - i else 0
  // index = first position where interval[index] > val (numIntervals if val >= all)
  // → [0,0,0], [0,0,1], [0,1,1], [1,1,1] for numIntervals=3
  const bitsPerDim = numIntervals;
  const totalBits = mCols * bitsPerDim;
  const binary = new Uint8Array(totalBits);

  for (let d = 0; d < mCols; d++) {
    const val = projected[d];
    // Tìm index đầu tiên mà interval[index] > val
    let index = numIntervals;
    for (let b = 0; b < numIntervals; b++) {
      if (intervals[b] > val) { index = b; break; }
    }
    // lkut[index][b] = b >= numIntervals - index ? 1 : 0
    for (let b = 0; b < bitsPerDim; b++) {
      binary[d * bitsPerDim + b] = b >= numIntervals - index ? 1 : 0;
    }
  }

  return binary;
}

/**
 * Bước 2: Apply kappa mask (adaMTrans)
 * maskR[i] = uniform(0,1) >= kappa → 1, else 0
 */
function generateMask(length: number): Uint8Array {
  const mask = new Uint8Array(length);
  const randoms = new Uint8Array(length);
  crypto.getRandomValues(randoms);
  for (let i = 0; i < length; i++) {
    mask[i] = randoms[i] / 255.0 >= KAPPA ? 1 : 0;
  }
  return mask;
}

function applyMask(binary: Uint8Array, mask: Uint8Array): Uint8Array {
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary[i] & mask[i];
  }
  return out;
}

/**
 * LDPC decode: Neural-MS ONNX
 * Input bits (832 uint8) → LLR (1,52,16) float32 → decode → 832 bits
 */
async function ldpcDecode(noisyBits: Uint8Array): Promise<Uint8Array> {
  const session = await getDecoderSession();

  // BPSK khớp Python Modulation.py: bit * 2 - 1  → bit 0 = -1, bit 1 = +1
  const llr = new Float32Array(1 * 52 * 16);
  for (let i = 0; i < FEATURE_LENGTH; i++) {
    llr[i] = noisyBits[i] * 2 - 1;
  }

  const tensor = new ort.Tensor("float32", llr, [1, 52, 16]);
  const result = await session.run({ "xa:0": tensor });
  const outputLLR = result["ya_output24:0"].data as Float32Array;

  const decoded = new Uint8Array(FEATURE_LENGTH);
  for (let i = 0; i < FEATURE_LENGTH; i++) {
    decoded[i] = outputLLR[i] > 0 ? 1 : 0;
  }
  return decoded;
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Enrollment: tính helper_data, mask_r, key_hash từ embedding.
 * Toàn bộ chạy trong browser — c* và k không rời thiết bị.
 */
export async function wifakeyEnroll(embedding: Float32Array): Promise<EnrollResult> {
  const data = await getWiFaKeyData();

  const M = new Float32Array(data.M_matrix.data);
  const [mRows, mCols] = data.M_matrix.shape; // [512, projectedDim]
  const intervals = new Float32Array(data.binarization_intervals.data);
  const numIntervals = data.binarization_intervals.shape[0];

  // 1. Binarize
  const bFull = binarizeFull(embedding, M, mRows, mCols, intervals, numIntervals);

  // 2. Random mask
  const maskR = generateMask(bFull.length);
  const bMasked = applyMask(bFull, maskR);
  const bSelected = bMasked.slice(0, FEATURE_LENGTH);

  // 3. Random key (160 bits)
  const key = new Uint8Array(KEY_LENGTH);
  crypto.getRandomValues(key);
  for (let i = 0; i < KEY_LENGTH; i++) key[i] = key[i] & 1; // Đảm bảo chỉ 0 hoặc 1

  // 4. LDPC encode key → codeword (832 bits): (1×160) × (160×832) → (1×832)
  const G = new Uint8Array(data.G_matrix.data);
  const [gRows, gCols] = data.G_matrix.shape; // [KEY_LENGTH, FEATURE_LENGTH]
  const codeword1D = matmulBinaryMod2(key, 1, gRows, G, gCols);

  // 5. XOR helper_data = bSelected ⊕ codeword
  const helperData = new Uint8Array(FEATURE_LENGTH);
  for (let i = 0; i < FEATURE_LENGTH; i++) {
    helperData[i] = bSelected[i] ^ codeword1D[i];
  }

  // 6. Hash key
  const keyHash = await sha256(key);

  return { helperData, maskR, keyHash };
}

/**
 * Verification: tính hash_k từ embedding + helper_data + mask.
 * Trả về Uint8Array(32) để so sánh với server.
 * c* và k không rời thiết bị.
 */
export async function wifakeyVerify(
  embedding: Float32Array,
  helperData: Uint8Array,
  maskR: Uint8Array
): Promise<Uint8Array> {
  const data = await getWiFaKeyData();

  const M = new Float32Array(data.M_matrix.data);
  const [mRows, mCols] = data.M_matrix.shape;
  const intervals = new Float32Array(data.binarization_intervals.data);
  const numIntervals = data.binarization_intervals.shape[0];

  // 1. Binarize fresh embedding
  const bFull = binarizeFull(embedding, M, mRows, mCols, intervals, numIntervals);

  // 2. Apply same mask
  const bMasked = applyMask(bFull, maskR);
  const bSelected = bMasked.slice(0, FEATURE_LENGTH);

  // 3. XOR với helper_data → noisy codeword
  const noisyBits = new Uint8Array(FEATURE_LENGTH);
  for (let i = 0; i < FEATURE_LENGTH; i++) {
    noisyBits[i] = bSelected[i] ^ helperData[i];
  }

  // 4. Neural-MS LDPC decode
  const decodedCW = await ldpcDecode(noisyBits);

  // 5. Extract key (first KEY_LENGTH bits)
  const reconstructedKey = decodedCW.slice(0, KEY_LENGTH);

  // 6. Hash
  return sha256(reconstructedKey);
}
