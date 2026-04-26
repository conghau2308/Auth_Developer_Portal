"use client";

import { Fingerprint, Zap, Code2 } from "lucide-react";

const features = [
    {
        icon: <Fingerprint size={24} className="text-primary" />,
        iconBg: "bg-primary/10",
        title: "Unbreakable Security",
        description:
            "AES-256 bit biometric encryption at rest and in transit. Your biometric data never leaves the secure enclave.",
    },
    {
        icon: <Zap size={24} className="text-[var(--kw-brand-light)]" fill="currentColor" />,
        iconBg: "bg-[var(--kw-brand-soft)]",
        title: "Instant Login",
        description:
            "Sub-second authentication latency. Users are in before they even realize they've been scanned.",
    },
    {
        icon: <Code2 size={24} className="text-[var(--kw-success)]" />,
        iconBg: "bg-[var(--kw-success)]/10",
        title: "Developer Friendly",
        description:
            "Integrate our sophisticated OAuth flow with a single line of code using our comprehensive SDKs.",
    },
];

export function FeatureSection() {
    return (
        <section className="bg-[var(--kw-bg3)] dark:bg-muted/20 py-20 border-y border-[var(--kw-border)]">
            <div className="max-w-screen-xl mx-auto px-6 md:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-[32px] font-bold tracking-[-0.01em] text-strong leading-[1.2] mb-4">
                        Enterprise-grade infrastructure.
                    </h2>
                    <p className="text-[18px] text-body dark:text-muted-foreground leading-relaxed">
                        Built for scale, designed for simplicity.
                    </p>
                </div>

                {/* 3-column feature cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-card p-8 rounded-xl border border-[var(--kw-border)] shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-lg ${f.iconBg} flex items-center justify-center mb-6`}>
                                {f.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-[24px] font-bold leading-[1.3] text-strong mb-3">
                                {f.title}
                            </h3>

                            {/* Body */}
                            <p className="text-[16px] text-body dark:text-muted-foreground leading-[1.6]">
                                {f.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}