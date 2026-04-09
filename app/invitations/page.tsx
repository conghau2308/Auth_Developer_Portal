"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/settings/ui/card";
import { useInvitationPreview } from "@/hooks/use-public";
import { useAcceptInvitation, useDeclineInvitation } from "@/hooks/use-invitation";

function Avatar({ name, size = 20 }: { name: string; size?: number }) {
    const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            background: "#E6F1FB", color: "#0C447C",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.45, fontWeight: 500, flexShrink: 0,
        }}>
            {initials}
        </div>
    );
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function RoleBadge({ role }: { role: string }) {
    const styles: Record<string, React.CSSProperties> = {
        ADMIN: { background: "#dbeafe", color: "#1e40af" },
        DEVELOPER: { background: "#dcfce7", color: "#166534" },
    };
    return (
        <span style={{
            fontSize: 11, padding: "3px 9px", borderRadius: 99, fontWeight: 500,
            ...(styles[role] ?? { background: "var(--ol-bg3)", color: "var(--ol-muted)" })
        }}>
            {role}
        </span>
    );
}

// ── Main Page Component ───────────────────────────────────────────
export default function InvitationPage() {
    // Lấy token từ URL params: /invitations/accept?token=xxx
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const { data, isLoading, error } = useInvitationPreview(token);
    const { mutate: accept, isPending: isAccepting } = useAcceptInvitation(token);
    const { mutate: decline, isPending: isDeclining } = useDeclineInvitation(token);

    const isActionPending = isAccepting || isDeclining;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
            <div className="w-full max-w-[460px]">
                <Card>
                    {/* Header */}
                    <div className="p-6 text-center" style={{ borderBottom: "1px solid var(--ol-border)" }}>
                        <div className="mx-auto mb-4 flex items-center justify-center w-[48px] h-[48px] rounded-[12px]"
                            style={{ background: "var(--ol-text)", color: "var(--ol-bg)" }}>
                            <span className="text-xl font-medium">W</span>
                        </div>
                        <h1 className="text-[17px] font-medium mb-1.5">Chi tiết lời mời</h1>
                        <p className="text-[12.5px]" style={{ color: "var(--ol-muted)", lineHeight: 1.5 }}>
                            Bạn được mời tham gia vào một ứng dụng. Vui lòng kiểm tra thông tin bên dưới trước khi xác nhận.
                        </p>
                    </div>

                    <CardBody className="p-6">
                        {/* Loading */}
                        {isLoading && (
                            <p className="text-center text-[13px] py-6" style={{ color: "var(--ol-muted)" }}>
                                Đang tải thông tin lời mời...
                            </p>
                        )}

                        {/* Error */}
                        {error && (
                            <>
                                <div className="mb-5 p-3 rounded-md flex items-start gap-2"
                                    style={{ background: "var(--color-background-danger)", border: "0.5px solid rgba(200,0,0,0.15)" }}>
                                    <svg className="w-[15px] h-[15px] mt-0.5 shrink-0" style={{ color: "var(--color-text-danger)" }}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-[12.5px] font-medium m-0" style={{ color: "var(--color-text-danger)" }}>
                                        {error.message ?? "Lời mời này đã hết hạn hoặc đã bị thu hồi."}
                                    </p>
                                </div>
                                <Button variant="outline" className="w-full" onClick={() => window.location.href = "/"}>
                                    Về trang chủ
                                </Button>
                            </>
                        )}

                        {/* Data — khớp với InvitationPreviewDto */}
                        {!isLoading && !error && data && (
                            <>
                                <div className="rounded-lg mb-5"
                                    style={{ background: "var(--ol-bg3)", border: "0.5px solid var(--ol-border)" }}>

                                    <Row label="Ứng dụng">
                                        <span className="text-[13px] font-medium">{data.clientName}</span>
                                    </Row>

                                    <Row label="Quyền hạn">
                                        <RoleBadge role={data.role} />
                                    </Row>

                                    // Đảm bảo check đủ 3 điều kiện trước khi render section data
                                    {!isLoading && !error && data && (
                                        <>
                                            <Row label="Người mời">
                                                {data.invitedByName && (  // ← thêm guard nếu field có thể null
                                                    <div className="flex items-center gap-1.5">
                                                        <span>{data.invitedByName}</span>
                                                        <Avatar name={data.invitedByName} size={18} />
                                                    </div>
                                                )}
                                            </Row>
                                        </>
                                    )}

                                    <Row label="Email người mời">
                                        <span className="text-[12.5px] font-medium">{data.invitedByEmail}</span>
                                    </Row>

                                    <Row label="Email của bạn">
                                        <span className="text-[12.5px] font-medium">{data.inviteeEmail}</span>
                                    </Row>

                                    <Row label="Hết hạn lúc" last>
                                        <span className="text-[12.5px]">{formatDate(data.expiresAt)}</span>
                                    </Row>
                                </div>

                                <div className="flex items-center gap-2.5">
                                    <Button variant="outline" className="flex-1"
                                        onClick={() => decline()}
                                        disabled={isActionPending}>
                                        Từ chối
                                    </Button>
                                    <Button variant="default" className="flex-1"
                                        onClick={() => accept()}
                                        disabled={isActionPending}>
                                        {isAccepting ? "Đang xử lý..." : "Chấp nhận lời mời"}
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardBody>
                </Card>

                <p className="text-center text-[12px] mt-5" style={{ color: "var(--ol-muted)" }}>
                    Wifakey Identity Provider &copy; {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}

// ── Helper Row Component ──────────────────────────────────────────
function Row({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
    return (
        <div className="flex justify-between items-center px-3.5 py-2.5"
            style={{ borderBottom: last ? "none" : "0.5px dashed var(--ol-border)" }}>
            <span className="text-[12.5px]" style={{ color: "var(--ol-muted)" }}>{label}</span>
            {children}
        </div>
    );
}