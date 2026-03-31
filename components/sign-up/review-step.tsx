"use client";

import { AtSign, CheckCircle2, Loader2, Mail, Pencil, RotateCcw, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Step1Data } from "./useSignUpForm";

interface ReviewStepProps {
    step1: Step1Data;
    faceBase64: string;
    isPending: boolean;
    error: string | null;
    onEditInfo: () => void;
    onRetakeFace: () => void;
    onSubmit: () => void;
}

export function ReviewStep({
    step1,
    faceBase64,
    isPending,
    error,
    onEditInfo,
    onRetakeFace,
    onSubmit,
}: ReviewStepProps) {
    return (
        <div className="bg-card rounded-xl p-8 md:p-10 shadow-2xl">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
                    Confirm & Register
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                    Review your details before completing registration.
                </p>
            </header>

            {/* Face preview */}
            <div className="flex items-center gap-4 p-4 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200/50 dark:border-cyan-800/40 rounded-xl mb-4">
                <div className="relative shrink-0">
                    <img
                        src={`data:image/jpeg;base64,${faceBase64}`}
                        alt="Face capture"
                        className="w-16 h-16 rounded-full object-cover border-2 border-cyan-300 dark:border-cyan-700"
                        style={{ filter: "blur(1px)" }}
                    />
                    {/* Lock icon overlay để báo hiệu đây là dữ liệu bảo mật */}
                    <div className="absolute inset-0 rounded-full flex items-center justify-center bg-cyan-900/20">
                        <ShieldCheck size={18} className="text-cyan-700 dark:text-cyan-300 drop-shadow" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-cyan-400 rounded-full p-0.5">
                        <CheckCircle2 size={14} className="text-cyan-900" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-cyan-900 dark:text-cyan-100">Face captured</p>
                    <p className="text-xs text-cyan-600 dark:text-cyan-400">Ready for biometric enrollment</p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRetakeFace}
                    className="text-cyan-600 hover:text-cyan-900 hover:bg-cyan-100/60 gap-1.5 shrink-0"
                >
                    <RotateCcw size={13} />
                    Retake
                </Button>
            </div>

            {/* Info summary */}
            <div className="border border-border/40 rounded-xl overflow-hidden mb-6">
                <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20 border-b border-border/30">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Account Info
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEditInfo}
                        className="h-auto py-0.5 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                    >
                        <Pencil size={11} />
                        Edit
                    </Button>
                </div>

                {[
                    { icon: User, label: "Full name", value: step1.fullName },
                    { icon: AtSign, label: "Username", value: step1.username },
                    { icon: Mail, label: "Email", value: step1.email },
                ].map(({ icon: Icon, label, value }, i, arr) => (
                    <div
                        key={label}
                        className={`flex items-center gap-3 px-4 py-3.5 ${i < arr.length - 1 ? "border-b border-border/20" : ""}`}
                    >
                        <Icon size={15} className="text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                            <p className="text-sm font-medium text-foreground truncate">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {error && (
                <p className="text-sm text-destructive text-center mb-4 px-2">{error}</p>
            )}

            <div className="flex items-center gap-2 mb-5 justify-center">
                <ShieldCheck size={13} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    End-to-End Encrypted
                </span>
            </div>

            <Button
                onClick={onSubmit}
                disabled={isPending}
                className="w-full py-6 rounded-xl primary-gradient text-primary-foreground font-bold text-sm tracking-wide shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:scale-100 transition-all duration-200 flex items-center justify-center gap-3 border-0"
            >
                {isPending ? (
                    <><Loader2 size={18} className="animate-spin" /> Registering…</>
                ) : (
                    <><CheckCircle2 size={18} /> Complete Registration</>
                )}
            </Button>
        </div>
    );
}