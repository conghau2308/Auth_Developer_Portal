import { AvatarCard } from "@/components/settings/profile/avatar-card";
import { BasicInfoCard } from "@/components/settings/profile/basic-infor-card";
import { PageHead } from "@/components/settings/ui/page-head";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile - WiFaKey",
    description: "Quản lý thông tin người dùng."
};

export default function ProfilePage() {
    return (
        <>
            <PageHead
                title="Profile"
                description="Quản lý thông tin cá nhân hiển thị trên hệ thống."
            />
            <AvatarCard />
            <BasicInfoCard />
        </>
    );
}