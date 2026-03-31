"use client";

import { Globe, LayoutDashboard, Smartphone, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UseFormRegister, UseFormWatch } from "react-hook-form";
import type { RegisterAppFormData } from "./schema";
import SectionHeading from "../ui/section-heading";

// ─── Config ───────────────────────────────────────────────────────────────────

const CLIENT_TYPES = [
    { value: "web", label: "Web App", Icon: Globe },
    { value: "spa", label: "SPA", Icon: LayoutDashboard },
    { value: "mobile", label: "Mobile App", Icon: Smartphone },
    { value: "server", label: "Server", Icon: Server },
] as const;

export type ClientType = (typeof CLIENT_TYPES)[number]["value"];

// ─── Props ────────────────────────────────────────────────────────────────────

interface ClientTypeSelectorProps {
    register: UseFormRegister<RegisterAppFormData>;
    watch: UseFormWatch<RegisterAppFormData>;
}

/**
 * ClientTypeSelector
 *
 * Section 2 — four radio-card options for the OAuth client type.
 * The selected card highlights with a primary ring + icon tint.
 */
export default function ClientTypeSelector({ register, watch }: ClientTypeSelectorProps) {
    const selected = watch("clientType");

    return (
        <div className="space-y-6">
            <SectionHeading>Client Type</SectionHeading>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {CLIENT_TYPES.map(({ value, label, Icon }) => {
                    const isActive = selected === value;

                    return (
                        <label
                            key={value}
                            className={cn(
                                "relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border p-6 transition-all duration-200",
                                isActive
                                    ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,218,243,0.1)]"
                                    : "border-border/15 bg-card hover:bg-muted/40"
                            )}
                        >
                            <input
                                type="radio"
                                value={value}
                                className="sr-only"
                                {...register("clientType")}
                            />
                            <Icon
                                size={28}
                                className={cn(
                                    "transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}
                            />
                            <span
                                className={cn(
                                    "text-sm font-bold transition-colors",
                                    isActive ? "text-primary" : "text-foreground"
                                )}
                            >
                                {label}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}