"use client";

import type { Metadata } from "next";
import { PageHead } from "@/components/settings/ui/page-head";
import { ConsentList } from "@/components/settings/applications/consent-list";
import { useAuthorizedApplications } from "@/hooks/use-user";

// export const metadata: Metadata = {
//     title: "Applications — Obsidian Lens IdP",
// };
// Lưu ý về meta data này nhé, cần cho SEO

export default function ApplicationsPage() {
    const { data: applications, isLoading } = useAuthorizedApplications();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <PageHead
                title="Authorized Applications"
                description="Các ứng dụng bên thứ ba bạn đã cấp quyền truy cập tài khoản."
            />
            <ConsentList apps={applications?.items || []} />
            <p className="text-[12px] mt-3 leading-[1.7]" style={{ color: "var(--ol-muted)" }}>
                Khi revoke quyền, ứng dụng sẽ không thể truy cập tài khoản cho đến khi bạn cấp
                phép lại. Refresh token của ứng dụng đó sẽ bị vô hiệu hóa ngay lập tức.
            </p>
        </>
    );
}