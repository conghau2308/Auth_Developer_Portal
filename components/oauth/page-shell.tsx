"use client";

import Link from "next/link";
import { ShieldCheck, Lock, ExternalLink } from "lucide-react";

interface PageShellProps {
    children: React.ReactNode;
    clientName?: string;
    clientUrl?: string;
}

export function PageShell({ children, clientName, clientUrl }: PageShellProps) {
    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden bg-background text-foreground">

            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-[var(--kw-border)] bg-background/80 backdrop-blur-xl">
                <div className="flex justify-between items-center px-6 py-5 max-w-7xl mx-auto">
                    <Link
                        href="/"
                        className="text-xl font-black tracking-tighter text-[var(--kw-brand)] hover:opacity-80 transition-opacity cursor-pointer"
                    >
                        WiFaKey
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-[var(--kw-brand)]" />
                        <span className="text-xs uppercase tracking-widest text-[var(--kw-text-muted)]">
                            {clientName ? `OAuth · ${clientName}` : "Secure OAuth"}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-grow flex items-center justify-center px-6 py-20 relative">
                <div className="absolute inset-0 biometric-pulse pointer-events-none opacity-60" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] pointer-events-none bg-primary/5" />

                <div className="w-full max-w-md z-10 flex flex-col gap-6">

                    {/* Client name pill */}
                    {clientName && (
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-px flex-1 bg-[var(--kw-border)]" />
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--kw-border)] bg-[var(--kw-bg2)] text-xs text-[var(--kw-text-muted)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--kw-success)] animate-pulse" />
                                {clientUrl ? (
                                    <a
                                        href={clientUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-[var(--kw-brand)] transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                        {clientName} <ExternalLink size={10} />
                                    </a>
                                ) : (
                                    <span>{clientName}</span>
                                )}
                            </div>
                            <div className="h-px flex-1 bg-[var(--kw-border)]" />
                        </div>
                    )}

                    {children}

                    {/* Trust badges */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { icon: ShieldCheck, label: "Biometric Node" },
                            { icon: Lock, label: "End-to-End Encrypted" },
                        ].map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="px-4 py-2 rounded-full flex items-center gap-2 border border-[var(--kw-border)] bg-muted/20 cursor-default"
                            >
                                <Icon size={14} className="text-[var(--kw-text-muted)]" />
                                <span className="text-xs font-semibold text-[var(--kw-text-muted)]">{label}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </main>
        </div>
    );
}