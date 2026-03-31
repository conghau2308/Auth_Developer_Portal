"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function AuthHeader() {
    return (
        <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="flex justify-between items-center px-6 py-6 w-full max-w-7xl mx-auto">
                <Link
                    href="/"
                    className="text-xl font-black tracking-tighter text-primary"
                >
                    The Obsidian Lens
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                        Secure Biometric Node
                    </span>
                    <ShieldCheck size={16} className="text-primary" />
                </div>
            </div>
        </header>
    );
}