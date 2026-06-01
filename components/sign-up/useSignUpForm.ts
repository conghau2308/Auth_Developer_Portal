"use client";

import { useReducer, useCallback, useState } from "react";
import { useRegister } from "@/hooks/use-register";
import { checkLiveness } from "@/lib/wifakey/antispoof";
import { alignFace, alignFaceWithYuNetKps } from "@/lib/wifakey/face-alignment";
import { getEmbedding } from "@/lib/wifakey/adaface";
import { wifakeyEnroll } from "@/lib/wifakey/wifakey-core";

export interface Step1Data {
    fullName: string;
    username: string;
    email: string;
}

export type WizardStep = "form" | "face" | "review" | "done";

interface WiFaKeyEnrollResult {
    helper_data_b64: string;
    mask_b64: string;
    key_hash_b64: string;
}

interface WizardState {
    step: WizardStep;
    step1: Step1Data | null;
    faceBase64: string | null;       // preview image trong FaceStep
    wifakeyResult: WiFaKeyEnrollResult | null;
}

type WizardAction =
    | { type: "GO_FACE"; payload: Step1Data }
    | { type: "SET_FACE"; payload: string }
    | { type: "SET_WIFAKEY"; payload: WiFaKeyEnrollResult }
    | { type: "GO_REVIEW" }
    | { type: "GO_FORM" }
    | { type: "GO_FACE_BACK" }
    | { type: "DONE" }
    | { type: "RESET" };

const initialState: WizardState = {
    step: "form",
    step1: null,
    faceBase64: null,
    wifakeyResult: null,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
    switch (action.type) {
        case "GO_FACE":
            return { ...state, step: "face", step1: action.payload };
        case "SET_FACE":
            return { ...state, faceBase64: action.payload || null };
        case "SET_WIFAKEY":
            return { ...state, wifakeyResult: action.payload };
        case "GO_REVIEW":
            return { ...state, step: "review" };
        case "GO_FORM":
            return { ...state, step: "form" };
        case "GO_FACE_BACK":
            return { ...state, step: "face" };
        case "DONE":
            return { ...state, step: "done" };
        case "RESET":
            return initialState;
        default:
            return state;
    }
}

export function useSignUpForm() {
    const [state, dispatch] = useReducer(wizardReducer, initialState);
    const { mutate: register, isPending, error } = useRegister();
    const [wifakeyProcessing, setWifakeyProcessing] = useState(false);
    const [wifakeyError, setWifakeyError] = useState<string | null>(null);

    const goToFace = useCallback((data: Step1Data) => {
        dispatch({ type: "GO_FACE", payload: data });
    }, []);

    // Lưu base64 preview khi BiometricScanner capture (dùng onCapture thông thường)
    const setFaceBase64 = useCallback((base64: string) => {
        dispatch({ type: "SET_FACE", payload: base64 });
    }, []);

    /**
     * Nhận un-mirrored ImageData + MediaPipe landmarks từ BiometricScanner.
     * Chạy toàn bộ WiFaKey enrollment cục bộ — không gửi ảnh hay embedding lên server.
     * Được gọi qua onCaptureWithData.
     */
    const processEnrollFace = useCallback(
        async (_base64: string, imageData: ImageData, landmarks: { x: number; y: number }[]) => {
            setWifakeyProcessing(true);
            setWifakeyError(null);
            try {
                // 1. Anti-spoofing (MiniFAS ONNX)
                // 1. YuNet detection + MiniFAS anti-spoofing
                const { isReal, score, detected } = await checkLiveness(imageData, landmarks);
                if (!isReal) throw new Error(`Phát hiện ảnh giả (score=${score.toFixed(2)}). Vui lòng dùng khuôn mặt thật.`);

                // 2. Align — YuNet kps (đã reorder) nếu detect được, fallback MediaPipe
                const aligned = detected?.kps
                    ? alignFaceWithYuNetKps(imageData, detected.kps)
                    : alignFace(imageData, landmarks);
                if (!aligned) throw new Error("Không thể căn chỉnh khuôn mặt");

                // 2. AdaFace embedding
                const embedding = await getEmbedding(aligned);

                // 3. WiFaKey enrollment (fuzzy commitment)
                const { helperData, maskR, keyHash } = await wifakeyEnroll(embedding);

                // 4. Base64 encode để gửi lên server
                const toB64 = (arr: Uint8Array) => btoa(String.fromCharCode(...arr));
                dispatch({
                    type: "SET_WIFAKEY",
                    payload: {
                        helper_data_b64: toB64(helperData),
                        mask_b64: toB64(maskR),
                        key_hash_b64: toB64(keyHash),
                    },
                });
                dispatch({ type: "GO_REVIEW" });
            } catch (e) {
                setWifakeyError(e instanceof Error ? e.message : "WiFaKey enrollment thất bại");
            } finally {
                setWifakeyProcessing(false);
            }
        },
        []
    );

    const goToReview = useCallback(() => {
        dispatch({ type: "GO_REVIEW" });
    }, []);

    const goToForm = useCallback(() => {
        dispatch({ type: "GO_FORM" });
    }, []);

    const goToFaceBack = useCallback(() => {
        dispatch({ type: "GO_FACE_BACK" });
    }, []);

    const submit = useCallback(() => {
        if (!state.step1 || !state.wifakeyResult) return;
        register(
            {
                name: state.step1.fullName,
                username: state.step1.username,
                email: state.step1.email,
                helper_data_b64: state.wifakeyResult.helper_data_b64,
                mask_b64: state.wifakeyResult.mask_b64,
                key_hash_b64: state.wifakeyResult.key_hash_b64,
            },
            { onSuccess: () => dispatch({ type: "DONE" }) }
        );
    }, [state.step1, state.wifakeyResult, register]);

    const reset = useCallback(() => {
        dispatch({ type: "RESET" });
    }, []);

    return {
        state,
        isPending,
        error,
        wifakeyProcessing,
        wifakeyError,
        goToFace,
        setFaceBase64,
        processEnrollFace,
        goToReview,
        goToForm,
        goToFaceBack,
        submit,
        reset,
    };
}
