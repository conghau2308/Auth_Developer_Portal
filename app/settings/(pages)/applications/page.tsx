import type { Metadata } from "next";
import ApplicationsClient from "./application-client";

// Chuẩn SEO cho trang quản lý ứng dụng
export const metadata: Metadata = {
    title: "Authorized Applications - WiFaKey",
    description: "Quản lý các ứng dụng bên thứ ba đã được cấp quyền truy cập tài khoản WiFaKey của bạn.",
};

export default function ApplicationsPage() {
    return <ApplicationsClient />;
}