"use client";

import { Settings2, ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { RegisterAppFormData } from "./schema";
import SectionHeading from "../ui/section-heading";

interface AppDetailsSectionProps {
    register: UseFormRegister<RegisterAppFormData>;
    errors: FieldErrors<RegisterAppFormData>;
}

/**
 * AppDetailsSection
 *
 * Section 1 — icon upload dropzone, application name, description.
 * Receives react-hook-form register/errors from parent form.
 */
export default function AppDetailsSection({ register, errors }: AppDetailsSectionProps) {
    return (
        <div className="relative overflow-hidden rounded-xl border border-border/10 bg-muted/20 p-8 shadow-2xl backdrop-blur-sm">
            {/* Decorative icon */}
            <div className="pointer-events-none absolute right-0 top-0 p-8 opacity-5" aria-hidden>
                <Settings2 size={96} className="text-foreground" />
            </div>

            <SectionHeading className="mb-8">Application Details</SectionHeading>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Icon upload */}
                <div className="md:col-span-1">
                    <Label className="mb-4 block text-sm font-semibold text-muted-foreground">
                        Client Icon
                    </Label>
                    <label
                        htmlFor="icon-upload"
                        className="
              group flex h-32 w-32 cursor-pointer flex-col
              items-center justify-center gap-2 rounded-xl
              border-2 border-dashed border-border
              bg-background transition-colors
              hover:border-primary
            "
                    >
                        <ImagePlus size={28} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                            Upload SVG
                        </span>
                        <input
                            id="icon-upload"
                            type="file"
                            accept=".svg,image/*"
                            className="sr-only"
                            aria-label="Upload client icon"
                        />
                    </label>
                </div>

                {/* Name + description */}
                <div className="space-y-6 md:col-span-2">
                    <div className="space-y-2">
                        <Label htmlFor="app-name" className="text-sm font-semibold text-secondary-foreground">
                            Application Name
                        </Label>
                        <Input
                            id="app-name"
                            type="text"
                            placeholder="e.g. Obsidian Dashboard"
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary rounded-lg p-4"
                            aria-invalid={!!errors.appName}
                            {...register("appName")}
                        />
                        {errors.appName && (
                            <p className="text-xs text-destructive">{errors.appName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="app-desc" className="text-sm font-semibold text-secondary-foreground">
                            Description
                        </Label>
                        <Textarea
                            id="app-desc"
                            placeholder="Briefly describe the purpose of this application..."
                            rows={3}
                            className="resize-none bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary rounded-lg p-4"
                            {...register("description")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}