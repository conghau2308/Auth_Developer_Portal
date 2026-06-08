"use client";

// Landmark indices — khớp với use-face-validation.tsx
const LEFT_EYE_IDX = [362, 385, 387, 263, 373, 380];
const RIGHT_EYE_IDX = [33, 160, 158, 133, 153, 144];
const NOSE_TIP_IDX = 1;
const LEFT_MOUTH_IDX = 61;
const RIGHT_MOUTH_IDX = 291;

// Reference points 112×112 từ InsightFace face_processor.py
const REFERENCE_POINTS: [number, number][] = [
  [38.2946, 51.6963], // left eye
  [73.5318, 51.5014], // right eye
  [56.0252, 71.7366], // nose tip
  [41.5493, 92.3655], // left mouth
  [70.7299, 92.2041], // right mouth
];

interface Landmark {
  x: number; // normalized [0,1]
  y: number; // normalized [0,1]
}

function avgLandmarks(
  landmarks: Landmark[],
  indices: number[]
): [number, number] {
  let x = 0;
  let y = 0;
  for (const i of indices) {
    x += landmarks[i].x;
    y += landmarks[i].y;
  }
  return [x / indices.length, y / indices.length];
}

// Hệ số biến đổi similarity (scale, rotate, translate) — 4 tham số
function estimateSimilarityTransform(
  src: [number, number][],
  dst: [number, number][]
): number[] {
  const n = src.length;
  let sx = 0, sy = 0, dx = 0, dy = 0;
  let sxx = 0, syy = 0, sxy = 0, syx = 0;

  for (let i = 0; i < n; i++) {
    sx += src[i][0]; sy += src[i][1];
    dx += dst[i][0]; dy += dst[i][1];
  }
  sx /= n; sy /= n; dx /= n; dy /= n;

  let varSrc = 0;
  for (let i = 0; i < n; i++) {
    const ax = src[i][0] - sx, ay = src[i][1] - sy;
    const bx = dst[i][0] - dx, by = dst[i][1] - dy;
    sxx += ax * bx; syy += ay * by;
    sxy += ax * by; syx += ay * bx;
    varSrc += ax * ax + ay * ay;   // Σ(ax² + ay²) — mẫu số đúng
  }

  // a_re = Σ(ax*bx + ay*by) / Σ(ax²+ay²)
  // a_im = Σ(ax*by - ay*bx) / Σ(ax²+ay²)
  const a = varSrc > 1e-10 ? (sxx + syy) / varSrc : 1;
  const b_ = varSrc > 1e-10 ? (sxy - syx) / varSrc : 0;

  const scale = Math.sqrt(a * a + b_ * b_);
  const cosA = a / (scale || 1);
  const sinA = -b_ / (scale || 1);

  const tx = dx - scale * (cosA * sx - sinA * sy);
  const ty = dy - scale * (sinA * sx + cosA * sy);

  // 2×3 affine matrix row-major: [cosA*scale, -sinA*scale, tx, sinA*scale, cosA*scale, ty]
  return [
    cosA * scale, -sinA * scale, tx,
    sinA * scale,  cosA * scale, ty,
  ];
}

function bilinearWarpAffine(
  imageData: ImageData,
  M: number[], // 2×3 matrix [a,b,tx,c,d,ty]
  outW: number,
  outH: number
): ImageData {
  const { width: srcW, height: srcH, data: src } = imageData;
  const out = new Uint8ClampedArray(outW * outH * 4);

  const a = M[0], b = M[1], tx = M[2];
  const c = M[3], d = M[4], ty = M[5];

  // Invert the 2×2 part for backward mapping
  const det = a * d - b * c;
  const ia = d / det, ib = -b / det;
  const ic = -c / det, id = a / det;

  for (let oy = 0; oy < outH; oy++) {
    for (let ox = 0; ox < outW; ox++) {
      // backward map: source pixel coords
      const px = ia * (ox - tx) + ib * (oy - ty);
      const py = ic * (ox - tx) + id * (oy - ty);

      const x0 = Math.floor(px), y0 = Math.floor(py);
      const x1 = x0 + 1, y1 = y0 + 1;
      const fx = px - x0, fy = py - y0;

      const idx = (oy * outW + ox) * 4;

      if (x0 < 0 || y0 < 0 || x1 >= srcW || y1 >= srcH) {
        out[idx] = out[idx + 1] = out[idx + 2] = 0;
        out[idx + 3] = 255;
        continue;
      }

      const i00 = (y0 * srcW + x0) * 4;
      const i10 = (y0 * srcW + x1) * 4;
      const i01 = (y1 * srcW + x0) * 4;
      const i11 = (y1 * srcW + x1) * 4;

      for (let ch = 0; ch < 3; ch++) {
        out[idx + ch] = Math.round(
          src[i00 + ch] * (1 - fx) * (1 - fy) +
            src[i10 + ch] * fx * (1 - fy) +
            src[i01 + ch] * (1 - fx) * fy +
            src[i11 + ch] * fx * fy
        );
      }
      out[idx + 3] = 255;
    }
  }

  return new ImageData(out, outW, outH);
}

/**
 * Align bằng InsightFace-ordered 5 key points.
 * kps phải theo thứ tự InsightFace: [left_eye, right_eye, nose, left_mouth, right_mouth]
 */
export function alignFaceWithKps(
  imageData: ImageData,
  kps: [number, number][]
): Uint8Array | null {
  if (!kps || kps.length < 5) return null;
  const M = estimateSimilarityTransform(kps, REFERENCE_POINTS);
  return warpToRgb(imageData, M);
}

/**
 * Align bằng YuNet key points — reorder từ YuNet về InsightFace convention.
 * YuNet order:      [right_eye, left_eye, nose, right_mouth, left_mouth]
 * InsightFace order:[left_eye, right_eye, nose, left_mouth,  right_mouth]
 */
export function alignFaceWithYuNetKps(
  imageData: ImageData,
  kps: [number, number][]
): Uint8Array | null {
  if (!kps || kps.length < 5) return null;
  // Reorder YuNet → InsightFace: swap eyes [0↔1], swap mouth corners [3↔4]
  const reordered: [number, number][] = [kps[1], kps[0], kps[2], kps[4], kps[3]];
  const M = estimateSimilarityTransform(reordered, REFERENCE_POINTS);
  return warpToRgb(imageData, M);
}

/**
 * Align bằng MediaPipe landmarks (normalized) — fallback khi không có InsightFace kps.
 */
export function alignFace(
  imageData: ImageData,
  landmarks: Landmark[]
): Uint8Array | null {
  if (!landmarks || landmarks.length < 468) return null;

  const W = imageData.width;
  const H = imageData.height;

  const toPixel = (norm: [number, number]): [number, number] => [norm[0] * W, norm[1] * H];

  const srcPoints: [number, number][] = [
    toPixel(avgLandmarks(landmarks, LEFT_EYE_IDX)),
    toPixel(avgLandmarks(landmarks, RIGHT_EYE_IDX)),
    [landmarks[NOSE_TIP_IDX].x * W, landmarks[NOSE_TIP_IDX].y * H],
    [landmarks[LEFT_MOUTH_IDX].x * W, landmarks[LEFT_MOUTH_IDX].y * H],
    [landmarks[RIGHT_MOUTH_IDX].x * W, landmarks[RIGHT_MOUTH_IDX].y * H],
  ];

  const M = estimateSimilarityTransform(srcPoints, REFERENCE_POINTS);
  return warpToRgb(imageData, M);
}

function warpToRgb(imageData: ImageData, M: number[]): Uint8Array {
  const aligned = bilinearWarpAffine(imageData, M, 112, 112);
  const rgb = new Uint8Array(112 * 112 * 3);
  for (let i = 0; i < 112 * 112; i++) {
    rgb[i * 3]     = aligned.data[i * 4];
    rgb[i * 3 + 1] = aligned.data[i * 4 + 1];
    rgb[i * 3 + 2] = aligned.data[i * 4 + 2];
  }
  return rgb;
}
