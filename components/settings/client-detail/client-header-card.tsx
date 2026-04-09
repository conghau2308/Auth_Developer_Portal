"use client";

import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RoleBadge } from "./role-badge";
import { ClientCredentialsResponseDto } from "@/types/api.types";

interface ClientHeaderCardProps {
    app: ClientCredentialsResponseDto;
}

export function ClientHeaderCard({ app }: ClientHeaderCardProps) {

    return (
        <div
            className="flex items-center gap-5 p-6 rounded-[10px] mb-4"
            style={{
                background: "var(--ol-bg2)",
                border: "1px solid var(--ol-border)",
            }}
        >
            {/* Big icon — clickable to change */}
            <div
                className="relative w-16 h-16 rounded-[14px] shrink-0 flex items-center justify-center text-[28px] overflow-hidden cursor-pointer transition-[border-color] duration-150 group"
                style={{
                    background: "var(--ol-bg4)",
                    border: "1px solid var(--ol-border2)",
                }}
                onClick={() => toast("Chức năng upload icon")}
            >
                {app.clientIcon ?? "🔧"}
                <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px] uppercase tracking-[0.05em] text-white rounded-[14px]"
                    style={{
                        background: "rgba(0,0,0,0.6)",
                        fontFamily: "'IBM Plex Mono', monospace",
                    }}
                >
                    Thay đổi
                </div>
            </div>

            {/* App meta */}
            <div>
                <h2
                    className="text-[18px] font-bold tracking-[-0.3px]"
                    style={{ fontFamily: "'Syne', sans-serif", color: "#e8e8ed" }}
                >
                    {app.clientName}
                </h2>
                <p className="text-[12.5px] mt-0.5" style={{ color: "var(--ol-muted)" }}>
                    Đăng ký {app.createdAt}
                     {/* · {app.userCount} users đã cấp quyền */}
                </p>
                <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    {/* <Badge variant={app.clientType === "confidential" ? "default" : "outline"}>
                        {app.clientType === "confidential" ? "Confidential" : "Public"}
                    </Badge> */}
                    {app.role && <RoleBadge role={app.role} />}
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--ol-muted)" }}>
                        {app.clientId}
                    </span>
                </div>
            </div>
        </div>
    );
}