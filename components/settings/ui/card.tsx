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
                background: "var(--ol-bg2)",
                border: danger
                    ? "1px solid rgba(255,77,77,0.25)"
                    : "1px solid var(--ol-border)",
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
                    ? "1px solid rgba(255,77,77,0.15)"
                    : "1px solid var(--ol-border)",
            }}
        >
            <div>
                <h3
                    className="text-sm font-semibold"
                    style={{
                        fontFamily: "'Syne', sans-serif",
                        color: danger ? "var(--ol-danger)" : "var(--ol-text, #e8e8ed)",
                    }}
                >
                    {title}
                </h3>
                {description && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--ol-muted)" }}>
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
                background: "var(--ol-bg3)",
                borderTop: "1px solid var(--ol-border)",
            }}
        >
            <p className="text-xs" style={{ color: "var(--ol-muted)" }}>
                {note ?? ""}
            </p>
            {children}
        </div>
    );
}