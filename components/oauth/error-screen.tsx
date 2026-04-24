"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

interface ErrorScreenProps {
    message: string;
}

export function ErrorScreen({ message }: ErrorScreenProps) {
    return (
        <div className="space-y-6">
            <div className="bg-[var(--kw-bg2)] rounded-[2rem] p-8 shadow-2xl flex flex-col items-center gap-4 text-center">

                {/* Icon */}
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "var(--kw-danger-border-soft)" }}
                >
                    <AlertCircle size={28} style={{ color: "var(--kw-danger)" }} />
                </div>

                {/* Text */}
                <div>
                    <h2 className="text-xl font-bold text-[var(--kw-text-strong)]">Yêu cầu không hợp lệ</h2>
                    <p className="text-sm text-[var(--kw-text-muted)] mt-1">{message}</p>
                </div>

                {/* Nav link */}
                <Link
                    href="/"
                    className="text-xs font-bold uppercase tracking-widest text-[var(--kw-text-muted)] hover:text-[var(--kw-brand)] transition-colors cursor-pointer"
                >
                    Về trang chủ
                </Link>

            </div>
        </div>
    );
}