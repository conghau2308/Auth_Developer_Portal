"use client";

import { useReducer, useCallback } from "react";
import { useRegister } from "@/hooks/use-register";

export interface Step1Data {
    fullName: string;
    username: string;
    email: string;
}

export type WizardStep = "form" | "face" | "review" | "done";

interface WizardState {
    step: WizardStep;
    step1: Step1Data | null;
    faceBase64: string | null;
}

type WizardAction =
    | { type: "GO_FACE"; payload: Step1Data }
    | { type: "SET_FACE"; payload: string }
    | { type: "GO_REVIEW" }
    | { type: "GO_FORM" }
    | { type: "GO_FACE_BACK" }
    | { type: "DONE" }
    | { type: "RESET" };

const initialState: WizardState = {
    step: "form",
    step1: null,
    faceBase64: null,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
    switch (action.type) {
        case "GO_FACE":
            return { ...state, step: "face", step1: action.payload };
        case "SET_FACE":
            return { ...state, faceBase64: action.payload || null };
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

    const goToFace = useCallback((data: Step1Data) => {
        dispatch({ type: "GO_FACE", payload: data });
    }, []);

    const setFaceBase64 = useCallback((base64: string) => {
        dispatch({ type: "SET_FACE", payload: base64 });
    }, []);

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
        if (!state.step1 || !state.faceBase64) return;
        register(
            {
                name: state.step1.fullName,
                username: state.step1.username,
                email: state.step1.email,
                image_b64: state.faceBase64,
            },
            { onSuccess: () => dispatch({ type: "DONE" }) }
        );
    }, [state.step1, state.faceBase64, register]);

    const reset = useCallback(() => {
        dispatch({ type: "RESET" });
    }, []);

    return {
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
    };
}