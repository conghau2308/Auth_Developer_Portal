import { cn } from "@/lib/utils";
import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;
type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

// ── FormRow wrapper ───────────────────────────────────────────────
interface FormRowProps {
    label?: string;
    required?: boolean;
    hint?: string;
    children: React.ReactNode;
    className?: string;
}

export function Input({ className, ...props }: InputProps) {
    return (
        <input
            className={cn(
                "w-full rounded-[7px] px-3 py-2 text-[13.5px] outline-none transition-[border-color] duration-150",
                "focus:shadow-[0_0_0_3px_var(--kw-brand-glow)]",
                className
            )}
            style={{
                background: "var(--ol-bg3)",
                border: "2px solid var(--kw-border)",
                color: props.readOnly ? "var(--kw-muted)" : "var(--kw-text-strong)",
                fontFamily: "'DM Sans', sans-serif",
            }}
            {...props}
        />
    );
}

export function Textarea({ className, ...props }: TextareaProps) {
    return (
        <textarea
            className={cn(
                "w-full rounded-[7px] px-3 py-2 text-[13.5px] outline-none transition-[border-color] resize-y min-h-[80px]",
                "focus:shadow-[0_0_0_3px_var(--kw-brand-glow)]",
                className
            )}
            style={{
                background: "var(--ol-bg3)",
                border: "1px solid var(--ol-border)",
                color: "var(--kw-text-strong)",
                fontFamily: "'DM Sans', sans-serif",
            }}
            {...props}
        />
    );
}

export function Select({ className, children, ...props }: SelectProps) {
    return (
        <select
            className={cn("w-full rounded-[7px] px-3 py-2 text-[13.5px] outline-none", className)}
            style={{
                background: "var(--ol-bg3)",
                border: "1px solid var(--ol-border)",
                color: "var(--kw-text-strong)",
                fontFamily: "'DM Sans', sans-serif",
            }}
            {...props}
        >
            {children}
        </select>
    );
}

export function FormRow({ label, required, hint, children, className }: FormRowProps) {
    return (
        <div className={cn("mb-[18px] last:mb-0", className)}>
            {label && (
                <label
                    className="block text-[12.5px] font-medium mb-1.5"
                    style={{ color: "var(--kw-text-strong)" }}
                >
                    {label}
                    {required && (
                        <span className="ml-1" style={{ color: "var(--ol-danger)" }}>
                            *
                        </span>
                    )}
                </label>
            )}
            {children}
            {hint && (
                <p className="text-[11.5px] mt-[5px]" style={{ color: "var(--ol-muted)" }}>
                    {hint}
                </p>
            )}
        </div>
    );
}

// ── FormGrid ──────────────────────────────────────────────────────
export function FormGrid({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-2 gap-4">{children}</div>
    );
}