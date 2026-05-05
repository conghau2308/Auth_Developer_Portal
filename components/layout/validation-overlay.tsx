"use client";

import { Challenge, QualityResult, ValidationState } from "@/hooks/use-face-validation";
import { CheckCircle2, AlertTriangle, Eye, ArrowLeft, ArrowRight, MoveVertical } from "lucide-react";

interface ValidationOverlayProps {
    validationState: ValidationState;
}

// ─── Challenge config ─────────────────────────────────────────────────────────

const CHALLENGE_CONFIG: Record<Challenge, { icon: React.ReactNode; label: string; sub: string }> = {
    blink: {
        icon: <Eye size={20} />,
        label: "Chớp mắt 2 lần",
        sub: "Nhắm và mở mắt tự nhiên",
    },
    turn_left: {
        icon: <ArrowLeft size={20} />,
        label: "Quay đầu sang phải",
        sub: "Giữ 1 giây rồi nhìn thẳng lại",
    },
    turn_right: {
        icon: <ArrowRight size={20} />,
        label: "Quay đầu sang phải",
        sub: "Giữ 1 giây rồi nhìn thẳng lại",
    },
    nod: {
        icon: <MoveVertical size={20} />,
        label: "Gật đầu nhẹ",
        sub: "Cúi xuống rồi ngẩng lại",
    },
};

// ─── Quality indicator ────────────────────────────────────────────────────────

function QualityBar({ label, value, min = 0, max = 100, good }: {
    label: string; value: number; min?: number; max?: number; good: boolean;
}) {
    const pct = Math.round(((value - min) / (max - min)) * 100);
    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground w-20 shrink-0">{label}</span>
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                        width: `${Math.min(100, Math.max(0, pct))}%`,
                        background: good ? "hsl(142 71% 45%)" : "hsl(var(--primary))",
                    }}
                />
            </div>
            <span className={`text-[10px] font-medium w-6 text-right ${good ? "text-emerald-500" : "text-muted-foreground"}`}>
                {good ? "✓" : `${pct}%`}
            </span>
        </div>
    );
}

// ─── Phase: quality ───────────────────────────────────────────────────────────

function QualityPhase({ quality }: { quality: QualityResult | null }) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-xs text-center text-muted-foreground mb-1">
                Đang kiểm tra chất lượng hình ảnh...
            </p>
            <QualityBar label="Độ nét" value={quality?.blur ?? 0} good={(quality?.blur ?? 0) > 25} />
            <QualityBar label="Ánh sáng" value={quality?.brightness ?? 50} good={(quality?.brightness ?? 0) > 20 && (quality?.brightness ?? 0) < 90} />
            <QualityBar label="Kích thước" value={quality?.faceSize ?? 0} good={(quality?.faceSize ?? 0) > 10} />
            <QualityBar label="Vị trí" value={(quality?.faceCentrality ?? 0) * 100} good={(quality?.faceCentrality ?? 0) > 0.5} />
        </div>
    );
}

// ─── Phase: liveness ─────────────────────────────────────────────────────────

function LivenessPhase({ state }: { state: ValidationState }) {
    const { currentChallenge, challengesDone, challengesRequired } = state;
    const cfg = currentChallenge ? CHALLENGE_CONFIG[currentChallenge] : null;

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Progress dots */}
            <div className="flex gap-1.5">
                {challengesRequired.map((c, i) => {
                    const done = challengesDone.includes(c);
                    const active = c === currentChallenge;
                    return (
                        <div
                            key={c}
                            className="rounded-full transition-all duration-300"
                            style={{
                                width: active ? 20 : 8,
                                height: 8,
                                background: done
                                    ? "hsl(142 71% 45%)"
                                    : active
                                        ? "hsl(var(--primary))"
                                        : "hsl(var(--muted-foreground)/0.3)",
                            }}
                        />
                    );
                })}
            </div>

            {/* Current challenge */}
            {cfg && (
                <div
                    className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl"
                    style={{
                        background: "hsl(var(--primary)/0.08)",
                        border: "1px solid hsl(var(--primary)/0.2)",
                        animation: "fadeSlide 0.3s ease",
                    }}
                >
                    <div className="text-primary flex items-center gap-1.5 font-semibold text-sm">
                        {cfg.icon}
                        {cfg.label}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{cfg.sub}</p>
                </div>
            )}

            {/* Done challenges */}
            {challengesDone.length > 0 && (
                <div className="flex gap-1 flex-wrap justify-center">
                    {challengesDone.map(c => (
                        <span
                            key={c}
                            className="text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-full"
                            style={{ background: "hsl(142 71% 45%/0.12)", color: "hsl(142 71% 38%)" }}
                        >
                            <CheckCircle2 size={10} />
                            {CHALLENGE_CONFIG[c].label}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Phase: pass ──────────────────────────────────────────────────────────────

function PassPhase({ score }: { score: number }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: "hsl(142 71% 38%)" }}>
                <CheckCircle2 size={16} />
                Xác minh sinh trắc học thành công
            </div>
            <div
                className="text-[11px] px-3 py-1 rounded-full"
                style={{ background: "hsl(142 71% 45%/0.1)", color: "hsl(142 71% 38%)" }}
            >
                Điểm tin cậy: {score}/100
            </div>
        </div>
    );
}

// ─── Phase: fail ──────────────────────────────────────────────────────────────

function FailPhase({ reason }: { reason: string | null }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 font-semibold text-sm text-destructive">
                <AlertTriangle size={16} />
                Xác minh thất bại
            </div>
            {reason && (
                <p className="text-[11px] text-destructive/80 text-center max-w-[220px]">{reason}</p>
            )}
        </div>
    );
}

// ─── Main overlay ─────────────────────────────────────────────────────────────

export function ValidationOverlay({ validationState }: ValidationOverlayProps) {
    const { phase, quality, liveness, errorReason, score } = validationState;

    if (phase === "idle") return null;

    return (
        <div className="w-full" style={{ minHeight: 72 }}>
            <style>{`
                @keyframes fadeSlide {
                    from { opacity: 0; transform: translateY(4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <QualityPhase quality={quality} />
            {phase === "liveness" && <LivenessPhase state={validationState} />}
            {phase === "pass" && <PassPhase score={score} />}
            {phase === "fail" && <FailPhase reason={errorReason} />}
        </div>
    );
}