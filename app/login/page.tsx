"use client";

import { useCallback, useState } from "react";
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
} from "lucide-react";
import { BiometricScanner } from "@/components/layout/biometric-scanner";
import { useLogin } from "@/hooks/use-auth";
import { set } from "zod";
import { useRouter } from "next/navigation";

type Step = "username" | "biometric";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("username");
  const [username, setUsername] = useState("");
  const [biometricDone, setBiometricDone] = useState(false);
  const [faceBase64, setFaceBase64] = useState<string | null>(null);

  const canProceed = username.trim().length > 0;

  const login = useLogin();
  const router = useRouter();

  const handleBiometricSuccess = useCallback(() => {
    setBiometricDone(true);
  }, []);

  // Khi user nhấn "Chụp lại" bên trong BiometricScanner → reset cờ
  const handleBiometricReset = useCallback(() => {
    setBiometricDone(false);
    setFaceBase64(null);
  }, []);

  const handleRegister = () => {
    if (!canProceed || !faceBase64 || !biometricDone) return;

    login.mutate({ username, imageBase64: faceBase64 }, {
      onSuccess: () => {
        setUsername("");
        setFaceBase64(null);
        setBiometricDone(false);
        setStep("username");
        router.push('/');
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex justify-between items-center px-6 py-5 max-w-7xl mx-auto">
          <Link href="/" className="text-xl font-black tracking-tighter text-primary">
            The Obsidian Lens
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Secure Session
            </span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-20 relative">
        {/* Ambient glow */}
        <div className="absolute inset-0 biometric-pulse pointer-events-none opacity-60" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md z-10 flex flex-col gap-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between px-1 mb-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                Sign In
              </p>
              <h2 className="text-foreground font-bold text-lg">
                {step === "username" ? "Step 1 of 2 — Identity" : "Step 2 of 2 — Face Verification"}
              </h2>
            </div>
            <div className="flex gap-1.5">
              <div className="h-1 w-8 rounded-full bg-primary" />
              <div className={`h-1 w-8 rounded-full transition-colors duration-500 ${step === "biometric" ? "bg-primary" : "bg-muted"}`} />
            </div>
          </div>

          {/* Card */}
          <div className="bg-card rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              {/* ── STEP 1: USERNAME ── */}
              <div
                className={`transition-all duration-500 ${step === "username"
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
                      Continue to Face Scan
                      <ArrowRight size={18} />
                    </Button>
                  </div>
                )}
              </div>

              {/* ── STEP 2: BIOMETRIC ── */}
              <div
                className={`transition-all duration-500 ${step === "biometric"
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
                      onSuccess={handleBiometricSuccess}
                      onReset={handleBiometricReset}
                      onCapture={(base64) => setFaceBase64(base64)}
                    />

                    <Button
                      disabled={!biometricDone || !faceBase64 || !canProceed}
                      onClick={handleRegister}
                      className="w-full py-6 rounded-xl primary-gradient text-primary-foreground font-bold text-base active:scale-95 transition-all shadow-[0_10px_30px_hsl(var(--primary)/0.3)] border-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      Sign In
                    </Button>
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
                className="bg-muted/20 px-4 py-2 rounded-full flex items-center gap-2 border border-border"
              >
                <Icon size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-semibold">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Footer links */}
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