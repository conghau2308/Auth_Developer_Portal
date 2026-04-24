import { NewAppForm } from "@/components/settings/developer/new-app-form";
import { Breadcrumb } from "@/components/settings/ui/breadcrumb";
import { PageHead } from "@/components/settings/ui/page-head";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "New OAuth App - WiFaKey",
};

export default function NewAppPage() {
    return (
        <>
            <Breadcrumb
                crumbs={[
                    { label: "OAuth Apps", href: "/settings/developer" },
                    { label: "New OAuth App" },
                ]}
            />
            <PageHead
                title="Đăng ký OAuth App mới"
                description="Ứng dụng mới sẽ nhận được Client ID sau khi đăng ký thành công."
            />
            <NewAppForm />
        </>
    );
}