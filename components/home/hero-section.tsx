import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, ScanFace } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            <div className="absolute inset-0 biometric-pulse pointer-events-none opacity-50" />

            <div className="max-w-screen-2xl mx-auto px-8 relative z-10 grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-medium tracking-wider text-primary">
                        <ShieldCheck size={16} />
                        ENCRYPTED END-TO-END
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-foreground">
                        Your Face is <br />
                        <span className="text-primary">The Ultimate Key.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                        Eliminate passwords forever. The Obsidian Lens provides ultra-secure
                        biometric OAuth authentication that feels like magic and works in
                        milliseconds.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Button className="px-8 py-6 rounded-xl primary-gradient text-primary-foreground font-bold text-lg active:scale-95 transition-all flex items-center gap-2 border-0 hover:opacity-90">
                            Get Started
                            <ArrowRight size={20} />
                        </Button>
                        <Button
                            variant="outline"
                            className="px-8 py-6 rounded-xl glass-panel text-foreground font-bold text-lg active:scale-95 transition-all border-border hover:bg-muted hover:text-foreground"
                        >
                            View Docs
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <div className="relative w-full aspect-square max-w-lg mx-auto">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                        <div className="relative h-full w-full rounded-[3rem] bg-card border border-border overflow-hidden shadow-2xl">
                            <img
                                className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                                alt="Futuristic interface"
                                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-32 h-32 rounded-full border-2 border-primary/50 flex items-center justify-center mb-6 relative">
                                    <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-40" />
                                    <ScanFace size={64} className="text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-primary font-bold text-xl uppercase tracking-widest">
                                        Scanning...
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Validating Neural Biometrics
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}