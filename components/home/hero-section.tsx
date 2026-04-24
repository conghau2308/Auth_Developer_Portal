import { ArrowRight } from "lucide-react";
import Link from "next/link";

function FaceScanOrb() {
    const corners = [
        "top-[40px] left-[40px] border-t-[1.5px] border-l-[1.5px]",
        "top-[40px] right-[40px] border-t-[1.5px] border-r-[1.5px]",
        "bottom-[40px] left-[40px] border-b-[1.5px] border-l-[1.5px]",
        "bottom-[40px] right-[40px] border-b-[1.5px] border-r-[1.5px]",
    ];

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-[220px] h-[220px]">
                {/* Rings */}
                <div className="absolute inset-0 rounded-full border border-primary/18" />
                <div className="absolute inset-4 rounded-full border border-primary/18" />
                <div className="absolute inset-[28px] rounded-full border border-dashed border-primary/22 animate-[spin_14s_linear_infinite]" />
                <div className="absolute inset-[10px] rounded-full border border-dashed border-violet-400/18 animate-[spin_9s_linear_infinite_reverse] opacity-60" />

                {/* Corner brackets */}
                {corners.map((cls, i) => (
                    <div key={i} className={`absolute w-3.5 h-3.5 border-primary/55 ${cls}`} />
                ))}

                {/* Core */}
                <div className="absolute inset-[52px] rounded-full border border-primary/28 bg-gradient-to-br from-primary/13 to-primary/6 overflow-hidden">
                    {/* Scan line */}
                    <div className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary to-violet-400 animate-[scanFace_2.6s_ease-in-out_infinite]" />

                    {/* Face SVG */}
                    <svg
                        viewBox="0 0 80 80"
                        fill="none"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68px] h-[68px]"
                    >
                        <ellipse cx="40" cy="30" rx="13" ry="14" stroke="rgba(99,102,241,0.65)" strokeWidth="1.2" />
                        <path d="M27 52c3-6 23-6 26 0" stroke="rgba(99,102,241,0.5)" strokeWidth="1.2" strokeLinecap="round" />
                        <circle cx="35" cy="29" r="2.2" fill="rgba(99,102,241,0.85)" />
                        <circle cx="45" cy="29" r="2.2" fill="rgba(99,102,241,0.85)" />
                        <path d="M37 35c1.2.9 3.8.9 6 0" stroke="rgba(99,102,241,0.5)" strokeWidth="1.2" strokeLinecap="round" />
                        {/* Side measurement lines */}
                        <line x1="22" y1="30" x2="27" y2="30" stroke="rgba(99,102,241,0.35)" strokeWidth="1" />
                        <line x1="53" y1="30" x2="58" y2="30" stroke="rgba(99,102,241,0.35)" strokeWidth="1" />
                        <line x1="30" y1="18" x2="33" y2="21" stroke="rgba(99,102,241,0.25)" strokeWidth="1" />
                        <line x1="50" y1="18" x2="47" y2="21" stroke="rgba(99,102,241,0.25)" strokeWidth="1" />
                    </svg>
                </div>
            </div>

            {/* Status dots */}
            <div className="flex gap-1.5">
                {[0, 300, 600].map((delay) => (
                    <div
                        key={delay}
                        className="w-1.5 h-1.5 rounded-full bg-primary animate-[dotPulse_1.8s_ease-in-out_infinite]"
                        style={{ animationDelay: `${delay}ms` }}
                    />
                ))}
            </div>
            <p className="text-[11px] tracking-widest uppercase text-muted-foreground">Scanning</p>
        </div>
    );
}

export function HeroSection() {
    return (
        <section className="relative flex flex-col items-center text-center pt-36 pb-28 px-6 overflow-hidden">

            {/* Background grid — Đã đổi từ cyan-soft sang brand-soft */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: [
                        "linear-gradient(var(--kw-brand-soft) 1px, transparent 1px)",
                        "linear-gradient(90deg, var(--kw-brand-soft) 1px, transparent 1px)",
                    ].join(", "),
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Glow blob - Tăng độ tương phản một chút để nổi bật nền màu Indigo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[680px] h-[480px] rounded-full bg-primary/15 dark:bg-primary/10 blur-[120px] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">

                {/* Status badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-8 rounded-full border border-primary/25 bg-primary/10 text-[12px] font-bold text-primary tracking-[0.04em] shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--kw-brand)]" />
                    Face-native OAuth · Now in GA
                </div>

                {/* Headline — Dùng text-strong và Gradient Text */}
                <h1 className="text-5xl md:text-[68px] font-black leading-[1.06] tracking-[-0.03em] text-strong mb-6">
                    Identity that<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--kw-text-strong)] via-[var(--kw-brand)] to-[var(--kw-brand-light)] drop-shadow-sm">sees you.</span>
                </h1>

                {/* Sub-headline — Dùng text-body để sắc nét hơn ở Light Mode */}
                <p className="text-base md:text-lg text-body dark:text-muted-foreground max-w-[440px] leading-relaxed font-medium mb-10">
                    Drop-in biometric OAuth for your app — no passwords, no friction.
                    One face scan replaces every credential.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                    <Link href="/sign-up">
                        {/* Đã đổi btn-cyan-gradient sang btn-brand-gradient */}
                        <button className="btn-brand-gradient inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] active:scale-95 transition-all">
                            Start for free
                            <ArrowRight size={16} />
                        </button>
                    </Link>
                    <Link href="/docs">
                        {/* Cập nhật style nút Docs trông "SaaS" hơn */}
                        <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-bold text-strong bg-white dark:bg-card border border-slate-200 dark:border-border shadow-sm hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-muted/50 transition-all active:scale-95">
                            View docs
                            <ArrowRight size={15} className="opacity-60" />
                        </button>
                    </Link>
                </div>

                {/* Animated face scan */}
                <FaceScanOrb />

                {/* Scan status */}
                <p className="mt-5 text-[12px] font-bold text-primary tracking-[0.1em] uppercase drop-shadow-sm">
                    Biometric verified · 312ms
                </p>

                {/* Trust row — Đậm nét và rõ ràng hơn */}
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-10 text-[13px] text-body dark:text-muted-foreground/80 font-bold">
                    {["SOC 2 Type II", "GDPR compliant", "Zero biometric storage", "99.97% uptime SLA"].map((item, i, arr) => (
                        <div key={item} className="flex items-center gap-5">
                            <span>{item}</span>
                            {i < arr.length - 1 && (
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-border inline-block" />
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}