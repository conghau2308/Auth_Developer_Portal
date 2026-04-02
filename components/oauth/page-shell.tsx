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
        <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
            <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="flex justify-between items-center px-6 py-5 max-w-7xl mx-auto">
                    <Link href="/" className="text-xl font-black tracking-tighter text-primary">
                        The Obsidian Lens
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-primary" />
                        <span className="text-xs uppercase tracking-widest text-muted-foreground">
                            {clientName ? `OAuth · ${clientName}` : "Secure OAuth"}
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center px-6 py-20 relative">
                <div className="absolute inset-0 biometric-pulse pointer-events-none opacity-60" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-full max-w-md z-10 flex flex-col gap-6">
                    {clientName && (
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-px flex-1 bg-border" />
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-xs text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                {clientUrl ? (
                                    <a
                                        href={clientUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        {clientName} <ExternalLink size={10} />
                                    </a>
                                ) : (
                                    <span>{clientName}</span>
                                )}
                            </div>
                            <div className="h-px flex-1 bg-border" />
                        </div>
                    )}

                    {children}

                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { icon: ShieldCheck, label: "Biometric Node" },
                            { icon: Lock, label: "End-to-End Encrypted" },
                        ].map(({ icon: Icon, label }) => (
                            <div
                                key={label}
                                className="bg-muted/20 px-4 py-2 rounded-full flex items-center gap-2 border border-border"
                            >
                                <Icon size={14} className="text-muted-foreground" />
                                <span className="text-xs text-muted-foreground font-semibold">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main >
        </div >
    );
}