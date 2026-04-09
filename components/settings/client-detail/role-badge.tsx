const ROLE_STYLES = {
    OWNER: { bg: "#EEEDFE", color: "#534AB7", border: "#CECBF6" },
    ADMIN: { bg: "#FAEEDA", color: "#854F0B", border: "#FAC775" },
    DEVELOPER: { bg: "#EAF3DE", color: "#3B6D11", border: "#C0DD97" },
} as const;

export function RoleBadge({ role }: { role: keyof typeof ROLE_STYLES }) {
    const s = ROLE_STYLES[role];
    return (
        <span className="text-[11px] px-2 py-0.5 rounded-full"
            style={{ background: s.bg, color: s.color, border: `0.5px solid ${s.border}` }}>
            {role}
        </span>
    );
}