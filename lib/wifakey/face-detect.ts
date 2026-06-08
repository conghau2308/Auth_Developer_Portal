"use client";

import * as ort from "onnxruntime-web";

/**
 * YuNet face detector — face_detection_yunet_2026may.onnx (OpenCV Zoo)
 *
 * Decode formula from face_detect.cpp (OpenCV source):
 *   cx  = (col + bbox[0]) * stride
 *   cy  = (row + bbox[1]) * stride
 *   w   = exp(bbox[2])    * stride
 *   kps = (kps_raw + col) * stride
 *   score = sqrt(cls * obj)   // cls/obj already sigmoid-activated in model
 *
 * Preprocessing (blobFromImage with default params, scalefactor=1.0):
 *   - Input values 0–255 float32 (NO /255 normalization)
 *   - BGR channel order
 *   - Pad to multiple of 32 on right/bottom
 */

const SCORE_THRESHOLD = 0.6;
const NMS_THRESHOLD   = 0.3;
const DIVISOR         = 32;
const STRIDES         = [8, 16, 32];

let detSession: ort.InferenceSession | null = null;

async function getDetSession(): Promise<ort.InferenceSession> {
  if (!detSession) {
    const BASE = process.env.NEXT_PUBLIC_WIFAKEY_MODEL_URL ?? "http://localhost:8002/models";
    detSession = await ort.InferenceSession.create(
      `${BASE}/face_detection_yunet_2026may.onnx`,
      { executionProviders: ["wasm"], graphOptimizationLevel: "all" }
    );
  }
  return detSession;
}

// ─── Preprocessing ────────────────────────────────────────────────────────────

interface PrepResult {
  tensor: ort.Tensor;
  padW: number;
  padH: number;
  scaleX: number;  // original_W / padW  (for scaling bbox back)
  scaleY: number;
  origW: number;
  origH: number;
}

function prepareInput(imageData: ImageData): PrepResult {
  const { width: origW, height: origH, data: rgba } = imageData;

  // Pad dimensions to multiple of DIVISOR (same as OpenCV padWithDivisor)
  const padW = Math.ceil(origW / DIVISOR) * DIVISOR;
  const padH = Math.ceil(origH / DIVISOR) * DIVISOR;

  // Build CHW float32 tensor — BGR, 0-255 (OpenCV default: scalefactor=1.0, swapRB=false)
  const chw = new Float32Array(3 * padH * padW); // zero-padded by default (Float32Array is 0-initialized)

  for (let y = 0; y < origH; y++) {
    for (let x = 0; x < origW; x++) {
      const si = (y * origW + x) * 4;
      const di = y * padW + x;
      const r = rgba[si], g = rgba[si + 1], b = rgba[si + 2];
      // BGR channel order (OpenCV default, model trained with BGR)
      chw[0 * padH * padW + di] = b; // channel 0 = Blue
      chw[1 * padH * padW + di] = g; // channel 1 = Green
      chw[2 * padH * padW + di] = r; // channel 2 = Red
    }
  }

  return {
    tensor: new ort.Tensor("float32", chw, [1, 3, padH, padW]),
    padW, padH,
    scaleX: origW / padW,
    scaleY: origH / padH,
    origW, origH,
  };
}

// ─── NMS ─────────────────────────────────────────────────────────────────────

function iou(a: number[], b: number[]) {
  const ix1 = Math.max(a[0], b[0]), iy1 = Math.max(a[1], b[1]);
  const ix2 = Math.min(a[2], b[2]), iy2 = Math.min(a[3], b[3]);
  const inter = Math.max(0, ix2 - ix1) * Math.max(0, iy2 - iy1);
  return inter / ((a[2]-a[0])*(a[3]-a[1]) + (b[2]-b[0])*(b[3]-b[1]) - inter + 1e-6);
}

function nms(boxes: number[][], scores: number[], thr: number): number[] {
  const order = scores.map((s, i) => [s, i]).sort((a, b) => b[0] - a[0]);
  const keep: number[] = [];
  const sup = new Uint8Array(boxes.length);
  for (const [, i] of order) {
    if (sup[i]) continue;
    keep.push(i);
    for (const [, j] of order) {
      if (!sup[j] && j !== i && iou(boxes[i], boxes[j]) > thr) sup[j] = 1;
    }
  }
  return keep;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface FaceBox {
  x1: number; y1: number; x2: number; y2: number;
  score: number;
  /** 5 key points in order: right_eye, left_eye, nose_tip, right_mouth, left_mouth */
  kps: [number, number][];
}

/**
 * Detect face in un-mirrored ImageData using YuNet ONNX (0-255 BGR input).
 * Returns best face with bbox + 5 keypoints in original image pixel coords.
 * Matches OpenCV FaceDetectorYN output exactly.
 */
export async function detectFace(imageData: ImageData): Promise<FaceBox | null> {
  const session = await getDetSession();
  const prep = prepareInput(imageData);
  const outputs = await session.run({ input: prep.tensor });

  const allBoxes: number[][] = [];
  const allScores: number[] = [];
  const allKps: [number, number][][] = [];

  const names = session.outputNames;

  for (const stride of STRIDES) {
    const fm_cols = prep.padW / stride;
    const fm_rows = prep.padH / stride;
    const n = fm_cols * fm_rows;

    // Find output tensors by name
    const clsData = (outputs[`cls_${stride}`]?.data ?? new Float32Array()) as Float32Array;
    const objData = (outputs[`obj_${stride}`]?.data ?? new Float32Array()) as Float32Array;
    const boxData = (outputs[`bbox_${stride}`]?.data ?? new Float32Array()) as Float32Array;
    const kpsData = (outputs[`kps_${stride}`]?.data ?? new Float32Array()) as Float32Array;

    for (let i = 0; i < n; i++) {
      const cls_v = clsData[i];
      const obj_v = objData[i];
      const score = Math.sqrt(Math.max(0, cls_v) * Math.max(0, obj_v));
      if (score < SCORE_THRESHOLD) continue;

      const row = Math.floor(i / fm_cols);
      const col = i % fm_cols;

      // OpenCV decode formula (face_detect.cpp lines 207-210):
      // cx = (col + bbox[0]) * stride
      // w  = exp(bbox[2])    * stride
      const cx = (col + boxData[i * 4 + 0]) * stride;
      const cy = (row + boxData[i * 4 + 1]) * stride;
      const w  = Math.exp(boxData[i * 4 + 2]) * stride;
      const h  = Math.exp(boxData[i * 4 + 3]) * stride;

      // Scale from padded space to original image space
      const x1 = (cx - w / 2) * prep.scaleX;
      const y1 = (cy - h / 2) * prep.scaleY;
      const x2 = (cx + w / 2) * prep.scaleX;
      const y2 = (cy + h / 2) * prep.scaleY;

      allBoxes.push([x1, y1, x2, y2]);
      allScores.push(score);

      // Keypoints (face_detect.cpp lines 222-223):
      // kps_x = (kps_raw + col) * stride
      const kps: [number, number][] = [];
      for (let k = 0; k < 5; k++) {
        kps.push([
          (kpsData[i * 10 + k * 2]     + col) * stride * prep.scaleX,
          (kpsData[i * 10 + k * 2 + 1] + row) * stride * prep.scaleY,
        ]);
      }
      allKps.push(kps);
    }
  }

  if (allBoxes.length === 0) return null;

  const kept = nms(allBoxes, allScores, NMS_THRESHOLD);
  const best = kept[0];

  return {
    x1: allBoxes[best][0], y1: allBoxes[best][1],
    x2: allBoxes[best][2], y2: allBoxes[best][3],
    score: allScores[best],
    kps: allKps[best],
  };
}
