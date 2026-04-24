"use client";

import { useEffect } from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: "rgba(0,0,0,0.4)", // hoặc var(--kw-overlay)
                    backdropFilter: "blur(4px)"
                }}
                onClick={onClose}
            />

            {/* Modal content */}
            <div
                className="relative w-full max-w-[460px] rounded-xl p-7 animate-modal-in"
                style={{
                    background: "var(--kw-bg)",
                    border: "1px solid var(--ol-border)",
                }}
            >
                <h3 className="text-[17px] font-bold mb-1.5">
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

export function WarnBox({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="flex gap-2 items-start rounded-lg px-3.5 py-3 text-[12.5px] mb-4"
            style={{
                background: "var(--kw-warn-soft)",
                border: "1px solid var(--kw-warn-border)",
                color: "var(--ol-warn)",
            }}
        >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 mt-[1px]">
                <path d="M8 1L1 14h14L8 1z" />
                <path d="M8 6v4M8 11.5v.5" />
            </svg>
            <span>{children}</span>
        </div>
    );
}

export function SecretBox({ value }: { value: string }) {
    return (
        <div
            className="rounded-lg p-3.5 my-4 text-[12px] break-all leading-[1.8] tracking-[0.04em]"
            style={{
                fontFamily: "'IBM Plex Mono', monospace",
                background: "var(--ol-bg3)",
                border: "1px solid var(--kw-success-border)",
                color: "var(--ol-success)",
            }}
        >
            {value}
        </div>
    );
}