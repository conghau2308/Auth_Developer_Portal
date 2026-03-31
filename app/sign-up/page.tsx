"use client";

import { FaceStep } from "@/components/sign-up/face-step";
import { RegisterForm } from "@/components/sign-up/register-form";
import { ReviewStep } from "@/components/sign-up/review-step";
import { useSignUpForm } from "@/components/sign-up/useSignUpForm";
import { CheckCircle2 } from "lucide-react";

const STEPS = [
  { key: "form", label: "Account info" },
  { key: "face", label: "Face scan" },
  { key: "review", label: "Confirm" },
] as const;

function StepBar({ current }: { current: "form" | "face" | "review" | "done" }) {
  const idx = STEPS.findIndex((s) => s.key === current);
  const activeIdx = idx === -1 ? STEPS.length : idx; // "done" → all complete

  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                                border transition-all duration-300
                                ${done ? "bg-cyan-100 border-cyan-400 text-cyan-800" : ""}
                                ${active ? "bg-cyan-400 border-cyan-400 text-cyan-900" : ""}
                                ${!done && !active ? "bg-background border-border text-muted-foreground" : ""}
                            `}>
                {done
                  ? <CheckCircle2 size={14} />
                  : i + 1
                }
              </div>
              <span className={`text-[11px] mt-1.5 whitespace-nowrap ${active ? "text-cyan-800 font-semibold" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-5 transition-all duration-300 ${done ? "bg-cyan-400" : "bg-border"}`} />
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-card rounded-xl p-12 shadow-2xl text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-cyan-100 border border-cyan-300 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-cyan-700" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">All done!</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Your account has been created successfully.
          </p>
          <button
            onClick={reset}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Register another account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
      </div>
    </div>
  );
}