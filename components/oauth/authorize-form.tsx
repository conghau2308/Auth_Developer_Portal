"use client";

import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AtSign } from "lucide-react";
import { BiometricScanner } from "../layout/biometric-scanner";

export function AuthorizeForm() {
    const [biometricDone, setBiometricDone] = useState(false);

    const handleBiometricSuccess = useCallback(() => {
        setBiometricDone(true);
    }, []);

    return (
        <div className="bg-card rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="space-y-10">
                {/* Username */}
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        Identity Identifier
                    </Label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Enter your username"
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary rounded-xl py-6 pr-12"
                        />
                        <AtSign
                            size={16}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Biometric scanner */}
                <BiometricScanner onSuccess={handleBiometricSuccess} />

                {/* Actions */}
                <div className="flex flex-col gap-4">
                    <Button
                        disabled={!biometricDone}
                        className="w-full py-6 rounded-xl primary-gradient text-primary-foreground font-bold text-lg active:scale-95 transition-all shadow-[0_10px_30px_hsl(var(--primary)/0.3)] border-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        Authorize Access
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full py-5 rounded-xl text-muted-foreground font-semibold hover:bg-muted/50 hover:text-foreground transition-colors"
                    >
                        Cancel Request
                    </Button>
                </div>
            </div>
        </div>
    );
}