import { ClientMemberResponseDto } from "@/types/api.types";
import { OAuthApp } from "@/types/common.types";
import Link from "next/link";

const ChevronIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
        style={{ color: "var(--ol-muted)", flexShrink: 0 }}>
        <path d="M6 4l4 4-4 4" />
    </svg>
);

const ROLE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
    OWNER: { bg: "#EEEDFE", color: "#534AB7", border: "#CECBF6" },
    ADMIN: { bg: "#FAEEDA", color: "#854F0B", border: "#FAC775" },
    DEVELOPER: { bg: "#EAF3DE", color: "#3B6D11", border: "#C0DD97" },
};

interface AppItemProps {
    app: ClientMemberResponseDto;
}

export function AppItem({ app }: AppItemProps) {
    const roleStyle = app.role ? ROLE_STYLES[app.role] : null;

    return (
        <Link
            href={`/settings/developer/${app.id}`}
            className="flex items-center gap-3.5 px-4 py-3.5 no-underline transition-colors duration-150 last:border-b-0 hover:bg-[var(--ol-bg3)]"
            style={{ borderBottom: "1px solid var(--ol-border)", color: "inherit" }}
        >
            {/* App icon */}
            <div
                className="w-10 h-10 rounded-[10px] shrink-0 flex items-center justify-center text-[18px]"
                style={{ background: "var(--ol-bg3)", border: "1px solid var(--ol-border)" }}
            >
                {app.clientIcon ?? "🔧"}
            </div>

            {/* App info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-[13.5px] font-semibold" style={{ color: "#e8e8ed" }}>
                        {app.clientName}
                    </span>

                    {/* Client type badge */}
                    {/* <span
                        className="text-[11px] px-2 py-0.5 rounded-full"
                        style={
                            app.clientType === "confidential"
                                ? { background: "#E6F1FB", color: "#185FA5", border: "0.5px solid #B5D4F4" }
                                : { background: "var(--ol-bg3)", color: "var(--ol-muted)", border: "0.5px solid var(--ol-border)" }
                        }
                    >
                        {app.clientType === "confidential" ? "Confidential" : "Public"}
                    </span> */}

                    {/* Role badge */}
                    {roleStyle && (
                        <span
                            className="text-[11px] px-2 py-0.5 rounded-full"
                            style={{ background: roleStyle.bg, color: roleStyle.color, border: `0.5px solid ${roleStyle.border}` }}
                        >
                            {app.role}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2.5 text-[12px]" style={{ color: "var(--ol-muted)" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>{app.clientId}</span>
                    <span>·</span>
                    {/* <span>{app.userCount} users</span> */}
                    <span>·</span>
                    <span>{app.createdAt}</span>
                </div>
            </div>

            <ChevronIcon />
        </Link>
    );
}