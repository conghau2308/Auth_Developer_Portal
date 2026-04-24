"use client";

import { FaceStep } from "@/components/sign-up/face-step";
import { RegisterForm } from "@/components/sign-up/register-form";
import { ReviewStep } from "@/components/sign-up/review-step";
import { useSignUpForm } from "@/components/sign-up/useSignUpForm";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";

const STEPS = [
  { key: "form", label: "Account info" },
  { key: "face", label: "Face scan" },
  { key: "review", label: "Confirm" },
] as const;

function StepBar({ current }: { current: "form" | "face" | "review" | "done" }) {
  const idx = STEPS.findIndex((s) => s.key === current);
  const activeIdx = idx === -1 ? STEPS.length : idx;

  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                  border transition-all duration-300
                  ${done ? "bg-[var(--kw-brand-soft)] border-[var(--kw-brand)] text-[var(--kw-brand)]" : ""}
                  ${active ? "bg-[var(--kw-brand)] border-[var(--kw-brand)] text-white" : ""}
                  ${!done && !active ? "bg-background border-[var(--kw-border)] text-muted-foreground" : ""}
                `}
              >
                {done ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span
                className={`text-[11px] mt-1.5 whitespace-nowrap font-semibold ${active ? "text-[var(--kw-brand)]" : "text-muted-foreground"
                  }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-px mx-2 mb-5 transition-all duration-300"
                style={{ background: done ? "var(--kw-brand)" : "var(--kw-border)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function SignUpPage() {
  const {
    state,
    isPending,
    error,
    goToFace,
    goToReview,
    goToForm,
    goToFaceBack,
    setFaceBase64,
    submit,
    reset,
  } = useSignUpForm();

  if (state.step === "done") {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-card rounded-xl p-12 shadow-2xl text-center max-w-sm w-full">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 border"
              style={{
                background: "var(--kw-brand-soft)",
                borderColor: "var(--kw-border-glow)",
              }}
            >
              <CheckCircle2 size={32} style={{ color: "var(--kw-brand)" }} />
            </div>
            <h2 className="text-2xl font-extrabold text-foreground mb-2">All done!</h2>
            <p className="text-muted-foreground text-sm mb-8">
              Your account has been created successfully.
            </p>
            <Button
              onClick={reset}
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Register another account
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6 py-20 relative">
        {/* Ambient glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: "var(--kw-brand-soft)" }}
        />

        <div className="w-full max-w-md z-10">
          <StepBar current={state.step} />

          {state.step === "form" && (
            <RegisterForm
              defaultValues={state.step1 ?? undefined}
              onNext={goToFace}
            />
          )}

          {state.step === "face" && (
            <FaceStep
              onBack={goToForm}
              savedBase64={state.faceBase64}
              onCapture={setFaceBase64}
              onSuccess={goToReview}
            />
          )}

          {state.step === "review" && state.step1 && state.faceBase64 && (
            <ReviewStep
              step1={state.step1}
              faceBase64={state.faceBase64}
              isPending={isPending}
              error={error?.message ?? null}
              onEditInfo={goToForm}
              onRetakeFace={goToFaceBack}
              onSubmit={submit}
            />
          )}

          {/* Security badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
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

          {/* Footer links */}
          <div className="flex justify-center gap-8 mt-4">
            <Link
              href="/login"
              className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Already have an account?
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

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer
      className="w-full border-t py-6 px-6"
      style={{ borderColor: "var(--kw-border)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} KW. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {[
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Support", href: "#" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}