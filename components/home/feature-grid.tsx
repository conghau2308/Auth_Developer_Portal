import { Fingerprint, Lock, ShieldCheck, Zap, ArrowRight } from "lucide-react";

const PROVIDERS_COLOR: Record<string, string> = {
    Google: "bg-[#4285f4]",
    GitHub: "bg-[#24292f] dark:bg-[#e8e8e8]",
    Discord: "bg-[#5865f2]",
    Apple: "bg-[#000000] dark:bg-[#a0a0a0]",
};

function StatRow({ stats }: { stats: { value: string; label: string }[] }) {
    return (
        <div className="flex gap-3 mt-5">
            {stats.map((s) => (
                <div key={s.label} className="flex-1 bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/20 rounded-xl px-4 py-3 shadow-sm">
                    <div className="text-[24px] font-black text-primary tracking-tight leading-none drop-shadow-sm">{s.value}</div>
                    <div className="text-[11px] text-body dark:text-muted-foreground/80 font-bold tracking-[0.05em] mt-1.5 uppercase">{s.label}</div>
                </div>
            ))}
        </div>
    );
}

function MiniFaceScan() {
    return (
        // Đã đổi var(--kw-cyan-soft) thành var(--kw-brand-soft)
        <div className="relative w-16 h-16 mx-auto rounded-full bg-primary/5 border-2 border-primary/20 flex items-center justify-center overflow-hidden mb-4 shadow-[0_0_15px_var(--kw-brand-soft)]">
            {/* Đã đổi var(--kw-cyan) thành var(--kw-brand) */}
            <div className="absolute left-0 right-0 h-[2px] bg-primary/60 shadow-[0_0_8px_var(--kw-brand)] animate-[scanFace_2s_ease-in-out_infinite]" />
            <svg viewBox="0 0 28 28" fill="none" className="w-8 h-8 text-primary drop-shadow-md">
                <ellipse cx="14" cy="12" rx="5" ry="5.5" stroke="currentColor" strokeWidth="1.5" opacity=".8" />
                <path d="M10 21c1-2 7-2 8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".8" />
                <circle cx="12" cy="11" r="1.5" fill="currentColor" opacity="1" />
                <circle cx="16" cy="11" r="1.5" fill="currentColor" opacity="1" />
            </svg>
        </div>
    );
}

function AuthFlow() {
    const steps = [
        "User initiates login",
        "Camera captures liveness check",
        "Hash generated on-device",
        "OAuth token issued · 312ms",
    ];
    return (
        <div className="flex flex-col gap-2.5 mt-4">
            {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-muted/30 border border-slate-200 dark:border-border text-[13px] font-medium text-body dark:text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5">
                    {/* Đã đổi var(--kw-cyan-soft) thành var(--kw-brand-soft) */}
                    <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[11px] font-extrabold flex items-center justify-center flex-shrink-0 shadow-[0_0_5px_var(--kw-brand-soft)]">
                        {i + 1}
                    </span>
                    {step}
                </div>
            ))}
        </div>
    );
}

export function FeatureGrid() {
    return (
        <section className="relative py-28 bg-background overflow-hidden">
            {/* Background Pattern mờ để tạo chiều sâu */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="relative max-w-screen-xl mx-auto px-6 md:px-8 z-10">

                {/* Header */}
                <div className="mb-16 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary tracking-[0.1em] uppercase mb-5 shadow-sm">
                        <Zap size={12} className="fill-primary/50" /> Why Keywave
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-strong leading-[1.1] mb-4">
                        Built for the <br className="hidden md:block" />
                        {/* Thay from-cyan-400 thành to-[var(--kw-brand-light)] để Gradient mượt mà theo Theme */}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--kw-text-strong)] via-[var(--kw-brand)] to-[var(--kw-brand-light)] drop-shadow-sm">passwordless</span> era
                    </h2>
                    <p className="text-body dark:text-muted-foreground text-lg max-w-lg leading-relaxed font-medium">
                        Every component designed around biometric-first identity — from SDK to compliance.
                    </p>
                </div>

                {/* Bento grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* Row 1 — wide liveness card */}
                    {/* Đã đổi shadow hover sang var(--kw-brand-glow) */}
                    <div className="md:col-span-2 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-3xl p-8 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_0_30px_-5px_var(--kw-brand-glow)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/15 rounded-full blur-[80px] transition-all duration-500 group-hover:bg-primary/25" />
                        <div className="relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center mb-6 shadow-sm">
                            <Fingerprint size={22} className="text-primary" />
                        </div>
                        <h3 className="relative z-10 text-[19px] font-extrabold text-strong mb-2.5 tracking-tight">
                            Liveness detection 2.0
                        </h3>
                        <p className="relative z-10 text-[14px] text-body dark:text-muted-foreground leading-relaxed max-w-md font-medium">
                            Stops spoofing from photos, video, or 3D masks. Our neural model checks for involuntary micro-movements only a real face produces.
                        </p>
                        <div className="relative z-10 mt-6">
                            <StatRow stats={[
                                { value: "99.97%", label: "Accuracy" },
                                { value: "<400ms", label: "Auth time" },
                                { value: "0", label: "Stored biometrics" },
                            ]} />
                        </div>
                    </div>

                    {/* Row 1 — zero knowledge */}
                    <div className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-3xl p-8 flex flex-col group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_0_30px_-5px_var(--kw-brand-glow)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center mb-6 shadow-sm">
                            <Lock size={22} className="text-primary" />
                        </div>
                        <h3 className="text-[19px] font-extrabold text-strong mb-2.5 tracking-tight">
                            Zero-knowledge proofs
                        </h3>
                        <p className="text-[14px] text-body dark:text-muted-foreground leading-relaxed font-medium">
                            Hash generated on-device, encrypted in transit. We mathematically cannot see your users' faces.
                        </p>
                    </div>

                    {/* Row 2 — sub-second metric */}
                    <div className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-3xl p-8 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_0_30px_-5px_var(--kw-brand-glow)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
                        <MiniFaceScan />
                        <div className="text-center mb-6">
                            <span className="text-[42px] font-black text-primary tracking-[-0.03em] leading-none drop-shadow-sm">312</span>
                            <span className="text-[18px] text-body dark:text-muted-foreground font-bold ml-1">ms</span>
                            <div className="text-[11px] text-body dark:text-muted-foreground/70 font-bold tracking-[0.08em] uppercase mt-1">Median auth</div>
                        </div>
                        <h3 className="text-[19px] font-extrabold text-strong mb-2.5 tracking-tight flex items-center gap-2">
                            <Zap size={18} className="text-primary" fill="currentColor" /> Sub-second auth
                        </h3>
                        <p className="text-[14px] text-body dark:text-muted-foreground leading-relaxed font-medium">
                            Faster than typing a password. Users never wait, never drop off.
                        </p>
                    </div>

                    {/* Row 2 — OAuth compat */}
                    <div className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-3xl p-8 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_0_30px_-5px_var(--kw-brand-glow)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center mb-6 shadow-sm">
                            <ArrowRight size={22} className="text-primary" />
                        </div>
                        <h3 className="text-[19px] font-extrabold text-strong mb-2.5 tracking-tight">
                            Standard OAuth 2.0
                        </h3>
                        <p className="text-[14px] text-body dark:text-muted-foreground leading-relaxed mb-5 font-medium">
                            Drop-in replacement for existing flows. Works alongside Google, GitHub, or any IdP.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {["Google", "GitHub", "Discord", "Apple"].map((p) => (
                                <span key={p} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-border bg-slate-50 dark:bg-muted/30 text-[12px] font-bold text-strong shadow-sm hover:border-primary/30 transition-colors">
                                    <span className={`w-2 h-2 rounded-full shadow-sm ${PROVIDERS_COLOR[p]}`} />
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Row 2 — compliance (wide) */}
                    <div className="md:col-span-2 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-3xl p-8 flex flex-col md:flex-row gap-10 items-start group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_0_30px_-5px_var(--kw-brand-glow)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
                        <div className="flex-1">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center mb-6 shadow-sm">
                                <ShieldCheck size={22} className="text-primary" />
                            </div>
                            <h3 className="text-[19px] font-extrabold text-strong mb-2.5 tracking-tight">
                                Global compliance, out of the box
                            </h3>
                            <p className="text-[14px] text-body dark:text-muted-foreground leading-relaxed mb-6 font-medium">
                                Biometric data handling that meets every regulation you'll encounter — no legal team required.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {["GDPR", "CCPA", "SOC 2", "ISO 27001", "HIPAA-ready"].map((b) => (
                                    <span key={b} className="px-3 py-1.5 rounded-md border border-primary/20 bg-primary/10 text-[12px] font-black text-primary tracking-[0.03em] shadow-sm">
                                        {b}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full bg-slate-50/50 dark:bg-transparent rounded-2xl p-2 border border-slate-100 dark:border-transparent">
                            <AuthFlow />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}