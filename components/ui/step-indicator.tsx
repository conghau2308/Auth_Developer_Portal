interface StepIndicatorProps {
    current: number;
    total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex flex-col">
                <h2 className="text-foreground font-bold text-lg">
                    Step {current} of {total}
                </h2>
            </div>
            <div className="flex gap-1.5">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 w-8 rounded-full transition-colors ${i < current ? "bg-primary" : "bg-muted"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}