"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  AtSign,
  ArrowRight,
  ShieldCheck,
  Lock,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { BiometricScanner } from "@/components/layout/biometric-scanner";
import { useLogin } from "@/hooks/use-auth";
import { useWiFaKeyVerify } from "@/hooks/use-oauth";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { toast } from "sonner";

type Step = "username" | "biometric";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("username");
  const [username, setUsername] = useState("");
  const [biometricDone, setBiometricDone] = useState(false);
  const [hashK, setHashK] = useState<string | null>(null);

  const canProceed = username.trim().length > 0;

  const login = useLogin();
  const router = useRouter();
  const { computeHashK, processing: wifakeyProcessing, error: wifakeyError, clearError } = useWiFaKeyVerify();
  // scannerKey: thay đổi giá trị → force remount BiometricScanner → reset về idle
  const [scannerKey, setScannerKey] = useState(0);

  const handleBiometricSuccess = useCallback(() => {
    setBiometricDone(true);
  }, []);

  const handleBiometricReset = useCallback(() => {
    setBiometricDone(false);
    setHashK(null);
    clearError();
  }, [clearError]);

  const handleCaptureWithData = useCallback(
    async (base64: string, imageData: ImageData, landmarks: { x: number; y: number }[]) => {
      const randomState = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const hash = await computeHashK(username, randomState, imageData, landmarks);
      if (hash) {
        setHashK(hash);
      } else {
        // Antispoof hoặc verify thất bại → reset scanner về idle để user thử lại
        setBiometricDone(false);
        setScannerKey(k => k + 1);
      }
    },
    [username, computeHashK]
  );

  const handleLogin = useCallback((hash: string) => {
    if (!canProceed || !hash) return;

    login.mutate({ username, hash_k_b64: hash }, {
      onSuccess: () => {
        setUsername("");
        setHashK(null);
        setBiometricDone(false);
        toast.success("Đăng nhập thành công!");
        router.push("/");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Xác thực khuôn mặt thất bại. Vui lòng thử lại!");
        setHashK(null);
        setBiometricDone(false);
      }
    });
  }, [canProceed, username, login, router]);

  // Auto sign-in ngay khi hashK sẵn sàng — không chờ animation kết thúc
  useEffect(() => {
    if (hashK && canProceed && !login.isPending) {
      handleLogin(hashK);
    }
  }, [hashK]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6 py-20 relative">
        <div className="absolute inset-0 biometric-pulse pointer-events-none opacity-60" />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: "var(--kw-brand-soft)" }}
        />

        <div className="w-full max-w-md z-10 flex flex-col gap-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between px-1 mb-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                Sign In
              </p>
              <h2 className="text-foreground font-bold text-lg">
                {step === "username"
                  ? "Step 1 of 2 — Identity"
                  : "Step 2 of 2 — Face Verification"}
              </h2>
            </div>
            <div className="flex gap-1.5">
              <div className="h-1 w-8 rounded-full bg-primary" />
              <div
                className={`h-1 w-8 rounded-full transition-colors duration-500 ${
                  step === "biometric" ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
          </div>

          {/* Card */}
          <div className="bg-card rounded-[2rem] p-8 pt-0 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              {/* ── STEP 1: USERNAME ── */}
              <div
                className={`transition-all duration-500 ${
                  step === "username"
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4 absolute pointer-events-none"
                }`}
              >
                {step === "username" && (
                  <div className="space-y-8">
                    <div className="space-y-1">
                      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                        Welcome back
                      </h1>
                      <p className="text-muted-foreground text-sm">
                        Enter your username to begin face verification.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        Username
                      </Label>
                      <div className="relative">
                        <AtSign
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <Input
                          type="text"
                          placeholder="your_username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && canProceed && setStep("biometric")
                          }
                          className="pl-11 py-6 bg-background text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary rounded-xl"
                          style={{ borderColor: "var(--kw-border)" }}
                          autoFocus
                        />
                      </div>
                    </div>

                    <Button
                      disabled={!canProceed}
                      onClick={() => setStep("biometric")}
                      className="w-full py-6 rounded-xl btn-brand-gradient font-bold text-base active:scale-95 transition-all border-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
                      style={{ boxShadow: "0 10px 30px var(--kw-brand-glow)" }}
                    >
                      Continue to Face Scan
                      <ArrowRight size={18} />
                    </Button>
                  </div>
                )}
              </div>

              {/* ── STEP 2: BIOMETRIC ── */}
              <div
                className={`transition-all duration-500 ${
                  step === "biometric"
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 absolute pointer-events-none"
                }`}
              >
                {step === "biometric" && (
                  <div className="space-y-8">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setStep("username")}
                          className="flex items-center gap-1.5"
                        >
                          <ArrowLeft size={20} />
                        </Button>

                        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                          Verify your face
                        </h1>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Signing in as{" "}
                        <button
                          onClick={() => {
                            setStep("username");
                            handleBiometricReset();
                          }}
                          className="text-primary font-semibold inline-flex items-center gap-0.5 hover:underline cursor-pointer"
                        >
                          @{username}
                          <ChevronRight size={12} />
                        </button>
                      </p>
                    </div>

                    <BiometricScanner
                      key={scannerKey}
                      mode="login"
                      onSuccess={handleBiometricSuccess}
                      onReset={handleBiometricReset}
                      onCaptureWithData={handleCaptureWithData}
                    />

                    {/* Status indicator — auto sign-in, không cần bấm button */}
                    {(wifakeyProcessing || login.isPending) && (
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                        <Loader2 size={12} className="animate-spin" />
                        {login.isPending ? "Đang đăng nhập..." : "Đang xác thực sinh trắc học..."}
                      </p>
                    )}
                    {wifakeyError && (
                      <p className="text-xs text-destructive text-center">{wifakeyError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: ShieldCheck, label: "Biometric Node" },
              { icon: Lock, label: "End-to-End Encrypted" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="px-4 py-2 rounded-full flex items-center gap-2 border"
                style={{
                  background: "var(--kw-slate-soft)",
                  borderColor: "var(--kw-border)",
                }}
              >
                <Icon size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-semibold">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-8 mt-2">
            <Link
              href="/sign-up"
              className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Create Account
            </Link>
            <Link
              href="#"
              className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Need Help?
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
