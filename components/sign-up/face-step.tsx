"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BiometricScanner } from "@/components/layout/biometric-scanner";

interface FaceStepProps {
    onBack: () => void;
    onSuccess: () => void;
    savedBase64?: string | null;
    onCapture?: (base64: string) => void;
    onCaptureWithData?: (base64: string, imageData: ImageData, landmarks: { x: number; y: number }[]) => void;
    wifakeyProcessing?: boolean;
    wifakeyError?: string | null;
}

export function FaceStep({
    onBack, onSuccess, savedBase64, onCapture, onCaptureWithData,
    wifakeyProcessing, wifakeyError,
}: FaceStepProps) {
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
                onCapture={(base64) => { onCapture?.(base64); }}
                onCaptureWithData={onCaptureWithData}
                onSuccess={onSuccess}
                onReset={() => { onCapture?.(''); }}
            />

            {/* Trạng thái WiFaKey đang xử lý sau khi scan */}
            {wifakeyProcessing && (
                <p className="mt-3 text-xs text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin" />
                    Đang xử lý dữ liệu sinh trắc học...
                </p>
            )}
            {wifakeyError && (
                <p className="mt-3 text-xs text-red-500">{wifakeyError}</p>
            )}

            <div className="mt-6 flex items-center justify-between">
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
