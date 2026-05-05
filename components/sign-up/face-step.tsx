"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BiometricScanner } from "@/components/layout/biometric-scanner";

interface FaceStepProps {
    onBack: () => void;
    onSuccess: () => void;
    savedBase64?: string | null;
    onCapture?: (base64: string) => void;
}

export function FaceStep({ onBack, onSuccess, savedBase64, onCapture }: FaceStepProps) {
    return (
        <div className="bg-cyan-40 dark:bg-cyan-950/90 border border-cyan-200/40 dark:border-cyan-800/40 rounded-xl p-8 md:p-10 shadow-2xl">
            <header className="mb-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-cyan-900 dark:text-cyan-100">
                    Face Enrollment
                </h1>
            </header>

            <BiometricScanner
                mode="signup"
                initialImage={savedBase64}
                onCapture={(base64) => {
                    onCapture?.(base64);
                }}
                onSuccess={() => {
                    // tự động chuyển review sau khi scan xong
                    onSuccess();
                }}
                onReset={() => {
                    onCapture?.('');
                }}
            />

            <div className="mt-6 flex items-center justify-between">
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-cyan-700/70 hover:text-cyan-900 hover:bg-cyan-100/50 text-sm"
                    onClick={onBack}
                >
                    <ArrowLeft size={15} />
                    Back to form
                </Button>

                {/* Chỉ hiện khi đã có ảnh — cho phép review mà không cần scan lại */}
                {savedBase64 && (
                    <Button
                        className="flex items-center gap-2 rounded-xl text-sm font-semibold bg-cyan-400 hover:bg-cyan-300 text-cyan-900 border-0 transition-all active:scale-[0.97]"
                        onClick={onSuccess}
                    >
                        Review & confirm
                        <ArrowRight size={15} />
                    </Button>
                )}
            </div>
        </div>
    );
}