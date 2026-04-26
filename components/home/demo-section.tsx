"use client";

import { Lock } from "lucide-react";

export function DemoSection() {
    return (
        <section className="py-24 max-w-5xl mx-auto px-6">
            {/* Section heading */}
            <h2 className="text-[32px] font-bold tracking-[-0.01em] text-strong leading-[1.2] text-center mb-12">
                Experience the Gateway
            </h2>

            {/* Centered glass card */}
            <div className="max-w-md mx-auto glass-panel rounded-2xl p-8 relative overflow-hidden shadow-[2px_10px_30px_rgb(0,0,0,0.4)]">

                {/* Card header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Lock size={20} className="text-primary" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-strong text-sm">Acme Corp</div>
                            <div className="text-[10px] text-body dark:text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                                Secure Login
                            </div>
                        </div>
                    </div>
                    <span className="px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest">
                        Requesting Access
                    </span>
                </div>

                {/* ── Scanner ── */}
                <div className="relative mb-10">
                    {/* Outer pulse ring */}
                    <div className="absolute inset-0 scale-125 bg-primary/5 rounded-full animate-ping opacity-20" />

                    {/* Scanner container */}
                    <div className="relative w-40 h-40 mx-auto">
                        {/* Static ring */}
                        <div className="absolute -inset-1 border-2 border-primary/20 rounded-full" />
                        {/* Spinning ring */}
                        <div
                            className="absolute -inset-1 border-2 border-primary rounded-full border-t-transparent animate-spin"
                            style={{ animationDuration: "2s" }}
                        />

                        {/* Face avatar circle */}
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-card shadow-xl relative z-10">
                            <img
                                src="https://www.courant.com/wp-content/uploads/2023/03/SJM-L-BIOMETRICS-0308-2-1.jpg?w=620"
                                alt="Modern user portrait for biometric authentication"
                                className="w-full h-full object-cover"
                            />

                            {/* Scanning line overlay */}
                            <div
                                className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/40 to-transparent opacity-50"
                                style={{ animation: "pan 3s ease-in-out infinite" }}
                            />
                        </div>

                        {/* Success badge */}
                        <div className="absolute -bottom-2 -right-2 bg-[var(--kw-success)] text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-card z-20">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ── Status info ── */}
                <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--kw-success)] animate-pulse" />
                        <p className="font-bold text-strong">Identity Verified</p>
                    </div>

                    <p className="text-sm text-body dark:text-muted-foreground text-center max-w-[240px] mx-auto">
                        Encrypted biometric signature matches local secure enclave records.
                    </p>

                    {/* Progress bar */}
                    <div className="pt-4">
                        <div className="h-1.5 w-full bg-[var(--kw-bg4)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--kw-success)] w-full rounded-full transition-all duration-500" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}