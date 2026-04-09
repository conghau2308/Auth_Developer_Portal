"use client";

import { useEffect } from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
    // Close on Escape key
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="w-full max-w-[460px] rounded-xl p-7 animate-modal-in"
                style={{
                    background: "var(--ol-bg2)",
                    border: "1px solid var(--ol-border2)",
                }}
            >
                <h3
                    className="text-[17px] font-bold mb-1.5"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                >
                    {title}
                </h3>
                {children}
            </div>
        </div>
    );
}

export function ModalBody({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="text-[13px] mb-5 leading-relaxed"
            style={{ color: "var(--ol-muted)" }}
        >
            {children}
        </div>
    );
}

export function ModalActions({ children }: { children: React.ReactNode }) {
    return <div className="flex gap-2.5 justify-end">{children}</div>;
}

// ── Warn box ────────────────────────────────────────────────────
export function WarnBox({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="flex gap-2 items-start rounded-lg px-3.5 py-3 text-[12.5px] mb-4"
            style={{
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.25)",
                color: "var(--ol-warn)",
            }}
        >
            {/* Warning icon */}
            <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="shrink-0 mt-[1px]"
            >
                <path d="M8 1L1 14h14L8 1z" />
                <path d="M8 6v4M8 11.5v.5" />
            </svg>
            <span>{children}</span>
        </div>
    );
}

// ── Secret reveal box ────────────────────────────────────────────
export function SecretBox({ value }: { value: string }) {
    return (
        <div
            className="rounded-lg p-3.5 my-4 text-[12px] break-all leading-[1.8] tracking-[0.04em]"
            style={{
                fontFamily: "'IBM Plex Mono', monospace",
                background: "var(--ol-bg3)",
                border: "1px solid rgba(61,220,132,0.3)",
                color: "var(--ol-success)",
            }}
        >
            {value}
        </div>
    );
}