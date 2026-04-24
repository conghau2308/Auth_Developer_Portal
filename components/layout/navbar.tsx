"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { ChevronDown, KeyRound, LogOut, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/* ── Logo mark ── */
function LogoMark() {
    return (
        <Link href="/">
            <div className="flex items-center gap-2.5">
                {/* Đổi btn-cyan-gradient thành btn-brand-gradient */}
                <div className="w-7 h-7 rounded-[7px] btn-brand-gradient flex items-center justify-center flex-shrink-0 shadow-sm">
                    <KeyRound size={14} className="text-white" strokeWidth={2.5} />
                </div>
                {/* Dùng text-strong để nét chữ đanh hơn */}
                <span className="text-[16px] font-black tracking-tight text-strong">
                    WiFa<span className="text-primary">Key</span>
                </span>
            </div>
        </Link>
    );
}

/* ── Nav links ── */
function NavLinks() {
    return (
        <nav className="hidden md:flex items-center gap-1.5">
            {[
                { label: "Docs", href: "/docs", active: true, badge: "v2" },
                { label: "Guides", href: "/guides" },
                { label: "Status", href: "/status" },
            ].map(({ label, href, active, badge }) => (
                <Link
                    key={href}
                    href={href}
                    className={[
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-bold transition-colors",
                        active
                            ? "text-primary bg-primary/10"
                            /* Đổi hover:bg-white/5 thành hover:bg-primary/5 để hợp Light/Dark */
                            : "text-body dark:text-muted-foreground hover:text-primary hover:bg-primary/5",
                    ].join(" ")}
                >
                    {label}
                    {badge && (
                        <span className="text-[9px] font-black bg-primary/15 text-primary rounded px-1.5 py-0.5 tracking-[0.05em] uppercase">
                            {badge}
                        </span>
                    )}
                </Link>
            ))}
        </nav>
    );
}

/* ── User dropdown ── */
function UserMenu({ user }: { user: NonNullable<ReturnType<typeof useAuth>["data"]> }) {
    const logout = useLogout();
    const initials = (user.name || user.email || "U").slice(0, 2).toUpperCase();
    const displayName = user.name || "User";
    const shortName = displayName.split(" ")[0];

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                {/* Sửa lại background và border để nổi bật trên Light Mode */}
                <Button
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full
                     border border-slate-200 dark:border-border bg-slate-50 dark:bg-muted/30
                     hover:bg-slate-100 dark:hover:bg-muted/50 hover:border-primary/30
                     transition-all duration-200 shadow-sm
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                    <Avatar className="h-[28px] w-[28px] shadow-sm">
                        <AvatarImage src={user.avatar} alt={displayName} />
                        <AvatarFallback className="avatar-gradient text-white text-[11px] font-black">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-bold text-strong hidden sm:block">
                        {shortName}
                    </span>
                    <ChevronDown size={14} className="text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="
                  w-56 rounded-xl p-1.5
                  bg-white dark:bg-card text-strong
                  border border-slate-200 dark:border-border 
                  shadow-xl shadow-black/10 dark:shadow-black/50
                  animate-fade-slide
                "
            >
                {/* Header */}
                <DropdownMenuLabel className="font-normal px-2.5 py-2.5">
                    <p className="text-[10px] font-bold text-body/60 dark:text-muted-foreground/60 uppercase tracking-[0.07em] mb-1">
                        Signed in as
                    </p>
                    <p className="text-[14px] font-black text-strong leading-none truncate mb-1">
                        {displayName}
                    </p>
                    <p className="text-[12px] font-medium text-body dark:text-muted-foreground truncate">
                        {user.email}
                    </p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-slate-100 dark:bg-border mx-1 my-1" />

                {/* Profile */}
                <DropdownMenuItem asChild className="
                  cursor-pointer rounded-lg mx-0.5 px-2.5 py-2
                  text-body dark:text-muted-foreground font-medium
                  hover:bg-primary/10 hover:text-primary
                  focus:bg-primary/10 focus:text-primary
                  transition-colors outline-none
                ">
                    <Link href="settings/profile" className="flex items-center gap-2.5 w-full">
                        <UserRound size={15} />
                        <span className="text-[13px]">Profile</span>
                    </Link>
                </DropdownMenuItem>

                {/* Settings */}
                <DropdownMenuItem asChild className="
                  cursor-pointer rounded-lg mx-0.5 px-2.5 py-2
                  text-body dark:text-muted-foreground font-medium
                  hover:bg-slate-100 dark:hover:bg-[var(--kw-slate-soft)] hover:text-strong dark:hover:text-foreground
                  focus:bg-slate-100 dark:focus:bg-[var(--kw-slate-soft)] focus:text-strong dark:focus:text-foreground
                  transition-colors outline-none
                ">
                    <Link href="/settings/applications" className="flex items-center gap-2.5 w-full">
                        <Settings size={15} />
                        <span className="text-[13px]">Settings</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-100 dark:bg-border mx-1 my-1" />

                {/* Sign out */}
                <DropdownMenuItem
                    onClick={() => logout.mutate()}
                    disabled={logout.isPending}
                    className="
                      cursor-pointer rounded-lg mx-0.5 px-2.5 py-2
                      text-destructive/90 font-medium
                      hover:bg-destructive/10 hover:text-destructive
                      focus:bg-destructive/10 focus:text-destructive
                      flex items-center gap-2.5 transition-colors outline-none
                    "
                >
                    <LogOut size={15} />
                    <span className="text-[13px]">
                        {logout.isPending ? "Signing out…" : "Sign out"}
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/* ── Main Navbar ── */
export function Navbar() {
    const { data: user, isLoading, fetchStatus } = useAuth();
    // Chỉ show skeleton khi THỰC SỰ đang fetch lần đầu
    // data === undefined: chưa có data bao giờ
    // data === null: đã biết là logged out
    const showSkeleton = isLoading && fetchStatus === "fetching" && user === undefined;

    return (
        <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 navbar-glow-border transition-all duration-300">
            <div className="flex justify-between items-center px-6 md:px-8 py-0 h-[60px] max-w-screen-xl mx-auto">

                <LogoMark />
                <NavLinks />

                {/* Auth area */}
                <div className="flex items-center gap-3">
                    {showSkeleton ? (
                        <div className="h-9 w-28 rounded-full bg-slate-200 dark:bg-muted animate-pulse" />
                    ) : user ? (
                        <UserMenu user={user} />
                    ) : (
                        <>
                            <Link href="/login">
                                {/* Đổi hover:bg-white/5 thành hover:bg-muted/50 */}
                                <Button className="text-[13px] font-bold text-body dark:text-muted-foreground hover:text-strong dark:hover:text-foreground px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-muted/50 transition-colors">
                                    Sign in
                                </Button>
                            </Link>

                            {/* Divider */}
                            <div className="w-px h-4 bg-slate-300 dark:bg-border/60 mx-1" />

                            <Link href="/sign-up">
                                {/* Đổi btn-cyan-gradient thành btn-brand-gradient */}
                                <Button className="btn-brand-gradient text-[13px] font-bold px-5 py-2 rounded-lg active:scale-95 transition-all shadow-sm">
                                    Get started
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}