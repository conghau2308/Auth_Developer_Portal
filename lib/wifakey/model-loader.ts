"use client";

import * as ort from "onnxruntime-web";

// URL gốc của WiFaKey_252 FastAPI static server
const MODEL_BASE_URL =
  process.env.NEXT_PUBLIC_WIFAKEY_MODEL_URL ?? "http://localhost:8002/models";

let adafaceSession: ort.InferenceSession | null = null;
let decoderSession: ort.InferenceSession | null = null;
let antispoofSession: ort.InferenceSession | null = null;

async function createSession(url: string): Promise<ort.InferenceSession> {
  return ort.InferenceSession.create(url, {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
  });
}

export async function getAdafaceSession(): Promise<ort.InferenceSession> {
  if (!adafaceSession) {
    adafaceSession = await createSession(`${MODEL_BASE_URL}/adaface_ir101.onnx`);
  }
  return adafaceSession;
}

export async function getDecoderSession(): Promise<ort.InferenceSession> {
  if (!decoderSession) {
    decoderSession = await createSession(
      `${MODEL_BASE_URL}/neural_ms_decoder.onnx`
    );
  }
  return decoderSession;
}

export async function getAntispoofSession(): Promise<ort.InferenceSession> {
  if (!antispoofSession) {
    antispoofSession = await createSession(
      `${MODEL_BASE_URL}/anti-spoofing.onnx`
    );
  }
  return antispoofSession;
}

export interface WiFaKeyData {
  M_matrix: { shape: number[]; dtype: string; data: number[] };
  binarization_intervals: { shape: number[]; dtype: string; data: number[] };
  G_matrix: { shape: number[]; dtype: string; data: number[] };
}

let wifakeyData: WiFaKeyData | null = null;

export async function getWiFaKeyData(): Promise<WiFaKeyData> {
  if (wifakeyData) return wifakeyData;

  const [mRes, intRes, gRes] = await Promise.all([
    fetch(`${MODEL_BASE_URL}/M_matrix.json`),
    fetch(`${MODEL_BASE_URL}/binarization_intervals.json`),
    fetch(`${MODEL_BASE_URL}/G_matrix.json`),
  ]);

  wifakeyData = {
    M_matrix: await mRes.json(),
    binarization_intervals: await intRes.json(),
    G_matrix: await gRes.json(),
  };

  return wifakeyData;
}

/**
 * Preload tất cả ONNX models + data files trong background.
 * Gọi sớm (khi camera mở) để tránh cold-start khi user chụp ảnh.
 * Không block UI — chạy fire-and-forget.
 */
export function preloadWiFaKeyModels(): void {
  // Preload các model nặng trong background khi camera mở
  // YuNet (224KB) load đủ nhanh nên không cần preload
  getAntispoofSession().catch(() => {});  // 600KB
  getWiFaKeyData().catch(() => {});       // data files
  getDecoderSession().catch(() => {});    // 76MB
  getAdafaceSession().catch(() => {});    // 248MB — load trước để tránh chờ khi chụp
}
