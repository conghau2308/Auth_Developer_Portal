"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Challenge = "blink" | "turn_left" | "turn_right" | "nod";

export interface QualityResult {
    pass: boolean;
    blur: number;
    brightness: number;
    faceSize: number;
    faceCentrality: number;
    occluded: boolean;
    multipleFaces: boolean;
}

export interface LivenessResult {
    pass: boolean;
    blinkCount: number;
    headTurnDetected: boolean;
    depthVariance: number;
    microMovement: number;
    eyeSpecular: boolean;
}

export interface ValidationState {
    phase: "idle" | "quality" | "liveness" | "recenter" | "antispoofing" | "pass" | "fail";
    quality: QualityResult | null;
    liveness: LivenessResult | null;
    currentChallenge: Challenge | null;
    challengesDone: Challenge[];
    challengesRequired: Challenge[];
    errorReason: string | null;
    score: number;
}

interface UseFaceValidationOptions {
    mode?: "login" | "signup";
    challenges?: Challenge[];
    blinkThreshold?: number;
    minFaceSize?: number;
    minBlur?: number;
    onPass?: () => void;
    onFail?: (reason: string) => void;
}

// ─── Landmark indices ─────────────────────────────────────────────────────────

const LEFT_EYE_IDX = [362, 385, 387, 263, 373, 380];
const RIGHT_EYE_IDX = [33, 160, 158, 133, 153, 144];
const NOSE_TIP = 1;
const LEFT_CHEEK = 234;
const RIGHT_CHEEK = 454;

// ─── Math helpers ─────────────────────────────────────────────────────────────

function dist2D(a: { x: number; y: number }, b: { x: number; y: number }) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function calcEAR(lm: any[], indices: number[]): number {
    const [p1, p2, p3, p4, p5, p6] = indices.map(i => lm[i]);
    if (!p1) return 1;
    const v1 = dist2D(p2, p6);
    const v2 = dist2D(p3, p5);
    const h = dist2D(p1, p4);
    return (v1 + v2) / (2 * h);
}

function calcYaw(lm: any[]): number {
    const nose = lm[NOSE_TIP];
    const left = lm[LEFT_CHEEK];
    const right = lm[RIGHT_CHEEK];
    if (!nose || !left || !right) return 0;
    const cx = (left.x + right.x) / 2;
    return (nose.x - cx) / ((right.x - left.x) / 2);
}

// ─── Quality checks ───────────────────────────────────────────────────────────

export function checkImageQuality(
    canvas: HTMLCanvasElement,
    faceBbox?: { x: number; y: number; w: number; h: number } | null,
): QualityResult {
    const ctx = canvas.getContext("2d");
    if (!ctx) return {
        pass: false, blur: 0, brightness: 50,
        faceSize: 0, faceCentrality: 0,
        occluded: false, multipleFaces: false,
    };

    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;

    // Brightness
    let lumSum = 0;
    const step = 4 * 4;
    let count = 0;
    for (let i = 0; i < data.length; i += step) {
        lumSum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        count++;
    }
    const brightness = lumSum / count / 2.55;

    // Blur — Laplacian variance
    const roi = faceBbox ?? { x: 0, y: 0, w: width, h: height };
    const roiData = ctx.getImageData(roi.x, roi.y, roi.w, roi.h).data;
    let laplacianSum = 0;
    let lapCount = 0;
    const roiW = roi.w;
    const roiH = roi.h;
    for (let y = 1; y < roiH - 1; y++) {
        for (let x = 1; x < roiW - 1; x++) {
            const idx = (y * roiW + x) * 4;
            const gray = (roiData[idx] + roiData[idx + 1] + roiData[idx + 2]) / 3;
            const top = (roiData[((y - 1) * roiW + x) * 4] + roiData[((y - 1) * roiW + x) * 4 + 1] + roiData[((y - 1) * roiW + x) * 4 + 2]) / 3;
            const bottom = (roiData[((y + 1) * roiW + x) * 4] + roiData[((y + 1) * roiW + x) * 4 + 1] + roiData[((y + 1) * roiW + x) * 4 + 2]) / 3;
            const left2 = (roiData[(y * roiW + x - 1) * 4] + roiData[(y * roiW + x - 1) * 4 + 1] + roiData[(y * roiW + x - 1) * 4 + 2]) / 3;
            const right2 = (roiData[(y * roiW + x + 1) * 4] + roiData[(y * roiW + x + 1) * 4 + 1] + roiData[(y * roiW + x + 1) * 4 + 2]) / 3;
            laplacianSum += Math.abs(4 * gray - top - bottom - left2 - right2);
            lapCount++;
        }
    }
    const blur = Math.min(100, (laplacianSum / lapCount) * 2.5);

    const faceSize = faceBbox ? (faceBbox.w * faceBbox.h) / (width * height) * 100 : 20;
    const faceCenterX = faceBbox ? (faceBbox.x + faceBbox.w / 2) / width : 0.5;
    const faceCenterY = faceBbox ? (faceBbox.y + faceBbox.h / 2) / height : 0.5;
    const faceCentrality = 1 - Math.hypot(faceCenterX - 0.5, faceCenterY - 0.5) * 2;

    const pass =
        blur > 25 &&
        brightness > 20 && brightness < 90 &&
        faceSize > 10 &&
        faceCentrality > 0.5;

    return { pass, blur, brightness, faceSize, faceCentrality, occluded: false, multipleFaces: false };
}

// ─── Depth variance ───────────────────────────────────────────────────────────

function calcDepthVariance(landmarks: any[]): number {
    const zVals = landmarks.slice(0, 100).map((l: any) => l.z ?? 0);
    const mean = zVals.reduce((a, b) => a + b, 0) / zVals.length;
    const variance = zVals.reduce((a, b) => a + (b - mean) ** 2, 0) / zVals.length;
    return Math.sqrt(variance);
}

// ─── Main hook ────────────────────────────────────────────────────────────────

export function useFaceValidation(options: UseFaceValidationOptions = {}) {
    const {
        mode = "signup",
        blinkThreshold = 0.25,
        minFaceSize = mode === "login" ? 10 : 12,
        minBlur = 25,
        onPass,
        onFail,
    } = options;

    const challenges: Challenge[] = mode === "login"
        ? []
        : (options.challenges ?? ["blink", "turn_left"]);

    const [state, setState] = useState<ValidationState>({
        phase: "idle",
        quality: null,
        liveness: null,
        currentChallenge: challenges[0] ?? null,
        challengesDone: [],
        challengesRequired: challenges,
        errorReason: null,
        score: 0,
    });

    // ── Refs ──────────────────────────────────────────────────────────────────
    const blinkCountRef = useRef(0);
    const earHistoryRef = useRef<number[]>([]);
    const inBlinkRef = useRef(false);
    const headTurnRef = useRef(false);
    const microMovementsRef = useRef<number[]>([]);
    const prevLandmarksRef = useRef<any[] | null>(null);
    const depthSamplesRef = useRef<number[]>([]);
    const challengeIndexRef = useRef(0);
    const frameCountRef = useRef(0);
    const passiveFrameCountRef = useRef(0);
    const recenterFramesRef = useRef(0);   // frames liên tiếp mặt đã thẳng
    const pendingLivenessRef = useRef<LivenessResult | null>(null); // lưu liveness khi chờ recenter
    const pendingScoreRef = useRef(0);
    const pendingDoneRef = useRef<Challenge[]>([]);
    const faceMeshRef = useRef<any>(null);
    const animFrameRef = useRef<number>(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const phaseRef = useRef<ValidationState["phase"]>("idle");

    useEffect(() => { phaseRef.current = state.phase; }, [state.phase]);

    // ── Load MediaPipe FaceMesh ───────────────────────────────────────────────
    const loadFaceMesh = useCallback(async () => {
        if (faceMeshRef.current) return faceMeshRef.current;
        const { FaceMesh } = await import("@mediapipe/face_mesh" as any);
        const mesh = new FaceMesh({
            locateFile: (file: string) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`,
        });
        mesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.6,
            minTrackingConfidence: 0.6,
        });
        faceMeshRef.current = mesh;
        return mesh;
    }, []);

    // ── Process frame ─────────────────────────────────────────────────────────
    const processResults = useCallback((results: any) => {
        if (phaseRef.current === "pass" || phaseRef.current === "fail") return;

        const lmList = results.multiFaceLandmarks?.[0];

        // Không detect được mặt
        if (!lmList || lmList.length === 0) {
            // Ở phase recenter, vẫn tính là không thấy mặt
            frameCountRef.current++;
            if (frameCountRef.current > 60) {
                setState(s => ({ ...s, phase: "fail", errorReason: "Không phát hiện khuôn mặt. Vui lòng căn lại." }));
                onFail?.("no_face");
            }
            return;
        }

        frameCountRef.current = 0;

        // Multiple faces
        const multiplefaces = (results.multiFaceLandmarks?.length ?? 0) > 1;
        if (multiplefaces) {
            setState(s => ({ ...s, phase: "fail", errorReason: "Phát hiện nhiều khuôn mặt trong khung hình." }));
            onFail?.("multiple_faces");
            return;
        }

        // ── Phase: quality ────────────────────────────────────────────────────
        if (phaseRef.current === "quality") {
            const xs = lmList.map((l: any) => l.x);
            const ys = lmList.map((l: any) => l.y);
            const minX = Math.min(...xs), maxX = Math.max(...xs);
            const minY = Math.min(...ys), maxY = Math.max(...ys);

            setState(s => {
                const faceSize = (maxX - minX) * (maxY - minY) * 100;
                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;
                const centrality = 1 - Math.hypot(centerX - 0.5, centerY - 0.5) * 2;

                const quality: QualityResult = {
                    pass: faceSize > minFaceSize && centrality > 0.45,
                    blur: 60,
                    brightness: 65,
                    faceSize,
                    faceCentrality: Math.max(0, centrality),
                    occluded: false,
                    multipleFaces: multiplefaces,
                };

                if (!quality.pass) {
                    let reason = "";
                    if (faceSize <= minFaceSize) reason = "Khuôn mặt quá nhỏ, hãy đến gần hơn.";
                    else if (centrality <= 0.45) reason = "Hãy căn khuôn mặt vào giữa khung.";
                    return { ...s, quality, errorReason: reason };
                }

                return { ...s, quality, phase: "liveness" };
            });
            return;
        }

        // ── Phase: recenter ───────────────────────────────────────────────────
        // Sau khi tất cả challenges xong, yêu cầu người dùng quay mặt về giữa
        if (phaseRef.current === "recenter") {
            const yaw = calcYaw(lmList);
            const xs = lmList.map((l: any) => l.x);
            const ys = lmList.map((l: any) => l.y);
            const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
            const centerY = (Math.min(...ys) + Math.max(...ys)) / 2;

            // Kiểm tra mặt đã thẳng và ở giữa chưa
            const isCentered =
                Math.abs(yaw) < 0.08 &&
                Math.abs(centerX - 0.5) < 0.12 &&
                Math.abs(centerY - 0.5) < 0.15;

            if (isCentered) {
                recenterFramesRef.current++;
            } else {
                // Reset nếu người dùng lệch lại — yêu cầu 10 frames liên tiếp
                recenterFramesRef.current = 0;
            }

            // Cần ~10 frames ổn định (~0.33s) mới chuyển sang pass
            if (recenterFramesRef.current >= 10) {
                const liveness = pendingLivenessRef.current!;
                const score = pendingScoreRef.current;
                const done = pendingDoneRef.current;

                setState(s => ({
                    ...s,
                    phase: "pass",
                    liveness,
                    challengesDone: done,
                    currentChallenge: null,
                    score,
                }));
                onPass?.();
            }
            return;
        }

        // ── Phase: liveness ───────────────────────────────────────────────────
        if (phaseRef.current === "liveness") {

            // ── LOGIN: passive check ─────────────────────────────────────────
            if (challenges.length === 0) {
                if (prevLandmarksRef.current) {
                    const movement = dist2D(lmList[NOSE_TIP], prevLandmarksRef.current[NOSE_TIP]);
                    microMovementsRef.current.push(movement);
                    if (microMovementsRef.current.length > 30) microMovementsRef.current.shift();
                }
                prevLandmarksRef.current = lmList;

                const depthVar = calcDepthVariance(lmList);
                depthSamplesRef.current.push(depthVar);
                if (depthSamplesRef.current.length > 30) depthSamplesRef.current.shift();

                passiveFrameCountRef.current++;

                if (passiveFrameCountRef.current >= 20) {
                    const avgMicro = microMovementsRef.current.reduce((a, b) => a + b, 0) / (microMovementsRef.current.length || 1);
                    const avgDepth = depthSamplesRef.current.reduce((a, b) => a + b, 0) / (depthSamplesRef.current.length || 1);
                    const livenessPass = avgDepth > 0.003 || avgMicro > 0.0008;

                    const liveness: LivenessResult = {
                        pass: livenessPass,
                        blinkCount: 0,
                        headTurnDetected: false,
                        depthVariance: avgDepth,
                        microMovement: avgMicro,
                        eyeSpecular: true,
                    };

                    if (!livenessPass) {
                        setState(s => ({ ...s, phase: "fail", liveness, errorReason: "Không thể xác minh đây là người thật." }));
                        onFail?.("liveness_fail");
                    } else {
                        const score = Math.round(Math.min(100, 55 + avgDepth * 800 + avgMicro * 400));
                        // Login không cần challenge quay đầu nên không cần recenter,
                        // chuyển thẳng sang pass
                        setState(s => ({ ...s, phase: "pass", liveness, currentChallenge: null, score }));
                        onPass?.();
                    }
                }
                return;
            }

            // ── SIGNUP: challenge-response ────────────────────────────────────
            const currentChallenge = challenges[challengeIndexRef.current];

            // EAR — blink detection
            const leftEAR = calcEAR(lmList, LEFT_EYE_IDX);
            const rightEAR = calcEAR(lmList, RIGHT_EYE_IDX);
            const ear = (leftEAR + rightEAR) / 2;
            earHistoryRef.current.push(ear);
            if (earHistoryRef.current.length > 10) earHistoryRef.current.shift();

            if (ear < blinkThreshold && !inBlinkRef.current) {
                inBlinkRef.current = true;
            } else if (ear > blinkThreshold + 0.05 && inBlinkRef.current) {
                inBlinkRef.current = false;
                blinkCountRef.current++;
            }

            // Yaw
            const yaw = calcYaw(lmList);

            // Micro movement
            if (prevLandmarksRef.current) {
                const movement = dist2D(lmList[NOSE_TIP], prevLandmarksRef.current[NOSE_TIP]);
                microMovementsRef.current.push(movement);
                if (microMovementsRef.current.length > 30) microMovementsRef.current.shift();
            }
            prevLandmarksRef.current = lmList;

            // Depth variance
            const depthVar = calcDepthVariance(lmList);
            depthSamplesRef.current.push(depthVar);
            if (depthSamplesRef.current.length > 30) depthSamplesRef.current.shift();

            // Kiểm tra challenge hiện tại
            let challengePassed = false;
            if (currentChallenge === "blink" && blinkCountRef.current >= 2) {
                challengePassed = true;
                blinkCountRef.current = 0;
            } else if (currentChallenge === "turn_left" && yaw < -0.18) {
                challengePassed = true;
            } else if (currentChallenge === "turn_right" && yaw > 0.18) {
                challengePassed = true;
            } else if (currentChallenge === "nod") {
                const forehead = lmList[10];
                const pitchProxy = Math.abs(lmList[NOSE_TIP].y - forehead.y);
                if (pitchProxy < 0.08) challengePassed = true;
            }

            if (challengePassed) {
                const newIndex = challengeIndexRef.current + 1;
                challengeIndexRef.current = newIndex;
                const doneSoFar = challenges.slice(0, newIndex);

                if (newIndex >= challenges.length) {
                    // Tất cả challenges xong — tính liveness score
                    const avgMicro = microMovementsRef.current.reduce((a, b) => a + b, 0) / (microMovementsRef.current.length || 1);
                    const avgDepth = depthSamplesRef.current.reduce((a, b) => a + b, 0) / (depthSamplesRef.current.length || 1);
                    const livenessPass = avgMicro > 0.001 && avgDepth > 0.005;

                    const liveness: LivenessResult = {
                        pass: livenessPass,
                        blinkCount: blinkCountRef.current,
                        headTurnDetected: headTurnRef.current,
                        depthVariance: avgDepth,
                        microMovement: avgMicro,
                        eyeSpecular: true,
                    };

                    if (!livenessPass) {
                        setState(s => ({ ...s, phase: "fail", liveness, errorReason: "Không thể xác minh đây là người thật." }));
                        onFail?.("liveness_fail");
                    } else {
                        const score = Math.round(Math.min(100, 60 + avgDepth * 800 + avgMicro * 400));

                        // ── Lưu pending data, chuyển sang phase recenter ──────
                        // Không gọi onPass ở đây — chờ mặt quay về giữa đã
                        pendingLivenessRef.current = liveness;
                        pendingScoreRef.current = score;
                        pendingDoneRef.current = doneSoFar;
                        recenterFramesRef.current = 0;

                        setState(s => ({
                            ...s,
                            phase: "recenter",
                            liveness,
                            challengesDone: doneSoFar,
                            currentChallenge: null,
                            score,
                        }));
                    }
                } else {
                    // Challenge tiếp theo
                    setState(s => ({
                        ...s,
                        challengesDone: doneSoFar,
                        currentChallenge: challenges[newIndex],
                    }));
                }
            } else {
                setState(s => ({
                    ...s,
                    currentChallenge: currentChallenge ?? null,
                }));
            }
        }
    }, [challenges, blinkThreshold, minFaceSize, onPass, onFail]);

    // ── Detection loop ────────────────────────────────────────────────────────
    const runLoop = useCallback(async () => {
        const mesh = faceMeshRef.current;
        const video = videoRef.current;
        if (!mesh || !video || video.readyState < 2) {
            animFrameRef.current = requestAnimationFrame(runLoop);
            return;
        }
        try {
            await mesh.send({ image: video });
        } catch { /* ignore frame errors */ }
        animFrameRef.current = requestAnimationFrame(runLoop);
    }, []);

    // ── Start ─────────────────────────────────────────────────────────────────
    const startValidation = useCallback(async (video: HTMLVideoElement) => {
        videoRef.current = video;
        challengeIndexRef.current = 0;
        blinkCountRef.current = 0;
        inBlinkRef.current = false;
        headTurnRef.current = false;
        microMovementsRef.current = [];
        depthSamplesRef.current = [];
        prevLandmarksRef.current = null;
        frameCountRef.current = 0;
        passiveFrameCountRef.current = 0;
        recenterFramesRef.current = 0;
        pendingLivenessRef.current = null;
        pendingScoreRef.current = 0;
        pendingDoneRef.current = [];

        setState({
            phase: "quality",
            quality: null,
            liveness: null,
            currentChallenge: challenges[0] ?? null,
            challengesDone: [],
            challengesRequired: challenges,
            errorReason: null,
            score: 0,
        });

        const mesh = await loadFaceMesh();
        mesh.onResults(processResults);
        animFrameRef.current = requestAnimationFrame(runLoop);
    }, [challenges, loadFaceMesh, processResults, runLoop]);

    // ── Stop ──────────────────────────────────────────────────────────────────
    const stopValidation = useCallback(() => {
        cancelAnimationFrame(animFrameRef.current);
        videoRef.current = null;
    }, []);

    // ── Reset ─────────────────────────────────────────────────────────────────
    const resetValidation = useCallback(() => {
        stopValidation();
        recenterFramesRef.current = 0;
        pendingLivenessRef.current = null;
        pendingScoreRef.current = 0;
        pendingDoneRef.current = [];
        setState({
            phase: "idle",
            quality: null,
            liveness: null,
            currentChallenge: challenges[0] ?? null,
            challengesDone: [],
            challengesRequired: challenges,
            errorReason: null,
            score: 0,
        });
    }, [challenges, stopValidation]);

    useEffect(() => () => stopValidation(), [stopValidation]);

    return { state, startValidation, stopValidation, resetValidation };
}