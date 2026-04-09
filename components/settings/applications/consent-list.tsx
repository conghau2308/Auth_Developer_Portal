import { ConsentedApp } from "@/types/common.types";
import { Card, CardHead } from "../ui/card";
import { ConsentItem } from "./consent-item";
import { AuthorizedApplication } from "@/types/api.types";

export function ConsentList({ apps }: { apps: AuthorizedApplication[] }) {
    if (apps.length === 0) {
        return (
            <Card>
                <div className="py-16 px-5 text-center">
                    <div className="text-[40px] mb-3.5">🔒</div>
                    <h3
                        className="text-[16px] font-semibold mb-1.5"
                        style={{ fontFamily: "'Syne', sans-serif", color: "#e8e8ed" }}
                    >
                        Chưa có ứng dụng nào
                    </h3>
                    <p className="text-[13px]" style={{ color: "var(--ol-muted)" }}>
                        Bạn chưa cấp quyền cho ứng dụng bên thứ ba nào.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <CardHead
                title="Đang hoạt động"
                description={`${apps.length} ứng dụng có quyền truy cập`}
            />
            {apps.map((app) => (
                <ConsentItem key={app.id} app={app} />
            ))}
        </Card>
    );
}