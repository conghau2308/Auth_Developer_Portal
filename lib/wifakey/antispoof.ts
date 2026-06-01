"use client";

import * as ort from "onnxruntime-web";
import { getAntispoofSession } from "./model-loader";
import { detectFace, type FaceBox } from "./face-detect";

// Repo gốc (face-antispoof-onnx) dùng default p=0.5 → logit(0.5) = 0.0
// → dùng đúng threshold gốc trước, tune sau nếu cần
const LIVENESS_LOGIT_THRESHOLD = 1.386; // = log(0.8/0.2) — đúng calibration của model
const BBOX_EXPANSION = 1.5;  // bbox_expansion_factor trong Python (default)
const MODEL_INPUT_SIZE = 128; // anti-spoofing.onnx input: (B, 3, 128, 128)

interface Landmark { x: number; y: number }

// MediaPipe FaceMesh face oval / silhouette — 36 điểm contour mặt
// Tương đương bbox chặt của InsightFace (không bao tóc/cổ/tai quá nhiều)
const FACE_OVAL_IDX = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
  397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
  172,  58, 132,  93, 234, 127, 162,  21,  54, 103,  67, 109,
];

/**
 * Tính face bounding box từ face oval landmarks — tương đương InsightFace bbox.
 * Không dùng tất cả 468 điểm vì sẽ bao cả tóc/tai → crop quá lớn → model kém.
 */
function getFaceBbox(landmarks: Landmark[], W: number, H: number) {
  let minX = 1, minY = 1, maxX = 0, maxY = 0;
  for (const idx of FACE_OVAL_IDX) {
    const lm = landmarks[idx];
    if (!lm) continue;
    if (lm.x < minX) minX = lm.x;
    if (lm.y < minY) minY = lm.y;
    if (lm.x > maxX) maxX = lm.x;
    if (lm.y > maxY) maxY = lm.y;
  }
  return {
    x1: minX * W, y1: minY * H,
    x2: maxX * W, y2: maxY * H,
  };
}

/**
 * Square crop + reflect padding — mirrors Python's _crop_square_reflect.
 */
function cropSquareReflect(
  src: Uint8ClampedArray, srcW: number, srcH: number,
  x1: number, y1: number, x2: number, y2: number,
  expansionFactor: number
): { data: Uint8ClampedArray; size: number } {
  const w = x2 - x1, h = y2 - y1;
  const maxDim = Math.max(w, h);
  const cx = x1 + w / 2, cy = y1 + h / 2;
  const cropSize = Math.round(maxDim * expansionFactor);

  const ox = Math.round(cx - cropSize / 2);
  const oy = Math.round(cy - cropSize / 2);

  const out = new Uint8ClampedArray(cropSize * cropSize * 4);

  for (let row = 0; row < cropSize; row++) {
    for (let col = 0; col < cropSize; col++) {
      // Reflect padding: mirror src coords if out of bounds
      let sx = ox + col;
      let sy = oy + row;

      // BORDER_REFLECT_101: reflect around the border pixel (not including it)
      if (sx < 0) sx = -sx;
      if (sy < 0) sy = -sy;
      if (sx >= srcW) sx = 2 * srcW - sx - 2;
      if (sy >= srcH) sy = 2 * srcH - sy - 2;

      sx = Math.max(0, Math.min(srcW - 1, sx));
      sy = Math.max(0, Math.min(srcH - 1, sy));

      const srcIdx = (sy * srcW + sx) * 4;
      const dstIdx = (row * cropSize + col) * 4;
      out[dstIdx] = src[srcIdx];
      out[dstIdx + 1] = src[srcIdx + 1];
      out[dstIdx + 2] = src[srcIdx + 2];
      out[dstIdx + 3] = 255;
    }
  }

  return { data: out, size: cropSize };
}

/**
 * Letterbox resize với reflect padding — mirrors Python's _preprocess_liveness.
 * Input: RGBA Uint8ClampedArray (cropSize × cropSize)
 * Output: Float32Array CHW (1, 3, 128, 128) normalized [0,1]
 */
/**
 * Resize với INTER_AREA (area averaging) khi downscale — khớp Python cv2.INTER_AREA.
 * Tốt hơn bilinear vì tránh aliasing khi crop lớn → 128px.
 * Khi upscale (ratio > 1) dùng bilinear (INTER_LANCZOS4 quá phức tạp cho browser).
 */
function resizeArea(
  src: Uint8ClampedArray, srcW: number, srcH: number,
  dstW: number, dstH: number
): Float32Array {
  const out = new Float32Array(dstW * dstH * 3);
  const scaleX = srcW / dstW, scaleY = srcH / dstH;

  if (scaleX <= 1 && scaleY <= 1) {
    // Upscale — bilinear
    for (let y = 0; y < dstH; y++) {
      for (let x = 0; x < dstW; x++) {
        const sx = x * scaleX, sy = y * scaleY;
        const x0 = Math.floor(sx), y0 = Math.floor(sy);
        const x1 = Math.min(x0+1, srcW-1), y1 = Math.min(y0+1, srcH-1);
        const fx = sx-x0, fy = sy-y0;
        for (let c = 0; c < 3; c++) {
          out[(y*dstW+x)*3+c] =
            src[(y0*srcW+x0)*4+c]*(1-fx)*(1-fy) +
            src[(y0*srcW+x1)*4+c]*fx*(1-fy) +
            src[(y1*srcW+x0)*4+c]*(1-fx)*fy +
            src[(y1*srcW+x1)*4+c]*fx*fy;
        }
      }
    }
  } else {
    // Downscale — area averaging (INTER_AREA)
    for (let y = 0; y < dstH; y++) {
      for (let x = 0; x < dstW; x++) {
        const x0 = Math.floor(x * scaleX), y0 = Math.floor(y * scaleY);
        const x1 = Math.min(Math.ceil((x+1) * scaleX), srcW);
        const y1 = Math.min(Math.ceil((y+1) * scaleY), srcH);
        const area = (x1-x0) * (y1-y0);
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let sy = y0; sy < y1; sy++)
            for (let sx = x0; sx < x1; sx++)
              sum += src[(sy*srcW+sx)*4+c];
          out[(y*dstW+x)*3+c] = sum / area;
        }
      }
    }
  }
  return out;
}

function preprocessLiveness(
  cropData: Uint8ClampedArray, cropSize: number, targetSize: number
): Float32Array {
  const ratio = targetSize / cropSize;
  const scaledW = Math.round(cropSize * ratio); // = targetSize for square crop
  const scaledH = Math.round(cropSize * ratio);

  // Resize với area averaging khi downscale (khớp cv2.INTER_AREA)
  const resized = resizeArea(cropData, cropSize, cropSize, scaledW, scaledH);

  // Letterbox padding (reflect) to targetSize×targetSize
  const padTop  = Math.floor((targetSize - scaledH) / 2);
  const padLeft = Math.floor((targetSize - scaledW) / 2);

  const chw = new Float32Array(3 * targetSize * targetSize);

  for (let y = 0; y < targetSize; y++) {
    for (let x = 0; x < targetSize; x++) {
      let sy = y - padTop, sx = x - padLeft;
      if (sy < 0) sy = -sy;
      if (sx < 0) sx = -sx;
      if (sy >= scaledH) sy = 2*scaledH - sy - 2;
      if (sx >= scaledW) sx = 2*scaledW - sx - 2;
      sy = Math.max(0, Math.min(scaledH-1, sy));
      sx = Math.max(0, Math.min(scaledW-1, sx));
      for (let c = 0; c < 3; c++) {
        chw[c*targetSize*targetSize + y*targetSize + x] =
          resized[(sy*scaledW+sx)*3+c] / 255.0;
      }
    }
  }

  return chw;
}

/**
 * Chạy MiniFAS anti-spoofing trên un-mirrored ImageData.
 * Dùng det_10g.onnx (InsightFace) để lấy face bbox — đúng pipeline như Python.
 * Fallback về MediaPipe face oval nếu det_10g không detect được.
 *
 * score = real_logit - spoof_logit
 * isReal = score > threshold
 */
export async function checkLiveness(
  imageData: ImageData,
  landmarks: Landmark[]
): Promise<{ isReal: boolean; score: number; detected: FaceBox | null }> {
  const { width: W, height: H, data: pixels } = imageData;

  // Face detection bằng YuNet — đúng pipeline face-antispoof-onnx
  // Fallback về MediaPipe face oval nếu YuNet không detect được
  let detected: FaceBox | null = null;
  let x1: number, y1: number, x2: number, y2: number;
  try {
    detected = await detectFace(imageData);
    if (detected) {
      x1 = detected.x1; y1 = detected.y1;
      x2 = detected.x2; y2 = detected.y2;
    } else {
      const fb = getFaceBbox(landmarks, W, H);
      x1 = fb.x1; y1 = fb.y1; x2 = fb.x2; y2 = fb.y2;
    }
  } catch {
    const fb = getFaceBbox(landmarks, W, H);
    x1 = fb.x1; y1 = fb.y1; x2 = fb.x2; y2 = fb.y2;
  }

  // 2. Square crop + reflect padding
  const { data: cropped, size: cropSize } = cropSquareReflect(
    pixels, W, H, x1, y1, x2, y2, BBOX_EXPANSION
  );

  if (cropSize <= 0) return { isReal: false, score: -Infinity, detected };

  // 3. Preprocess → CHW float32 (1, 3, 128, 128) normalized [0,1]
  const chw = preprocessLiveness(cropped, cropSize, MODEL_INPUT_SIZE);

  // 4. ONNX inference
  const session = await getAntispoofSession();
  const tensor = new ort.Tensor("float32", chw, [1, 3, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE]);
  const results = await session.run({ input: tensor });
  const logits = results["output"].data as Float32Array;

  const realLogit = logits[0];
  const spoofLogit = logits[1];
  const score = realLogit - spoofLogit;

  return { isReal: score >= LIVENESS_LOGIT_THRESHOLD, score, detected };
}
