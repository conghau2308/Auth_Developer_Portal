"use client";

import { AppDangerZoneCard } from "@/components/settings/client-detail/app-danger-zone-card";
import { AppSettingsCard } from "@/components/settings/client-detail/app-settings-card";
import { ClientCredentials } from "@/components/settings/client-detail/client-credentials";
import { ClientHeaderCard } from "@/components/settings/client-detail/client-header-card";
import { ClientMembers } from "@/components/settings/client-detail/client-member";
import { Breadcrumb } from "@/components/settings/ui/breadcrumb";
import { useClientCredentials } from "@/hooks/use-developer";
import { use } from "react";

export default function ClientDetailContent({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { data: app, isLoading, isError } = useClientCredentials(id);

    // ── Trạng thái Đang tải ───────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-10 h-10 rounded-full border-[4px] border-primary/10 border-t-primary animate-spin mb-4" />
                <p className="text-[14px] font-bold text-body dark:text-muted-foreground animate-pulse">
                    Đang truy xuất cấu hình ứng dụng...
                </p>
            </div>
        );
    }

    // ── Trạng thái Lỗi ────────────────────────────────────────────
    if (isError || !app) {
        return (
            <div className="py-12 px-6 rounded-2xl border border-destructive/20 bg-destructive/5 text-center">
                <div className="text-3xl mb-3">⚠️</div>
                <h3 className="text-[16px] font-black text-destructive mb-1">Không tìm thấy ứng dụng</h3>
                <p className="text-[13px] font-medium text-body dark:text-muted-foreground">
                    Ứng dụng không tồn tại hoặc bạn không có quyền truy cập.
                </p>
            </div>
        );
    }

    return (
        <div className="animate-fade-slide flex flex-col gap-6 pb-20">
            {/* Breadcrumb - Cần đảm bảo component này dùng text-primary */}
            <Breadcrumb
                crumbs={[
                    { label: "OAuth Apps", href: "/settings/developer" },
                    { label: app.clientName },
                ]}
            />

            {/* Header Card - Thông tin tổng quan */}
            <ClientHeaderCard app={app} />

            {/* Grid chia 2 cột cho thông tin chi tiết (Tùy chọn nếu muốn Dashboard gọn hơn) */}
            <div className="grid grid-cols-1 gap-6">

                {/* Members - Quản lý thành viên */}
                <ClientMembers
                    id={app.id}
                    canManageMembers={app.role === "OWNER" || app.role === "ADMIN"}
                />

                {/* Credentials - Client ID & Secrets */}
                <ClientCredentials
                    id={app.id}
                    clientId={app.clientId}
                    canManageSecrets={app.role === "OWNER" || app.role === "ADMIN"}
                    secrets={app.clientSecrets}
                />

                {/* Settings - Cấu hình URL Redirect, v.v. */}
                <AppSettingsCard app={app} />

                {/* Danger Zone - Chỉ hiện cho chủ sở hữu */}
                {app.role === "OWNER" && (
                    <div className="mt-4">
                        <AppDangerZoneCard app={app} />
                    </div>
                )}
            </div>
        </div>
    );
}