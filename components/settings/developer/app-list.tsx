import { OAuthApp } from "@/types/common.types";
import { Card } from "../ui/card";
import { AppItem } from "./app-item";
import { ClientMemberResponseDto } from "@/types/api.types";


interface AppListProps {
    apps: ClientMemberResponseDto[];
}

export function AppList({ apps }: AppListProps) {
    if (apps.length === 0) {
        return (
            <Card>
                <div className="py-16 px-5 text-center">
                    <div className="text-[40px] mb-3.5">📦</div>
                    <h3
                        className="text-[16px] font-semibold mb-1.5"
                        style={{ fontFamily: "'Syne', sans-serif", color: "#e8e8ed" }}
                    >
                        Chưa có OAuth App nào
                    </h3>
                    <p className="text-[13px]" style={{ color: "var(--ol-muted)" }}>
                        Tạo ứng dụng đầu tiên để bắt đầu tích hợp với IdP.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            {apps.map((app) => (
                <AppItem key={app.id} app={app} />
            ))}
        </Card>
    );
}