"use client";

import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    AtSign, ArrowRight, ChevronRight,
    ArrowLeft, Loader2,
} from "lucide-react";
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

    return (
        <div className="space-y-6">
            {/* Step indicator */}
            <div className="flex items-center justify-between px-1">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                        Xác thực để tiếp tục
                    </p>
                    <h2 className="text-foreground font-bold text-lg">
                        {step === "username" ? "Bước 1/2 — Tên đăng nhập" : "Bước 2/2 — Xác thực khuôn mặt"}
                    </h2>
                </div>
                <div className="flex gap-1.5">
                    <div className="h-1 w-8 rounded-full bg-primary" />
                    <div className={`h-1 w-8 rounded-full transition-colors duration-500 ${step === "biometric" ? "bg-primary" : "bg-muted"}`} />
                </div>
            </div>

            <div className="bg-card rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    {step === "username" && (
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Đăng nhập</h1>
                                <p className="text-muted-foreground text-sm">Nhập username để tiếp tục xác thực khuôn mặt.</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                                    Tên đăng nhập
                                </Label>
                                <div className="relative">
                                    <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                                    <Input
                                        type="text"
                                        placeholder="your_username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && canProceed && setStep("biometric")}
                                        className="pl-11 py-6 bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary rounded-xl"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <Button
                                disabled={!canProceed}
                                onClick={() => setStep("biometric")}
                                className="w-full py-6 rounded-xl primary-gradient text-primary-foreground font-bold text-base active:scale-95 transition-all shadow-lg shadow-primary/20 border-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
                            >
                                Tiếp tục <ArrowRight size={18} />
                            </Button>
                        </div>
                    )}

                    {step === "biometric" && (
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <div className="flex items-center">
                                    <Button variant="ghost" size="sm" onClick={() => setStep("username")} className="flex items-center gap-1.5">
                                        <ArrowLeft size={20} />
                                    </Button>
                                    <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Xác thực khuôn mặt</h1>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    Đăng nhập với{" "}
                                    <button
                                        onClick={() => { setStep("username"); handleBiometricReset(); }}
                                        className="text-primary font-semibold inline-flex items-center gap-0.5 hover:underline cursor-pointer"
                                    >
                                        @{username} <ChevronRight size={12} />
                                    </button>
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
                                className="w-full py-6 rounded-xl primary-gradient text-primary-foreground font-bold text-base active:scale-95 transition-all shadow-[0_10px_30px_hsl(var(--primary)/0.3)] border-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
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