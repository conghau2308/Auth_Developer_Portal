"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, AtSign, CheckCircle2, Fingerprint, Loader2, Lock, Mail, User, XCircle } from "lucide-react";
import type { Step1Data } from "./useSignUpForm";
import { useCheckUsername } from "@/hooks/use-register";
import { useCallback, useRef, useState } from "react";

const schema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers and underscores"),
    email: z.string().email("Enter a valid email address"),
});

interface RegisterFormProps {
    defaultValues?: Step1Data;
    onNext: (data: Step1Data) => void;
}

type UsernameStatus = "idle" | "checking" | "available" | "taken";

export function RegisterForm({ defaultValues, onNext }: RegisterFormProps) {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<Step1Data>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues ?? undefined,
    });

    const { mutate: checkUsername } = useCheckUsername();
    const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Giữ lại username đã check để tránh gọi lại khi value không đổi
    const lastCheckedRef = useRef<string>("");

    const handleUsernameChange = useCallback((value: string) => {
        // Reset nếu không đủ điều kiện format
        if (value.length < 3 || !/^[a-z0-9_]+$/.test(value)) {
            setUsernameStatus("idle");
            lastCheckedRef.current = "";
            return;
        }

        // Không gọi lại nếu value không đổi
        if (value === lastCheckedRef.current) return;

        // Debounce 600ms — chỉ gọi API sau khi user ngừng gõ
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setUsernameStatus("checking");

        debounceRef.current = setTimeout(() => {
            lastCheckedRef.current = value;
            checkUsername(value, {
                onSuccess: (isAvailable) => {
                    console.log("available", isAvailable);
                    setUsernameStatus(isAvailable.available ? "available" : "taken");
                },
                onError: () => {
                    setUsernameStatus("idle");
                },
            });
        }, 600);
    }, [checkUsername]);

    const handleSubmitWithCheck = (data: Step1Data) => {
        if (usernameStatus === "taken") return;
        onNext(data);
    };

    const usernameStatusIcon = {
        idle: null,
        checking: <Loader2 size={14} className="animate-spin text-muted-foreground" />,
        available: <CheckCircle2 size={14} className="text-emerald-500" />,
        taken: <XCircle size={14} className="text-destructive" />,
    }[usernameStatus];

    return (
        <div className="bg-card rounded-xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
                <Fingerprint size={144} className="text-foreground" />
            </div>

            <div className="relative z-10">
                <header className="mb-10">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
                        Create Identity
                    </h1>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                        Initialize your secure profile before proceeding to biometric enrollment.
                    </p>
                </header>

                <form onSubmit={handleSubmit(handleSubmitWithCheck)} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-secondary-foreground ml-1">
                            Full Name
                        </Label>
                        <div className="relative">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                {...register("fullName")}
                                type="text"
                                placeholder="E.g. Alexander Sterling"
                                className="pl-11 py-6 bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary rounded-lg"
                                aria-invalid={!!errors.fullName}
                            />
                        </div>
                        {errors.fullName && <p className="text-xs text-destructive ml-1">{errors.fullName.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-secondary-foreground ml-1">
                            Username
                        </Label>
                        <p className="text-[10px] text-muted-foreground ml-1">
                            Chỉ gồm chữ thường, số và dấu gạch dưới
                        </p>
                        <div className="relative">
                            <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                {...register("username", {
                                    onChange: (e) => handleUsernameChange(e.target.value),
                                })}
                                type="text"
                                placeholder="sterling_obsidian"
                                className="pl-11 pr-10 py-6 bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary rounded-lg"
                                aria-invalid={!!errors.username || usernameStatus === "taken"}
                            />
                            {usernameStatusIcon && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {usernameStatusIcon}
                                </div>
                            )}
                        </div>
                        <div className="min-h-[18px] ml-1">
                            {errors.username && (
                                <p className="text-xs text-destructive">{errors.username.message}</p>
                            )}
                            {!errors.username && usernameStatus === "taken" && (
                                <p className="text-xs text-destructive">Username đã được sử dụng</p>
                            )}
                            {!errors.username && usernameStatus === "available" && (
                                <p className="text-xs text-emerald-500">Username có thể sử dụng</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase tracking-widest text-secondary-foreground ml-1">
                            Email Address
                        </Label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                {...register("email")}
                                type="email"
                                placeholder="alex@quantum.secure"
                                className="pl-11 py-6 bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary rounded-lg"
                                aria-invalid={!!errors.email}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-destructive ml-1">{errors.email.message}</p>}
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={usernameStatus === "taken" || usernameStatus === "checking"}
                            className="w-full py-6 rounded-xl btn-brand-gradient text-primary-foreground font-bold text-sm tracking-wide shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all duration-200 flex items-center justify-center gap-3 border-0"
                        >
                            Next: Face Enrollment <ArrowRight size={18} />
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-3 bg-muted/20">
                        <Lock size={20} className="text-primary shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-foreground">
                                End-to-End Encrypted
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                                Data is hashed before storage
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}