import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * SectionHeading
 * Left accent bar + bold headline — used across all form sections.
 */
export default function SectionHeading({ children, className }: SectionHeadingProps) {
    return (
        <h2 className={cn("flex items-center gap-3 font-headline text-2xl font-bold text-foreground", className)}>
            <span className="h-6 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            {children}
        </h2>
    );
}