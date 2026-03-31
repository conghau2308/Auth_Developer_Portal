"use client";

import { Fingerprint, History, LifeBuoy } from "lucide-react";

const tabs = [
    { icon: Fingerprint, label: "Authorize", active: true },
    { icon: History, label: "History", active: false },
    { icon: LifeBuoy, label: "Support", active: false },
];

export function MobileNavBar() {
    return (
        <>
            <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center p-4 pb-8 bg-background/80 backdrop-blur-xl border-t border-border shadow-[0_-4px_40px_rgba(0,0,0,0.5)] z-50 rounded-t-3xl">
                {tabs.map(({ icon: Icon, label, active }) => (
                    <button
                        key={label}
                        className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 transition-colors ${active
                                ? "bg-primary/10 text-primary shadow-[0_0_15px_hsl(var(--primary)/0.2)]"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <Icon size={22} />
                        <span className="text-xs uppercase tracking-widest mt-1">{label}</span>
                    </button>
                ))}
            </nav>
            {/* spacer so content isn't hidden behind nav */}
            <div className="md:hidden h-24" />
        </>
    );
}