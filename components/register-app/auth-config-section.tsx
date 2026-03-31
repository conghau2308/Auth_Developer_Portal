"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFieldArray, type Control } from "react-hook-form";
import type { RegisterAppFormData } from "./schema";
import SectionHeading from "../ui/section-heading";

interface AuthConfigSectionProps {
    control: Control<RegisterAppFormData>;
}

/**
 * AuthConfigSection
 *
 * Section 3 — dynamic redirect URI list (add/remove rows)
 * and a single post-logout redirect URI field.
 *
 * Uses react-hook-form's `useFieldArray` to manage
 * the dynamic URI list without manual state.
 */
export default function AuthConfigSection({ control }: AuthConfigSectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "redirectUris",
    });

    return (
        <div className="rounded-xl border border-border/10 bg-card p-8">
            <SectionHeading className="mb-8">Authentication Configuration</SectionHeading>

            <div className="space-y-8">
                {/* Redirect URIs */}
                <div className="space-y-3">
                    <div className="flex items-end justify-between">
                        <Label className="text-sm font-semibold text-secondary-foreground">
                            Redirect URIs
                        </Label>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto gap-1 p-0 text-xs font-bold text-primary hover:text-primary/80 hover:bg-transparent"
                            onClick={() => append({ value: "" })}
                        >
                            <Plus size={14} />
                            Add URI
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="group relative">
                                <Input
                                    type="url"
                                    placeholder="https://example.com/oauth/callback"
                                    defaultValue={field.value}
                                    {...control.register(`redirectUris.${index}.value`)}
                                    className="bg-background border-border text-foreground pr-12 focus-visible:ring-primary rounded-lg p-4"
                                />
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                                        aria-label={`Remove URI ${index + 1}`}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                        The OAuth flow will redirect the user to these URLs after successful authentication.
                    </p>
                </div>

                {/* Post-logout URI */}
                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-secondary-foreground">
                        Post-logout Redirect URI
                    </Label>
                    <Input
                        type="url"
                        placeholder="https://example.com/logout-success"
                        {...control.register("postLogoutUri")}
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground/30 focus-visible:ring-primary rounded-lg p-4"
                    />
                </div>
            </div>
        </div>
    );
}