"use client";

import { useReducer, useCallback, useState } from "react";
import { useRegister } from "@/hooks/use-register";
import { enrollWithNativeApp } from "@/lib/wifakey/native-bridge";

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
    wifakeyResult: WiFaKeyEnrollResult | null;
}

type WizardAction =
    | { type: "GO_FACE"; payload: Step1Data }
    | { type: "SET_WIFAKEY"; payload: WiFaKeyEnrollResult }
    | { type: "GO_REVIEW" }
    | { type: "GO_FORM" }
    | { type: "GO_FACE_BACK" }
    | { type: "DONE" }
    | { type: "RESET" };

const initialState: WizardState = {
    step: "form",
    step1: null,
    wifakeyResult: null,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
    switch (action.type) {
        case "GO_FACE":   return { ...state, step: "face", step1: action.payload };
        case "SET_WIFAKEY": return { ...state, wifakeyResult: action.payload };
        case "GO_REVIEW": return { ...state, step: "review" };
        case "GO_FORM":   return { ...state, step: "form" };
        case "GO_FACE_BACK": return { ...state, step: "face" };
        case "DONE":      return { ...state, step: "done" };
        case "RESET":     return initialState;
        default:          return state;
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

    /**
     * Yêu cầu native app mở camera và thực hiện enrollment.
     * Không cần imageData hay landmarks — native app tự xử lý toàn bộ pipeline.
     */
    const processEnrollFace = useCallback(async () => {
        setWifakeyProcessing(true);
        setWifakeyError(null);
        try {
            const { helper_data_b64, mask_b64, key_hash_b64 } = await enrollWithNativeApp();
            dispatch({
                type: "SET_WIFAKEY",
                payload: { helper_data_b64, mask_b64, key_hash_b64 },
            });
            dispatch({ type: "GO_REVIEW" });
        } catch (e) {
            setWifakeyError(e instanceof Error ? e.message : "WiFaKey enrollment thất bại");
        } finally {
            setWifakeyProcessing(false);
        }
    }, []);

    const goToReview  = useCallback(() => dispatch({ type: "GO_REVIEW" }), []);
    const goToForm    = useCallback(() => dispatch({ type: "GO_FORM" }), []);
    const goToFaceBack = useCallback(() => dispatch({ type: "GO_FACE_BACK" }), []);

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

    const reset = useCallback(() => dispatch({ type: "RESET" }), []);

    return {
        state,
        isPending,
        error,
        wifakeyProcessing,
        wifakeyError,
        goToFace,
        processEnrollFace,
        goToReview,
        goToForm,
        goToFaceBack,
        submit,
        reset,
    };
}
