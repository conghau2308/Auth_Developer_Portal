import { cn } from "@/lib/utils";

// ── Card root ──────────────────────────────────────────────────────
interface CardProps {
    children: React.ReactNode;
    className?: string;
    danger?: boolean;
}

export function Card({ children, className, danger }: CardProps) {
    return (
        <div
            className={cn("rounded-[10px] overflow-hidden mb-4", className)}
            style={{
                background: "var(--kw-bg2)",
                border: danger
                    ? "1px solid var(--kw-danger-border)"
                    : "1px solid var(--kw-border)",
            }}
        >
            {children}
        </div>
    );
}

// ── Card.Head ─────────────────────────────────────────────────────
interface CardHeadProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    danger?: boolean;
}

export function CardHead({ title, description, action, danger }: CardHeadProps) {
    return (
        <div
            className="flex items-center justify-between px-5 py-4"
            style={{
                borderBottom: danger
                    ? "1px solid var(--kw-danger-border-soft)"
                    : "1px solid var(--kw-border)",
            }}
        >
            <div>
                <h3
                    className="text-sm font-semibold"
                    style={{
                        fontFamily: "'Syne', sans-serif",
                        color: danger ? "var(--kw-danger)" : "var(--kw-text-strong)",
                    }}
                >
                    {title}
                </h3>
                {description && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--kw-muted)" }}>
                        {description}
                    </p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

// ── Card.Body ─────────────────────────────────────────────────────
export function CardBody({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={cn("p-5", className)}>{children}</div>;
}

// ── Card.Footer ───────────────────────────────────────────────────
export function CardFooter({
    note,
    children,
}: {
    note?: string;
    children?: React.ReactNode;
}) {
    return (
        <div
            className="flex items-center justify-between px-5 py-3"
            style={{
                background: "var(--kw-bg3)",
                borderTop: "1px solid var(--kw-border)",
            }}
        >
            <p className="text-xs" style={{ color: "var(--kw-muted)" }}>
                {note ?? ""}
            </p>
            {children}
        </div>
    );
}