"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

interface SidebarSection {
    title: string;
    items: SidebarItem[];
}

const UserIcon = () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width={14} height={14}>
        <circle cx="8" cy="5" r="3" />
        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
);

const AppsIcon = () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width={14} height={14}>
        <rect x="2" y="2" width="5" height="5" rx="1" />
        <rect x="9" y="2" width="5" height="5" rx="1" />
        <rect x="2" y="9" width="5" height="5" rx="1" />
        <rect x="9" y="9" width="5" height="5" rx="1" />
    </svg>
);

const DevIcon = () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width={14} height={14}>
        <path d="M5 4l-3 4 3 4M11 4l3 4-3 4M9 2l-2 12" />
    </svg>
);

const SIDEBAR_SECTIONS: SidebarSection[] = [
    {
        title: "Tài khoản",
        items: [
            { label: "Profile", href: "/settings/profile", icon: <UserIcon /> },
            { label: "Applications", href: "/settings/applications", icon: <AppsIcon /> },
        ],
    },
    {
        title: "Developer",
        items: [
            { label: "OAuth Apps", href: "/settings/developer", icon: <DevIcon /> },
        ],
    },
];

export function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        // Developer sub-pages all highlight the developer nav item
        if (href === "/settings/developer") {
            return pathname.startsWith("/settings/developer");
        }
        return pathname === href;
    };

    return (
        <aside className="w-[220px] shrink-0">
            {SIDEBAR_SECTIONS.map((section) => (
                <div key={section.title} className="mb-6">
                    {/* Section label */}
                    <span
                        className="block px-3 pb-2 text-[10px] uppercase tracking-[0.12em] font-medium"
                        style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            color: "var(--ol-muted2)",
                        }}
                    >
                        {section.title}
                    </span>

                    {/* Items */}
                    {section.items.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2.5 px-3 py-[7px] rounded-[6px] text-[13.5px] transition-all duration-150 no-underline border select-none",
                                    active
                                        ? "font-medium"
                                        : "font-normal hover:bg-[var(--ol-bg3)]"
                                )}
                                style={{
                                    color: active ? "#e8e8ed" : "var(--ol-muted)",
                                    background: active ? "var(--ol-bg4)" : "transparent",
                                    borderColor: active ? "var(--ol-border)" : "transparent",
                                }}
                            >
                                {/* Dot indicator */}
                                <span
                                    className="w-[5px] h-[5px] rounded-full shrink-0 transition-colors"
                                    style={{ background: active ? "var(--ol-accent)" : "var(--ol-muted2)" }}
                                />
                                <span
                                    className="shrink-0 transition-opacity"
                                    style={{ opacity: active ? 1 : 0.6 }}
                                >
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            ))}
        </aside>
    );
}