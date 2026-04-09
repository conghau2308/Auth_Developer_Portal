"use client";

import { AppDangerZoneCard } from "@/components/settings/client-detail/app-danger-zone-card";
import { AppSettingsCard } from "@/components/settings/client-detail/app-settings-card";
import { ClientCredentials } from "@/components/settings/client-detail/client-credentials";
import { ClientHeaderCard } from "@/components/settings/client-detail/client-header-card";
import { ClientMembers } from "@/components/settings/client-detail/client-member";
import { StatsCard } from "@/components/settings/client-detail/stats-card";
import { Breadcrumb } from "@/components/settings/ui/breadcrumb";
import { useClientCredentials } from "@/hooks/use-developer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { use } from "react";

// // ── Static data store (replace with DB fetch) ───────────────────
// const APPS_DB: Record<string, OAuthApp> = {
//     "my-web-app": {
//         id: "my-web-app",
//         name: "My Web Application",
//         clientId: "my-web-app-client",
//         homepageUrl: "https://myapp.example.com",
//         redirectUri: "https://myapp.example.com/callback",
//         iconUrl: "🛒",
//         clientType: "confidential",
//         createdAt: "01/04/2026",
//         userCount: 3,
//         role: "OWNER",
//     },
//     "mobile-client": {
//         id: "mobile-client",
//         name: "Mobile Client",
//         clientId: "mobile-client-v2",
//         homepageUrl: "https://mobile.example.com",
//         redirectUri: "myapp://callback",
//         iconUrl: "📱",
//         clientType: "public",
//         createdAt: "15/03/2026",
//         userCount: 12,
//         role: "DEVELOPER",
//     }
// };

// const STATS_DB: Record<string, AppStats> = {
//     "my-web-app": { activeUsers: 3, tokenExchanges: 142, activeSecrets: 2 },
//     "mobile-client": { activeUsers: 12, tokenExchanges: 543, activeSecrets: 1 },
// };

// // ── Metadata ────────────────────────────────────────────────────
// export async function generateMetadata({
//     params,
// }: {
//     params: Promise<{ id: string }>;
// }): Promise<Metadata> {
//     const { id } = await params;
//     const app = APPS_DB[id];
//     return { title: app ? `${app.name} — Obsidian Lens IdP` : "App not found" };
// }

// ── Page ────────────────────────────────────────────────────────
export default function ClientDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { data: app, isLoading, isError } = useClientCredentials(id);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Guard sau khi loading xong — app chắc chắn defined từ đây trở xuống
    if (isError || !app) {
        return <div>Không tìm thấy ứng dụng.</div>;
    }

    return (
        <>
            <Breadcrumb
                crumbs={[
                    { label: "OAuth Apps", href: "/settings/developer" },
                    { label: app.clientName },
                ]}
            />

            <ClientHeaderCard app={app} />
            <ClientMembers
                id={app.id}
                canManageMembers={app.role === "OWNER" || app.role === "ADMIN"}
            />
            <ClientCredentials
                id={app.id}
                clientId={app.clientId}
                canManageSecrets={app.role === "OWNER" || app.role === "ADMIN"}
                secrets={app.clientSecrets}
            />
            <AppSettingsCard app={app} />

            {app.role === "OWNER" && <AppDangerZoneCard app={app} />}
        </>
    );
}