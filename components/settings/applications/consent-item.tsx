"use client";

import { useState } from "react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Modal, ModalActions, ModalBody } from "../ui/modal";
import { AuthorizedApplication } from "@/types/api.types";
import { useRevokeApplication } from "@/hooks/use-user";

export function ConsentItem({ app }: { app: AuthorizedApplication }) {
    const [open, setOpen] = useState(false);
    const revoke = useRevokeApplication();

    const handleRevoke = () => {
        revoke.mutate(app.id, {
            onSuccess: () => {
                setOpen(false);
            }
        });
    };

    return (
        <>
            <div
                className="flex items-center gap-4 px-5 py-4 transition-colors duration-150 last:border-b-0"
                style={{ borderBottom: "1px solid var(--ol-border)" }}
                onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "var(--ol-bg3)")
                }
                onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "transparent")
                }
            >
                <div
                    className="w-10 h-10 rounded-[10px] shrink-0 flex items-center justify-center text-[18px]"
                    style={{
                        background: "var(--ol-bg4)",
                        border: "1px solid var(--ol-border)",
                    }}
                >
                    {app.clientIcon}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold" style={{ color: "var(--kw-text-strong)" }}>
                        {app.clientName}
                    </div>
                    <div className="flex gap-[5px] flex-wrap mt-[5px]">
                        {app.grantedScopes.map((scope) => (
                            <Badge key={scope} variant="outline">
                                {scope}
                            </Badge>
                        ))}
                    </div>
                    <div className="text-[11.5px] mt-[3px]" style={{ color: "var(--ol-muted)" }}>
                        Cấp quyền {app.grantedAt} · {app.updatedAt && `Cấp quyền mới nhất vào ${app.updatedAt}`}
                    </div>
                </div>

                <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                    Revoke
                </Button>
            </div>

            <Modal open={open} onClose={() => setOpen(false)} title="Revoke quyền truy cập?">
                <ModalBody>
                    Ứng dụng{" "}
                    <strong style={{ color: "var(--kw-text-strong)" }}>{app.clientIcon}</strong> sẽ không thể truy
                    cập tài khoản của bạn. Refresh token hiện tại sẽ bị vô hiệu hóa ngay lập tức.
                </ModalBody>
                <ModalActions>
                    <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                        Hủy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRevoke}>
                        Xác nhận revoke
                    </Button>
                </ModalActions>
            </Modal>
        </>
    );
}