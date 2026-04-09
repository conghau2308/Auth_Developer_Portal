"use client";

import { AppList } from "@/components/settings/developer/app-list";
import { PageHead } from "@/components/settings/ui/page-head";
import { Button } from "@/components/ui/button";
import { useClientMembership } from "@/hooks/use-developer";
import type { Metadata } from "next";
import Link from "next/link";

// export const metadata: Metadata = {
//     title: "OAuth Apps — Obsidian Lens IdP",
// };

const PlusIcon = () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width={13} height={13}>
        <path d="M8 2v12M2 8h12" />
    </svg>
);

export default function DeveloperPage() {
    const { data: apps, isLoading } = useClientMembership();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <PageHead
                title="OAuth Apps"
                description="Các ứng dụng bạn đã đăng ký để tích hợp với hệ thống IdP."
                action={
                    <Button variant="secondary" size="sm" asChild>
                        <Link href="/settings/developer/new" className="inline-flex items-center gap-[7px] no-underline" style={{ color: "#fff" }}>
                            <PlusIcon />
                            New OAuth App
                        </Link>
                    </Button>
                }
            />
            <AppList apps={apps || []} />
        </>
    );
}