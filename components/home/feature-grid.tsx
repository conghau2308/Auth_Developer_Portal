import { Fingerprint, ShieldCheck, Zap } from "lucide-react";

export function FeatureGrid() {
    return (
        <section className="py-24 bg-card">
            <div className="max-w-screen-2xl mx-auto px-8">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-foreground">
                        Engineered for{" "}
                        <span className="text-primary">Absolute Trust.</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        We don't just secure accounts; we redefine the perimeter of digital
                        identity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 p-10 rounded-[2rem] bg-muted border border-border relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8">
                            <Fingerprint size={40} className="text-primary" />
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-end">
                            <h3 className="text-2xl font-bold mb-3 text-foreground">
                                Liveness Detection 2.0
                            </h3>
                            <p className="text-muted-foreground max-w-md">
                                Our proprietary algorithms prevent spoofing from
                                high-resolution photos, videos, or 3D masks with 99.9%
                                accuracy.
                            </p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                    </div>

                    <div className="p-10 rounded-[2rem] bg-background border border-border flex flex-col justify-between">
                        <ShieldCheck size={40} className="text-primary" />
                        <div className="mt-12">
                            <h3 className="text-xl font-bold mb-2 text-foreground">
                                Zero-Knowledge
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                We never store biometric data. Hashes are generated locally and
                                encrypted before transmission.
                            </p>
                        </div>
                    </div>

                    <div className="p-10 rounded-[2rem] bg-card border border-border flex flex-col justify-between">
                        <Zap size={40} className="text-primary" />
                        <div className="mt-12">
                            <h3 className="text-xl font-bold mb-2 text-foreground">
                                Sub-Second Auth
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                Authenticate users in under 400ms. Faster than a password,
                                safer than a physical key.
                            </p>
                        </div>
                    </div>

                    <div className="md:col-span-2 p-10 rounded-[2rem] bg-background border border-border relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-1/2">
                            <h3 className="text-2xl font-bold mb-3 text-foreground">
                                Global Compliance
                            </h3>
                            <p className="text-muted-foreground">
                                Fully GDPR, CCPA, and SOC2 compliant biometric handling out of
                                the box.
                            </p>
                        </div>
                        <div className="w-full md:w-1/2 h-48 rounded-2xl overflow-hidden border border-border">
                            <img
                                className="w-full h-full object-cover opacity-50"
                                alt="Server room"
                                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}