"use client";

export function HeroSection() {
    return (
        <section className="max-w-screen-xl mx-auto px-6 md:px-8 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* ── Left: Copy ── */}
            <div className="space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase border border-primary/20">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Now available in General Availability
                </div>

                {/* Heading */}
                <h1 className="text-[40px] md:text-[52px] font-black tracking-[-0.02em] leading-[1.2] text-strong">
                    The Future of Auth is You.
                </h1>

                {/* Body */}
                <p className="text-[18px] text-body dark:text-muted-foreground leading-relaxed font-medium max-w-lg">
                    Eliminate passwords forever. Deploy military-grade biometric authentication to your app
                    in minutes with our drop-in SDK. Secure, seamless, and lightning fast.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                    <button className="btn-brand-gradient text-white px-8 py-3 rounded-lg font-bold text-[14px] tracking-wide transition-all duration-200 active:scale-95">
                        Try Demo
                    </button>
                    <button className="bg-transparent border-2 border-primary text-primary px-8 py-3 rounded-lg font-bold text-[14px] hover:bg-primary/5 transition-all duration-200 active:scale-95">
                        Read Docs
                    </button>
                </div>
            </div>

            {/* ── Right: Glass visual card ── */}
            <div className="relative flex justify-center items-center">
                {/* Decorative blobs */}
                <div
                    className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: "4s" }}
                />
                <div className="absolute w-64 h-64 bg-[var(--kw-brand-soft)] rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

                {/* Glass panel */}
                <div className="relative z-10 glass-panel p-4 rounded-2xl w-full max-w-md aspect-square flex items-center justify-center border-t border-white/80 shadow-2xl overflow-hidden">

                    {/* Hero image */}
                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvqiafYBD7t9FpiH3nX_A8ROpwqxoH01Gp-C1sNyJjD2qoU_SbdEFaaWawRYyTAms5wHrZTay1wXUW4g-UCbt0Gm-VQC9i-vYLSLMU02Rtk8geqp_O_S5gvJwTR_1uXG_0GGIe0VOHYxr4lBO-NvlAgjEJOywHV649aRWKwdeDjwu6G6NiwUQP2gMZNlY92lLDX25r7HQ_oQtrNrqH3LWSGcaGWa4jnTc3wwQyT3NvGXi3RR7Eo7RSWCvFbLior8w-84es7P5LVgc"
                            alt="Abstract representation of biometric scanning with glowing digital mesh over a face profile in deep indigo tones"
                            className="w-full h-full object-cover opacity-90 mix-blend-luminosity"
                        />

                        {/* Scan line */}
                        <div className="absolute left-0 right-0 h-0.5 bg-primary/80 shadow-[0_0_15px_rgba(79,70,229,0.8)] animate-[scanFace_2s_ease-in-out_infinite]" />
                    </div>

                    {/* Border overlay */}
                    <div className="absolute inset-0 border-2 border-primary/20 rounded-2xl pointer-events-none" />

                    {/* Match found floating badge */}
                    <div className="absolute bottom-6 bg-white/90 dark:bg-card/90 backdrop-blur-md px-4 py-2 rounded-lg border border-[var(--kw-border)] flex items-center gap-3 shadow-lg">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary fill-current shrink-0">
                            <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
                        </svg>
                        <span className="text-[13px] font-bold text-strong">
                            Match Found{" "}
                            <span className="text-body dark:text-muted-foreground font-normal">0.4s</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}