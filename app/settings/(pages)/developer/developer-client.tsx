"use client";

import { AppList } from "@/components/settings/developer/app-list";
import { PageHead } from "@/components/settings/ui/page-head";
import { Button } from "@/components/ui/button";
import { useClientMembership } from "@/hooks/use-developer";
import Link from "next/link";
import { Plus } from "lucide-react"; // Sử dụng Lucide cho đồng bộ hoặc SVG cũ

export default function DeveloperClient() {
    const { data: apps, isLoading } = useClientMembership();

    return (
        <div className="animate-fade-slide">
            <PageHead
                title="OAuth Apps"
                description="Các ứng dụng bạn đã đăng ký để tích hợp với hệ thống IdP."
                action={
                    <Button asChild className="btn-brand-gradient h-9 px-4 rounded-xl shadow-sm">
                        <Link href="/settings/developer/new" className="inline-flex items-center gap-2">
                            <Plus size={16} strokeWidth={3} />
                            <span className="text-[13px] font-bold">New OAuth App</span>
                        </Link>
                    </Button>
                }
            />

            {isLoading ? (
                /* Giao diện Loading đồng bộ với hệ thống */
                <div className="flex items-center gap-3 py-12 justify-center text-[14px] font-bold text-body dark:text-muted-foreground">
                    <span className="w-5 h-5 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
                    Đang tải danh sách ứng dụng...
                </div>
            ) : (
                <div className="mt-2">
                    <AppList apps={apps || []} />
                </div>
            )}
        </div>
    );
}