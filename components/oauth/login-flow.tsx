"use client";

import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AtSign, ArrowRight, ChevronRight, ArrowLeft, Loader2, ScanFace, ShieldAlert } from "lucide-react";
import { useLogin } from "@/hooks/use-auth";
import { useWiFaKeyVerify } from "@/hooks/use-oauth";

type LoginStep = "username" | "biometric";

interface LoginFlowProps {
    onSuccess: () => void;
    /** OAuth state param — dùng để getDelta. Nếu không có sẽ dùng random state. */
    state?: string;
}

export function LoginFlow({ onSuccess, state: oauthState }: LoginFlowProps) {
    const [step, setStep] = useState<LoginStep>("username");
    const [username, setUsername] = useState("");

    const canProceed = username.trim().length > 0;
    const login = useLogin();
    const { computeCPrime, processing: wifakeyProcessing, error: wifakeyError, clearError } = useWiFaKeyVerify();

    const handleBiometricReset = useCallback(() => {
        clearError();
    }, [clearError]);

    const handleLaunchAuthenticator = useCallback(async () => {
        if (!canProceed) return;

        // Dùng OAuth state nếu có, không thì random (cho direct login)
        const state = oauthState ?? Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

        const cPrime = await computeCPrime(username, state);
        if (!cPrime) return;

        login.mutate({ username, c_prime_b64: cPrime }, { onSuccess });
    }, [canProceed, username, oauthState, computeCPrime, login, onSuccess]);

    const btnPrimary = [
        "w-full py-6 rounded-xl font-bold text-base",
        "flex items-center justify-center gap-2",
        "active:scale-95 transition-all border-0",
        "btn-brand-gradient",
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

                    {/* Step 2 — Biometric (native app) */}
                    {step === "biometric" && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <div className="flex items-center">
                                    <Button variant="ghost" size="sm" onClick={() => { setStep("username"); handleBiometricReset(); }}
                                        className="flex items-center gap-1.5 cursor-pointer">
                                        <ArrowLeft size={20} />
                                    </Button>
                                    <h1 className="text-2xl font-extrabold tracking-tight text-[var(--kw-text-strong)]">
                                        Xác thực khuôn mặt
                                    </h1>
                                </div>
                                <p className="text-sm text-[var(--kw-text-muted)]">
                                    Đăng nhập với{" "}
                                    <Button onClick={() => { setStep("username"); handleBiometricReset(); }}
                                        className="font-semibold inline-flex items-center gap-0.5 text-[var(--kw-brand)] hover:opacity-75 hover:underline cursor-pointer transition-opacity">
                                        @{username} <ChevronRight size={12} />
                                    </Button>
                                </p>
                            </div>

                            {/* Authenticator status */}
                            <div className="flex flex-col items-center gap-3 py-2">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center border-2"
                                    style={{
                                        background: "var(--kw-brand-soft)",
                                        borderColor: wifakeyError ? "var(--destructive)" : "var(--kw-border-glow)",
                                    }}>
                                    {wifakeyProcessing || login.isPending ? (
                                        <Loader2 size={24} className="animate-spin" style={{ color: "var(--kw-brand)" }} />
                                    ) : wifakeyError ? (
                                        <ShieldAlert size={24} style={{ color: "var(--destructive)" }} />
                                    ) : (
                                        <ScanFace size={24} style={{ color: "var(--kw-brand)" }} />
                                    )}
                                </div>
                                {wifakeyProcessing ? (
                                    <p className="text-xs text-center text-[var(--kw-text-muted)]">
                                        Đang chờ WiFaKey Authenticator…<br />Nhìn vào camera trong cửa sổ vừa mở.
                                    </p>
                                ) : login.isPending ? (
                                    <p className="text-xs text-center text-[var(--kw-text-muted)]">Đang đăng nhập...</p>
                                ) : wifakeyError ? (
                                    <p className="text-xs text-center text-destructive">{wifakeyError}</p>
                                ) : (
                                    <p className="text-xs text-center text-[var(--kw-text-muted)]">
                                        Nhấn nút bên dưới — ứng dụng WiFaKey sẽ mở cửa sổ quét khuôn mặt.
                                    </p>
                                )}
                            </div>

                            <Button
                                onClick={handleLaunchAuthenticator}
                                disabled={wifakeyProcessing || login.isPending}
                                className={btnPrimary}
                            >
                                <ScanFace size={18} />
                                {wifakeyProcessing || login.isPending ? "Đang xử lý..." : "Mở WiFaKey Authenticator"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
