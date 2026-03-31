"use client";

import { cn } from "@/lib/utils";
import type { UseFormRegister, UseFormWatch } from "react-hook-form";
import type { RegisterAppFormData } from "./schema";
import SectionHeading from "../ui/section-heading";

// ─── Config ───────────────────────────────────────────────────────────────────

const SCOPES = [
    {
        id: "openid",
        label: "openid",
        description: "Required for OpenID Connect flows.",
        premium: false,
    },
    {
        id: "profile",
        label: "profile",
        description: "Access to user's name and avatar.",
        premium: false,
    },
    {
        id: "email",
        label: "email",
        description: "Access to user's primary email address.",
        premium: false,
    },
    {
        id: "face_data_access",
        label: "face_data_access",
        description: "Premium: Biometric metadata verification.",
        premium: true,
    },
] as const;

type ScopeId = (typeof SCOPES)[number]["id"];

// ─── Props ────────────────────────────────────────────────────────────────────

interface ScopesSectionProps {
    register: UseFormRegister<RegisterAppFormData>;
    watch: UseFormWatch<RegisterAppFormData>;
}

/**
 * ScopesSection
 *
 * Section 4 — bento-style 2×2 grid of permission checkboxes.
 * The premium `face_data_access` scope renders with a
 * primary tint to signal its elevated status.
 */
export default function ScopesSection({ register, watch }: ScopesSectionProps) {
    const selected: ScopeId[] = watch("scopes") ?? [];

    return (
        <div className="space-y-6">
            <SectionHeading>Scopes &amp; Permissions</SectionHeading>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {SCOPES.map(({ id, label, description, premium }) => {
                    const isChecked = selected.includes(id);

                    return (
                        <label
                            key={id}
                            htmlFor={`scope-${id}`}
                            className={cn(
                                "flex cursor-pointer items-start gap-4 rounded-xl border p-5 transition-colors",
                                premium
                                    ? "border-primary/20 bg-primary/5 hover:bg-primary/10"
                                    : "border-border/10 bg-card hover:bg-muted/40"
                            )}
                        >
                            <div className="mt-0.5">
                                <input
                                    id={`scope-${id}`}
                                    type="checkbox"
                                    value={id}
                                    className={cn(
                                        "h-5 w-5 rounded border-border bg-background",
                                        "text-primary focus:ring-primary focus:ring-offset-background",
                                        "cursor-pointer"
                                    )}
                                    {...register("scopes")}
                                />
                            </div>
                            <div>
                                <p
                                    className={cn(
                                        "mb-1 font-bold leading-none",
                                        premium ? "text-primary" : isChecked ? "text-foreground" : "text-foreground"
                                    )}
                                >
                                    {label}
                                </p>
                                <p className={cn("text-xs", premium ? "text-primary/70" : "text-muted-foreground")}>
                                    {description}
                                </p>
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}