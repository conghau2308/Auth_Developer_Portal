import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/side-bard";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Settings — Obsidian Lens IdP",
};

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // <ToastProvider>
        <div className="flex flex-col min-h-screen pt-10" style={{ background: "var(--ol-bg)" }}>
            <Navbar />

            <div
                className="flex flex-1 max-w-[1100px] mx-auto w-full px-6 py-8 gap-10"
            >
                <Sidebar />
                <main className="flex-1 min-w-0 animate-fade-slide">
                    {children}
                </main>
            </div>
        </div>
        // </ToastProvider>
    );
}