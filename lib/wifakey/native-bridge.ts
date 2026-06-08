"use client";

/**
 * WebSocket bridge tới WiFaKey Native Authenticator (ws://127.0.0.1:7825).
 *
 * Mỗi lần gọi mở kết nối mới, gửi request, chờ 1 response rồi đóng.
 * Native app tự mở cửa sổ camera — portal chỉ gửi/nhận JSON.
 */

const WS_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_NATIVE_APP_WS_URL) ||
  "ws://127.0.0.1:7825";

const ERR_NOT_RUNNING =
  "WiFaKey Authenticator chưa chạy. Hãy khởi động ứng dụng WiFaKeyAuth.exe trên máy tính của bạn.";

// ─── Internal helper ─────────────────────────────────────────────────────────

function wsRequest<T>(msg: object, timeoutMs = 90_000): Promise<T> {
  return new Promise((resolve, reject) => {
    let settled = false;

    const done = (fn: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn();
    };

    let ws: WebSocket;
    try {
      ws = new WebSocket(WS_URL);
    } catch {
      reject(new Error(ERR_NOT_RUNNING));
      return;
    }

    const timer = setTimeout(() => {
      ws.close();
      done(() => reject(new Error("Hết thời gian chờ — vui lòng thử lại.")));
    }, timeoutMs);

    ws.onopen = () => ws.send(JSON.stringify(msg));

    ws.onmessage = (e) => {
      let resp: any;
      try {
        resp = JSON.parse(e.data as string);
      } catch {
        done(() => reject(new Error("Response không hợp lệ từ native app.")));
        return;
      }
      ws.close();
      if (resp.action === "error") {
        done(() => reject(new Error(resp.message || "Lỗi từ native authenticator.")));
      } else {
        done(() => resolve(resp as T));
      }
    };

    ws.onerror = () =>
      done(() => reject(new Error(ERR_NOT_RUNNING)));

    ws.onclose = (e) => {
      if (!settled && !e.wasClean) {
        done(() => reject(new Error(ERR_NOT_RUNNING)));
      }
    };
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface NativeEnrollResult {
  helper_data_b64: string;
  mask_b64: string;
  key_hash_b64: string;
}

/**
 * Kiểm tra native app có đang chạy và sẵn sàng không.
 */
export async function checkNativeApp(): Promise<boolean> {
  try {
    const r = await wsRequest<{ ok: boolean; ready: boolean }>(
      { action: "status" },
      5_000
    );
    return r.ok && r.ready;
  } catch {
    return false;
  }
}

/**
 * Yêu cầu native app mở camera và thực hiện enrollment.
 * Native app trả về helper_data, mask, key_hash.
 */
export async function enrollWithNativeApp(): Promise<NativeEnrollResult> {
  const r = await wsRequest<NativeEnrollResult & { ok: boolean }>(
    { action: "enroll" },
    90_000
  );
  if (!r.ok) throw new Error("Enrollment thất bại.");
  return {
    helper_data_b64: r.helper_data_b64,
    mask_b64: r.mask_b64,
    key_hash_b64: r.key_hash_b64,
  };
}

/**
 * Yêu cầu native app verify khuôn mặt với δ đã có.
 * Trả về c_prime_b64 (noisy codeword c' = b_selected ⊕ helper_data) để
 * gửi lên IdP — IdP sẽ tự decode LDPC + tái tạo khoá phía server.
 */
export async function verifyWithNativeApp(
  helper_data_b64: string,
  mask_b64: string
): Promise<string> {
  const r = await wsRequest<{ ok: boolean; c_prime_b64: string }>(
    { action: "verify", helper_data_b64, mask_b64 },
    90_000
  );
  if (!r.ok || !r.c_prime_b64) throw new Error("Xác thực khuôn mặt thất bại.");
  return r.c_prime_b64;
}
