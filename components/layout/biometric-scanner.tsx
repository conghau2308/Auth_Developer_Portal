"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
    CheckCircle2, RefreshCw, Camera, RotateCcw, AlertTriangle, ScanFace
} from "lucide-react";
import { Button } from "../ui/button";
import { useFaceValidation } from "@/hooks/use-face-validation";
import { ValidationOverlay } from "./validation-overlay";

// ─── Types ────────────────────────────────────────────────────────────────────

type ScanState = "idle" | "camera" | "scanning" | "success" | "error";

interface BiometricScannerProps {
    mode?: "signup" | "login";
    onSuccess: () => void;
    onReset?: () => void;
    onCapture?: (base64: string) => void;
    initialImage?: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BiometricScanner({
    mode, onSuccess, onReset, onCapture, initialImage,
}: BiometricScannerProps) {
    const [state, setState] = useState<ScanState>(initialImage ? "success" : "idle");
    const [capturedImage, setCapturedImage] = useState<string | null>(
        initialImage ? `data:image/jpeg;base64,${initialImage}` : null
    );
    const [errorMsg, setErrorMsg] = useState("");
    const [progress, setProgress] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Face validation hook ─────────────────────────────────────────────────
    const { state: validationState, startValidation, stopValidation, resetValidation } =
        useFaceValidation({
            mode,
            onFail: (reason) => {
                setErrorMsg(
                    reason === "no_face" ? "Không phát hiện khuôn mặt." :
                        reason === "multiple_faces" ? "Phát hiện nhiều khuôn mặt." :
                            reason === "liveness_fail" ? "Không xác minh được người thật." :
                                "Xác minh thất bại. Vui lòng thử lại."
                );
                setState("error");
                stopCamera();
            },
        });

    // Tự động chụp sau khi validation pass
    useEffect(() => {
        if (validationState.phase === "pass" && state === "camera") {
            capturePhoto();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [validationState.phase]);

    // ── Camera helpers ───────────────────────────────────────────────────────
    const stopCamera = useCallback(() => {
        stopValidation();
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    }, [stopValidation]);

    useEffect(() => () => stopCamera(), [stopCamera]);

    const startCamera = useCallback(async () => {
        setErrorMsg("");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                // Bắt đầu validation ngay khi video ready
                startValidation(videoRef.current);
            }
            setState("camera");
        } catch {
            setErrorMsg("Không thể truy cập camera. Vui lòng kiểm tra quyền và thử lại.");
            setState("error");
        }
    }, [startValidation]);

    // ── Capture ──────────────────────────────────────────────────────────────
    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 400;
        canvas.height = video.videoHeight || 400;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        setCapturedImage(dataUrl);
        stopCamera();
        setProgress(0);
        setState("scanning");
        onCapture?.(dataUrl.split(",")[1]);
    }, [stopCamera, onCapture]);

    // ── Scanning progress animation ──────────────────────────────────────────
    useEffect(() => {
        if (state !== "scanning") return;
        setProgress(0);
        let p = 0;
        progressRef.current = setInterval(() => {
            p += 100 / 28;
            if (p >= 100) {
                p = 100;
                clearInterval(progressRef.current!);
                setState("success");
                onSuccess();
            }
            setProgress(Math.min(p, 100));
        }, 100);
        return () => clearInterval(progressRef.current!);
    }, [state, onSuccess]);

    // ── Reset ────────────────────────────────────────────────────────────────
    const reset = () => {
        stopCamera();
        resetValidation();
        setCapturedImage(null);
        setErrorMsg("");
        setProgress(0);
        setState("idle");
        onReset?.();
    };

    // ── Badge config ─────────────────────────────────────────────────────────
    const badge = {
        idle: { label: "Not verified", dot: "bg-muted-foreground/50", text: "text-foreground/60" },
        // Trong badge config, thêm case recenter:
        camera: {
            label: validationState.phase === "quality" ? "Quality check"
                : validationState.phase === "liveness" ? "Liveness"
                    : validationState.phase === "recenter" ? "Nhìn thẳng vào giữa"  // ← thêm
                        : "Live",
            dot: validationState.phase === "recenter"
                ? "bg-amber-400 animate-pulse"   // ← màu vàng để phân biệt
                : "bg-primary animate-pulse",
            text: "text-foreground/70"
        },
        scanning: { label: "Scanning...", dot: "bg-amber-400 animate-pulse", text: "text-foreground/70" },
        success: { label: "Verified", dot: "bg-emerald-500", text: "text-foreground/70" },
        error: { label: "Camera error", dot: "bg-destructive", text: "text-foreground/60" },
    }[state];

    // ── Scanline color theo phase ─────────────────────────────────────────────
    const scanlineColor = validationState.phase === "pass"
        ? "hsl(142 71% 45%)"
        : "hsl(var(--primary))";

    return (
        <div className="flex flex-col items-center w-full gap-5">

            {/* ── Main frame ── */}
            <div className="relative flex items-center justify-center" style={{ width: 232, height: 232 }}>

                {/* Outer glow */}
                <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                        boxShadow:
                            state === "scanning"
                                ? "0 0 0 2px hsl(var(--primary)/0.4), 0 0 28px hsl(var(--primary)/0.1)"
                                : state === "success"
                                    ? "0 0 0 2px hsl(142 71% 45%/0.45), 0 0 28px hsl(142 71% 45%/0.1)"
                                    : state === "camera"
                                        ? validationState.phase === "pass"
                                            ? "0 0 0 2px hsl(142 71% 45%/0.45)"
                                            : "0 0 0 1.5px hsl(var(--primary)/0.28)"
                                        : "none",
                        transition: "box-shadow 0.5s ease",
                    }}
                />

                {/* Circle */}
                <div
                    className="relative overflow-hidden rounded-full flex items-center justify-center"
                    style={{
                        width: 224, height: 224,
                        background: "hsl(var(--muted)/0.3)",
                        border: `1px solid ${state === "success"
                            ? "hsl(142 71% 45%/0.45)"
                            : state === "scanning" || state === "camera"
                                ? validationState.phase === "pass"
                                    ? "hsl(142 71% 45%/0.45)"
                                    : "hsl(var(--primary)/0.38)"
                                : "hsl(var(--border)/0.7)"
                            }`,
                        transition: "border-color 0.4s",
                    }}
                >
                    {/* ── IDLE ── */}
                    {state === "idle" && (
                        <div className="flex flex-col items-center justify-center text-primary/40 animate-pulse">
                            <ScanFace size={84} strokeWidth={1} />
                            <div className="mt-4 text-[10px] tracking-[0.2em] font-semibold uppercase opacity-60">
                                Face Scan
                            </div>
                        </div>
                    )}

                    {/* ── CAMERA ── */}
                    <video
                        ref={videoRef}
                        autoPlay playsInline muted
                        className="absolute inset-0 w-full h-full object-cover rounded-full"
                        style={{
                            transform: "scaleX(-1)",
                            opacity: state === "camera" ? 1 : 0,
                            display: state === "camera" ? "block" : "none",
                        }}
                    />

                    {/* Camera overlays */}
                    {state === "camera" && (
                        <div className="absolute inset-0 pointer-events-none">
                            {/* Face guide ellipse — xanh khi pass, primary khi đang scan */}
                            <svg viewBox="0 0 224 224" fill="none" className="w-full h-full">
                                <ellipse
                                    cx="112" cy="112" rx="65" ry="80"
                                    stroke={validationState.phase === "pass" ? "hsl(142 71% 45%)" : "hsl(var(--primary))"}
                                    strokeWidth="1.5"
                                    strokeDasharray={validationState.phase === "liveness" ? "none" : "7 4"}
                                    opacity="0.6"
                                    style={{ transition: "stroke 0.4s" }}
                                />
                                {/* Checkmark khi pass */}
                                {validationState.phase === "pass" && (
                                    <path
                                        d="M80 112 L100 132 L144 88"
                                        stroke="hsl(142 71% 45%)" strokeWidth="3"
                                        strokeLinecap="round" strokeLinejoin="round"
                                        fill="none"
                                        style={{ animation: "drawCheck 0.4s ease forwards" }}
                                    />
                                )}
                            </svg>
                            {/* Corner brackets */}
                            {(["tl", "tr", "bl", "br"] as const).map(pos => (
                                <div key={pos} className={`absolute ${pos.includes("t") ? "top-3" : "bottom-3"} ${pos.includes("l") ? "left-3" : "right-3"} w-4 h-4`}
                                    style={{
                                        borderTop: pos.includes("t") ? `1.5px solid hsl(var(--primary)/0.65)` : "none",
                                        borderBottom: pos.includes("b") ? `1.5px solid hsl(var(--primary)/0.65)` : "none",
                                        borderLeft: pos.includes("l") ? `1.5px solid hsl(var(--primary)/0.65)` : "none",
                                        borderRight: pos.includes("r") ? `1.5px solid hsl(var(--primary)/0.65)` : "none",
                                    }}
                                />
                            ))}

                            {/* Scanline — chỉ hiện khi đang liveness */}
                            {validationState.phase === "liveness" && (
                                <div className="absolute left-0 w-full pointer-events-none"
                                    style={{
                                        height: 2,
                                        background: scanlineColor,
                                        boxShadow: `0 0 10px 2px ${scanlineColor}50`,
                                        animation: "scanline 1.6s ease-in-out infinite",
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {/* ── SCANNING / SUCCESS ── */}
                    {(state === "scanning" || state === "success") && capturedImage && (
                        <>
                            <img
                                src={capturedImage}
                                alt="Captured"
                                className="absolute inset-0 w-full h-full object-cover rounded-full"
                                style={{ opacity: state === "success" ? 0.82 : 0.72, transition: "opacity 0.5s" }}
                            />
                            {state === "scanning" && (
                                <>
                                    <div className="absolute left-0 w-full pointer-events-none"
                                        style={{
                                            height: 2,
                                            background: "hsl(var(--primary))",
                                            boxShadow: "0 0 10px 2px hsl(var(--primary)/0.5)",
                                            animation: "scanline 1.4s ease-in-out infinite",
                                        }}
                                    />
                                    <div className="absolute inset-0 rounded-full pointer-events-none"
                                        style={{
                                            backgroundImage: "linear-gradient(hsl(var(--primary)/0.09) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.09) 1px, transparent 1px)",
                                            backgroundSize: "24px 24px",
                                        }}
                                    />
                                </>
                            )}
                            {state === "success" && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-full"
                                    style={{ background: "hsl(142 71% 45%/0.15)", backdropFilter: "blur(2px)" }}>
                                    <div style={{ animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
                                        <CheckCircle2 size={52} style={{ color: "hsl(142 71% 42%)" }} />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* ── ERROR ── */}
                    {state === "error" && (
                        <AlertTriangle size={36} className="text-destructive opacity-50" />
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Status badge */}
                <div
                    className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-background/90 shadow-sm"
                    style={{ backdropFilter: "blur(10px)", border: "1px solid hsl(var(--border)/0.5)" }}
                >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${badge.dot}`} />
                    <span className={`text-[10px] tracking-wide whitespace-nowrap ${badge.text}`}>
                        {badge.label}
                    </span>
                </div>
            </div>

            {/* ── Progress bar ── */}
            <div className="w-full rounded-full overflow-hidden"
                style={{ height: 3, background: "hsl(var(--muted))", opacity: state === "scanning" ? 1 : 0, transition: "opacity 0.3s" }}>
                <div className="h-full rounded-full"
                    style={{ width: `${progress}%`, background: "hsl(var(--primary))", boxShadow: "0 0 8px hsl(var(--primary)/0.4)", transition: "width 0.1s linear" }}
                />
            </div>

            {/* ── Actions + Validation Overlay ── */}
            <div className="flex flex-col items-center gap-3 w-full" style={{ minHeight: 80 }}>

                {/* IDLE */}
                {state === "idle" && (
                    <>
                        <p className="text-sm text-muted-foreground text-center">
                            Đặt khuôn mặt vào khung để bắt đầu xác minh
                        </p>
                        <Button onClick={startCamera}
                            className="flex items-center gap-2 rounded-xl text-sm font-semibold transition-all active:scale-[0.97] hover:opacity-90"
                            style={{ padding: "10px 22px", background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", boxShadow: "0 4px 16px hsl(var(--primary)/0.2)" }}>
                            <Camera size={15} />
                            Mở camera
                        </Button>
                    </>
                )}

                {/* CAMERA — hiện ValidationOverlay + nút huỷ */}
                {state === "camera" && (
                    <>
                        <ValidationOverlay validationState={validationState} />
                        <Button onClick={reset}
                            className="flex items-center gap-2 rounded-xl text-sm font-semibold text-foreground/90 hover:text-foreground transition-all active:scale-[0.97] hover:bg-muted/50"
                            style={{ padding: "8px 16px", border: "1px solid hsl(var(--border))" }}>
                            <RotateCcw size={14} />
                            Huỷ
                        </Button>
                    </>
                )}

                {/* SCANNING */}
                {state === "scanning" && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <RefreshCw size={13} className="animate-spin text-primary" />
                        Đang phân tích sinh trắc học...
                    </p>
                )}

                {/* SUCCESS */}
                {state === "success" && (
                    <>
                        <p className="text-sm font-semibold flex items-center gap-2"
                            style={{ color: "hsl(142 71% 38%)" }}>
                            <CheckCircle2 size={14} />
                            Danh tính đã được xác minh
                        </p>
                        {/* Hiện điểm tin cậy từ validation */}
                        {validationState.score > 0 && (
                            <span className="text-[11px] px-2.5 py-0.5 rounded-full"
                                style={{ background: "hsl(142 71% 45%/0.1)", color: "hsl(142 71% 38%)" }}>
                                Điểm tin cậy: {validationState.score}/100
                            </span>
                        )}
                        <Button onClick={reset}
                            className="flex items-center gap-1.5 rounded-lg text-xs font-semibold text-primary/90 hover:text-primary hover:bg-primary/10 transition-all active:scale-[0.97]"
                            style={{ padding: "8px 16px", border: "1px solid hsl(var(--primary)/0.4)", background: "transparent" }}>
                            <RotateCcw size={13} />
                            Chụp lại
                        </Button>
                    </>
                )}

                {/* ERROR */}
                {state === "error" && (
                    <>
                        <p className="text-xs text-destructive text-center max-w-[220px]">{errorMsg}</p>
                        <Button onClick={reset}
                            className="flex items-center gap-2 rounded-xl text-xs font-semibold transition-all active:scale-[0.97]"
                            style={{ padding: "8px 16px", background: "hsl(var(--destructive)/0.08)", color: "hsl(var(--destructive))", border: "0.5px solid hsl(var(--destructive)/0.25)" }}>
                            <RotateCcw size={12} />
                            Thử lại
                        </Button>
                    </>
                )}
            </div>

            {/* ── Keyframes ── */}
            <style>{`
                @keyframes scanline {
                    0%   { top: 6%;  opacity: 0; }
                    8%   { top: 8%;  opacity: 1; }
                    90%  { top: 88%; opacity: 1; }
                    100% { top: 92%; opacity: 0; }
                }
                @keyframes popIn {
                    0%   { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1);   opacity: 1; }
                }
                @keyframes drawCheck {
                    from { stroke-dashoffset: 80; stroke-dasharray: 80; }
                    to   { stroke-dashoffset: 0;  stroke-dasharray: 80; }
                }
                @keyframes fadeSlide {
                    from { opacity: 0; transform: translateY(4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}