import Link from "next/link";

interface Crumb {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    crumbs: Crumb[];
}

export function Breadcrumb({ crumbs }: BreadcrumbProps) {
    return (
        <nav
            className="flex items-center gap-1.5 mb-5 text-[12.5px]"
            style={{ color: "var(--ol-muted)" }}
        >
            {crumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && (
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            style={{ opacity: 0.5 }}
                        >
                            <path d="M6 4l4 4-4 4" />
                        </svg>
                    )}
                    {crumb.href ? (
                        <Link
                            href={crumb.href}
                            className="hover:text-[#a594ff] transition-colors"
                            style={{ color: "var(--ol-muted)", textDecoration: "none" }}
                        >
                            {crumb.label}
                        </Link>
                    ) : (
                        <span style={{ color: "#e8e8ed" }}>{crumb.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}