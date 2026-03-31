import { Button } from "@/components/ui/button";
import { CheckCircle2, Rocket } from "lucide-react";
import Link from "next/link";

export function DeveloperCTA() {
    return (
        <section className="py-24 relative bg-background">
            <div className="max-w-4xl mx-auto px-8">
                <div className="p-px rounded-[2.5rem] bg-gradient-to-b from-primary/30 to-transparent">
                    <div className="bg-background rounded-[2.4rem] p-12 text-center space-y-8">
                        <div className="max-w-2xl mx-auto space-y-10">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-[0.2em] text-primary uppercase mx-auto">
                                    Developer First SDK
                                </div>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                                    Integrate{" "}
                                    <span className="text-primary">FaceID OAuth</span>
                                </h2>
                                <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto">
                                    Supercharge your app's security with lightning-fast biometric
                                    authentication. Zero passwords, zero friction, and maximum
                                    conversion for your users.
                                </p>
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                <Link href="/register-application">
                                    <Button className="px-10 py-8 primary-gradient text-primary-foreground font-extrabold rounded-xl text-xl hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all active:scale-95 group flex items-center gap-3 border-0">
                                        Become a Client
                                        <Rocket className="group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <div className="flex items-center gap-8 text-muted-foreground/60">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} />
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            5-Min Setup
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} />
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            No Credit Card
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em]">
                                By joining, you agree to our Developer Terms and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}