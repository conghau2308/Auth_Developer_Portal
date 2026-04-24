interface PageHeadProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function PageHead({ title, description, action }: PageHeadProps) {
    return (
        <div
            className="mb-7 pb-5 flex items-start justify-between"
            style={{ borderBottom: "1px solid var(--ol-border)" }}
        >
            <div>
                <h1
                    className="text-[22px] font-bold tracking-[-0.4px]"
                    style={{ fontFamily: "'Syne', sans-serif", color: "var(--kw-text-strong)" }}
                >
                    {title}
                </h1>
                {description && (
                    <p className="text-[13px] mt-1" style={{ color: "var(--ol-muted)" }}>
                        {description}
                    </p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}