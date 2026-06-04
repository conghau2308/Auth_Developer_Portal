"use client";

import { ArrowLeft, Fingerprint, Loader2, ShieldAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FaceStepProps {
    onBack: () => void;
    onLaunch: () => void;
    wifakeyProcessing?: boolean;
    wifakeyError?: string | null;
}

export function FaceStep({ onBack, onLaunch, wifakeyProcessing, wifakeyError }: FaceStepProps) {
    return (
        <div className="bg-cyan-40 dark:bg-cyan-950/90 border border-cyan-200/40 dark:border-cyan-800/40 rounded-xl p-8 md:p-10 shadow-2xl">
            <header className="mb-6">
                <h1 className="text-2xl font-extrabold tracking-tight text-cyan-900 dark:text-cyan-100">
                    Face Enrollment
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    WiFaKey Authenticator sẽ mở camera trên máy tính của bạn.
                </p>
            </header>

            {/* Authenticator launch area */}
            <div className="flex flex-col items-center gap-5 py-6">
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center border-2"
                    style={{
                        background: "var(--kw-brand-soft)",
                        borderColor: wifakeyError ? "var(--destructive)" : "var(--kw-border-glow)",
                    }}
                >
                    {wifakeyProcessing ? (
                        <Loader2 size={36} className="animate-spin" style={{ color: "var(--kw-brand)" }} />
                    ) : wifakeyError ? (
                        <ShieldAlert size={36} style={{ color: "var(--destructive)" }} />
                    ) : (
                        <Fingerprint size={36} style={{ color: "var(--kw-brand)" }} />
                    )}
                </div>

                {wifakeyProcessing ? (
                    <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">
                            Đang chờ WiFaKey Authenticator…
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Nhìn vào camera trong cửa sổ vừa mở trên máy tính của bạn.
                        </p>
                    </div>
                ) : wifakeyError ? (
                    <div className="text-center space-y-3">
                        <p className="text-sm text-destructive font-medium">{wifakeyError}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onLaunch}
                            className="gap-2"
                        >
                            <RefreshCw size={14} /> Thử lại
                        </Button>
                    </div>
                ) : (
                    <div className="text-center space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Nhấn nút bên dưới — ứng dụng WiFaKey sẽ mở cửa sổ quét khuôn mặt.
                        </p>
                        <Button
                            onClick={onLaunch}
                            className="btn-brand-gradient font-bold px-8 py-5 rounded-xl border-0 gap-2 active:scale-95 transition-all"
                            style={{ boxShadow: "0 8px 24px var(--kw-brand-glow)" }}
                        >
                            <Fingerprint size={18} />
                            Mở WiFaKey Authenticator
                        </Button>
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between">
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-cyan-700/70 hover:text-cyan-900 hover:bg-cyan-100/50 text-sm"
                    onClick={onBack}
                    disabled={wifakeyProcessing}
                >
                    <ArrowLeft size={15} />
                    Back to form
                </Button>
            </div>
        </div>
    );
}
