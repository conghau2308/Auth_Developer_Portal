"use client";

import { PageHead } from "@/components/settings/ui/page-head";
import { ConsentList } from "@/components/settings/applications/consent-list";
import { useAuthorizedApplications } from "@/hooks/use-user";

export default function ApplicationsClient() {
    const { data: applications, isLoading } = useAuthorizedApplications();

    return (
        <div className="animate-fade-slide">
            <PageHead
                title="Authorized Applications"
                description="Các ứng dụng bên thứ ba bạn đã cấp quyền truy cập tài khoản."
            />

            {isLoading ? (
                // Nâng cấp giao diện Loading thay vì chỉ dùng chữ "Loading..."
                <div className="flex items-center gap-2.5 py-8 text-[13px] font-bold text-body dark:text-muted-foreground">
                    <span className="w-4 h-4 rounded-full border-[2.5px] border-primary/20 border-t-primary animate-spin" />
                    Đang tải danh sách ứng dụng...
                </div>
            ) : (
                <div className="mt-2">
                    <ConsentList apps={applications?.items || []} />
                </div>
            )}

            {/* Đã thay đổi var(--ol-muted) thành class semantic chuẩn của theme */}
            <p className="text-[13px] mt-6 leading-relaxed font-medium text-body dark:text-muted-foreground/80 max-w-2xl bg-slate-50 dark:bg-muted/30 p-4 rounded-xl border border-slate-200 dark:border-border">
                <strong className="text-strong">Lưu ý:</strong> Khi revoke (thu hồi) quyền, ứng dụng sẽ không thể truy cập tài khoản cho đến khi bạn cấp
                phép lại. Refresh token của ứng dụng đó sẽ bị vô hiệu hóa ngay lập tức.
            </p>
        </div>
    );
}