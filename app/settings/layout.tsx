import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/side-bard";
import type { Metadata } from "next";

export const metadata: Metadata = {
    // Đã đổi tên thương hiệu cho đồng bộ
    title: "Settings - WiFaKey",
};

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // <ToastProvider>
        /* 1. Xóa style inline var(--ol-bg) để nền trong suốt (transparent), 
              giúp lộ ra lớp ánh sáng Glow từ RootLayout.
           2. Đổi pt-10 thành pt-[60px] để nội dung không bị thụt vào dưới Navbar (vì Navbar của chúng ta cao đúng 60px).
        */
        <div className="flex flex-col min-h-screen pt-[60px] relative z-10">
            <Navbar />

            <div className="flex flex-1 max-w-[1100px] mx-auto w-full px-6 py-10 gap-10">
                <Sidebar />
                <main className="flex-1 min-w-0 animate-fade-slide">
                    {children}
                </main>
            </div>
        </div>
    );
}