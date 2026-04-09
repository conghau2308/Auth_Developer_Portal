import { AppStats } from "@/types/common.types";
import { Card, CardBody, CardHead } from "../ui/card";


interface StatTileProps {
    value: number;
    label: string;
    color: string;
}

function StatTile({ value, label, color }: StatTileProps) {
    return (
        <div
            className="text-center p-4 rounded-lg"
            style={{
                background: "var(--ol-bg3)",
                border: "1px solid var(--ol-border)",
            }}
        >
            <div
                className="text-[28px] font-extrabold"
                style={{ fontFamily: "'Syne', sans-serif", color }}
            >
                {value}
            </div>
            <div className="text-[12px] mt-1" style={{ color: "var(--ol-muted)" }}>
                {label}
            </div>
        </div>
    );
}

interface StatsCardProps {
    stats: AppStats;
}

export function StatsCard({ stats }: StatsCardProps) {
    return (
        <Card>
            <CardHead title="Thống kê" />
            <CardBody>
                <div className="grid grid-cols-3 gap-4">
                    <StatTile
                        value={stats.activeUsers}
                        label="Active users"
                        color="var(--ol-accent2)"
                    />
                    <StatTile
                        value={stats.tokenExchanges}
                        label="Token exchanges"
                        color="var(--ol-success)"
                    />
                    <StatTile
                        value={stats.activeSecrets}
                        label="Active secrets"
                        color="var(--ol-warn)"
                    />
                </div>
            </CardBody>
        </Card>
    );
}