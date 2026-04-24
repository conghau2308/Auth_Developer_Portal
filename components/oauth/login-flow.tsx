"use client";

import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AtSign, ArrowRight, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import { BiometricScanner } from "@/components/layout/biometric-scanner";
import { useLogin } from "@/hooks/use-auth";

type LoginStep = "username" | "biometric";

interface LoginFlowProps {
    onSuccess: () => void;
}

export function LoginFlow({ onSuccess }: LoginFlowProps) {
    const [step, setStep] = useState<LoginStep>("username");
    const [username, setUsername] = useState("");
    const [biometricDone, setBiometricDone] = useState(false);
    const [faceBase64, setFaceBase64] = useState<string | null>(null);

    const canProceed = username.trim().length > 0;
    const login = useLogin();

    const handleBiometricSuccess = useCallback(() => setBiometricDone(true), []);
    const handleBiometricReset = useCallback(() => {
        setBiometricDone(false);
        setFaceBase64(null);
    }, []);

    const handleLogin = () => {
        if (!canProceed || !faceBase64 || !biometricDone) return;
        login.mutate({ username, imageBase64: faceBase64 }, { onSuccess });
    };

    // Class dùng lại trong component này (Button CTA xuất hiện 2 lần)
    const btnPrimary = [
        "w-full py-6 rounded-xl font-bold text-base",
        "flex items-center justify-center gap-2",
        "active:scale-95 transition-all border-0",
        "btn-brand-gradient",                          // gradient + hover — đã có trong globals
        "shadow-[0_10px_30px_hsl(var(--primary)/0.3)]",
        "disabled:opacity-30 disabled:cursor-not-allowed disabled:!translate-y-0 disabled:!shadow-none",
    ].join(" ");

    return (
        <div className="space-y-6">

            {/* Step indicator */}
            <div className="flex items-center justify-between px-1">
                <div>
                    <p className="text-[10px] uppercase font-bold text-[var(--kw-brand)]" style={{ letterSpacing: "0.2em" }}>
                        Xác thực để tiếp tục
                    </p>
                    <h2 className="font-bold text-lg text-[var(--kw-text-strong)]">
                        {step === "username" ? "Bước 1/2 — Tên đăng nhập" : "Bước 2/2 — Xác thực khuôn mặt"}
                    </h2>
                </div>
                <div className="flex gap-1.5">
                    <div className="h-1 w-8 rounded-full bg-[var(--kw-brand)]" />
                    <div
                        className="h-1 w-8 rounded-full transition-colors duration-500"
                        style={{ background: step === "biometric" ? "var(--kw-brand)" : "var(--kw-bg4)" }}
                    />
                </div>
            </div>

            {/* Card */}
            <div className="bg-[var(--kw-bg2)] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">

                    {/* Step 1 — Username */}
                    {step === "username" && (
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-extrabold tracking-tight text-[var(--kw-text-strong)]">Đăng nhập</h1>
                                <p className="text-sm text-[var(--kw-text-muted)]">Nhập username để tiếp tục xác thực khuôn mặt.</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-widest text-[var(--kw-text-muted)] ml-1">
                                    Tên đăng nhập
                                </Label>
                                <div className="relative">
                                    <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--kw-text-muted)] pointer-events-none" />
                                    <Input
                                        type="text"
                                        placeholder="your_username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && canProceed && setStep("biometric")}
                                        className="pl-11 py-6 rounded-xl bg-[var(--kw-bg)] border-[var(--kw-border)] text-[var(--kw-text-strong)] placeholder:text-[var(--kw-text-faint)] focus-visible:ring-[var(--kw-brand)]"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <Button disabled={!canProceed} onClick={() => setStep("biometric")} className={btnPrimary}>
                                Tiếp tục <ArrowRight size={18} />
                            </Button>
                        </div>
                    )}

                    {/* Step 2 — Biometric */}
                    {step === "biometric" && (
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <div className="flex items-center">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setStep("username")}
                                        className="flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <ArrowLeft size={20} />
                                    </Button>
                                    <h1 className="text-2xl font-extrabold tracking-tight text-[var(--kw-text-strong)]">
                                        Xác thực khuôn mặt
                                    </h1>
                                </div>
                                <p className="text-sm text-[var(--kw-text-muted)]">
                                    Đăng nhập với{" "}
                                    <Button
                                        onClick={() => { setStep("username"); handleBiometricReset(); }}
                                        className="font-semibold inline-flex items-center gap-0.5 text-[var(--kw-brand)] hover:opacity-75 hover:underline cursor-pointer transition-opacity"
                                    >
                                        @{username} <ChevronRight size={12} />
                                    </Button>
                                </p>
                            </div>

                            <BiometricScanner
                                onSuccess={handleBiometricSuccess}
                                onReset={handleBiometricReset}
                                onCapture={(base64) => setFaceBase64(base64)}
                            />

                            <Button
                                disabled={!biometricDone || !faceBase64 || login.isPending}
                                onClick={handleLogin}
                                className={btnPrimary}
                            >
                                {login.isPending
                                    ? <><Loader2 size={18} className="animate-spin" /> Đang xác thực…</>
                                    : "Đăng nhập"}
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}