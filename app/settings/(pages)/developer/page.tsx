import type { Metadata } from "next";
import DeveloperClient from "./developer-client";

export const metadata: Metadata = {
    title: "OAuth Apps — WiFaKey",
    description: "Quản lý và đăng ký các ứng dụng OAuth tích hợp với hệ thống WiFaKey.",
};

export default function DeveloperPage() {
    return <DeveloperClient />;
}