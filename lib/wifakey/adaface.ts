"use client";

import * as ort from "onnxruntime-web";
import { getAdafaceSession } from "./model-loader";

/**
 * Nhận ảnh khuôn mặt 112×112 RGB Uint8Array (từ alignFace()),
 * trả về embedding Float32Array(512) đã L2-normalize.
 */
export async function getEmbedding(rgbFace: Uint8Array): Promise<Float32Array> {
  if (rgbFace.length !== 112 * 112 * 3) {
    throw new Error(`Expected 112×112×3 = ${112 * 112 * 3} bytes, got ${rgbFace.length}`);
  }

  const session = await getAdafaceSession();

  // Preprocess: HWC uint8 → CHW float32 normalized to [-1, 1]
  // Công thức từ adaface_handler.py: tensor.div_(255).sub_(0.5).div_(0.5)
  const input = new Float32Array(1 * 3 * 112 * 112);
  for (let c = 0; c < 3; c++) {
    for (let h = 0; h < 112; h++) {
      for (let w = 0; w < 112; w++) {
        const srcIdx = (h * 112 + w) * 3 + c;
        const dstIdx = c * 112 * 112 + h * 112 + w;
        input[dstIdx] = (rgbFace[srcIdx] / 255.0 - 0.5) / 0.5;
      }
    }
  }

  const tensor = new ort.Tensor("float32", input, [1, 3, 112, 112]);
  const results = await session.run({ input: tensor });
  const embedding = results["embedding"].data as Float32Array;

  // L2 normalize (model đã normalize trong ONNX wrapper, nhưng verify lại)
  let norm = 0;
  for (let i = 0; i < embedding.length; i++) norm += embedding[i] * embedding[i];
  norm = Math.sqrt(norm);

  if (norm > 1e-6) {
    const normalized = new Float32Array(embedding.length);
    for (let i = 0; i < embedding.length; i++) normalized[i] = embedding[i] / norm;
    return normalized;
  }

  return embedding;
}
