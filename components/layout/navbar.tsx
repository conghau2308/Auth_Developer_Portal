"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";

export function Navbar() {
    const { data: user, isLoading, fetchStatus, status } = useAuth();

    console.log('🔍 Navbar re-render:', {
        user: user ?? 'null/undefined',
        isLoading,
        fetchStatus,
        status,
        showSkeleton: isLoading && fetchStatus === 'fetching',
        time: new Date().toISOString(),
    });

    const showSkeleton = isLoading && fetchStatus === 'fetching';
    console.log('showSkeleton:', showSkeleton);
    const logout = useLogout();

    // Lấy 2 chữ cái đầu của tên, nếu không có tên thì lấy từ email, mặc định là "U"
    const initials = (user?.name || user?.email || "User").slice(0, 2).toUpperCase();

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
            <div className="flex justify-between items-center px-8 py-3 max-w-screen-2xl mx-auto">

                {/* Logo */}
                <div className="text-2xl font-black text-primary tracking-tight">
                    The Obsidian Lens
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="#"
                        className="text-primary border-b-2 border-primary pb-1 font-bold tracking-tight text-sm"
                    >
                        Docs
                    </Link>
                    <Link
                        href="#"
                        className="text-muted-foreground hover:text-primary transition-colors font-bold tracking-tight text-sm"
                    >
                        Pricing
                    </Link>
                </div>

                {/* Auth Area */}
                <div className="flex items-center gap-3">
                    {showSkeleton ? (
                        /* Skeleton loading cho Avatar */
                        // <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                        <div> Loading...</div>
                    ) : user ? (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button className="rounded-full outline-none ring-offset-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={user.avatar} alt={user.name || "User"} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                sideOffset={8}
                                /* Đảm bảo bg-background và text-foreground để không bị trùng màu chữ */
                                className="w-56 rounded-xl border-border/40 shadow-xl p-1.5 bg-background text-foreground"
                            >
                                {/* Header */}
                                <DropdownMenuLabel className="font-normal p-2">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-xs text-muted-foreground mb-0.5">
                                            Signed in as
                                        </p>
                                        <p className="text-sm font-bold text-foreground leading-none truncate">
                                            {user.name || "User"}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {user.email || "user email"}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator className="bg-border/50 mx-1" />

                                {/* Profile Item - Bổ sung hover:bg và hover:text */}
                                <DropdownMenuItem asChild onClick={() => console.log("user data", user)} className="cursor-pointer rounded-md mx-1 my-0.5 px-2.5 py-2 hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors outline-none">
                                    <Link href="#" className="flex items-center gap-2.5 w-full">
                                        <UserRound size={16} />
                                        <span className="font-medium text-sm">Profile</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-border/50 mx-1" />

                                {/* Logout Item - Bổ sung hover:bg và hover:text */}
                                <DropdownMenuItem
                                    onClick={() => logout.mutate()}
                                    disabled={logout.isPending}
                                    className="cursor-pointer rounded-md mx-1 my-0.5 px-2.5 py-2 text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2.5 transition-colors outline-none"
                                >
                                    <LogOut size={16} />
                                    <span className="font-medium text-sm">
                                        {logout.isPending ? "Logging out..." : "Log out"}
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-primary font-bold"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button
                                    size="sm"
                                    className="px-5 rounded-xl bg-primary text-primary-foreground font-bold active:scale-95 shadow-lg shadow-primary/20 hover:opacity-90 border-0"
                                >
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}