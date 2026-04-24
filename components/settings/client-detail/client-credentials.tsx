"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardBody, CardHead } from "../ui/card";
import { Button } from "@/components/ui/button";
import { Modal, ModalActions, ModalBody, SecretBox, WarnBox } from "../ui/modal";
import { ClientSecret, SecretUserDto } from "@/types/api.types";
import { useDeleteClientSecret, useGenNewClientSecret } from "@/hooks/use-developer";

interface ClientCredentialsProps {
    id: string;
    clientId: string;
    canManageSecrets: boolean;
    secrets: ClientSecret[];
}

// ── Avatar ───────────────────────────────────────────────────────
function Avatar({ user, size = 22 }: { user: SecretUserDto; size?: number }) {
    const initials = user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    return (
        <div
            style={{
                width: size, height: size, borderRadius: "50%",
                background: "var(--kw-avatar-bg)", color: "var(--kw-avatar-color)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: size * 0.45, fontWeight: 500, flexShrink: 0,
            }}
        >
            {user.avatar
                ? <img src={user.avatar} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                : initials
            }
        </div>
    );
}

// ── User chip với tooltip hover ──────────────────────────────────
function UserChip({ user, danger }: { user: SecretUserDto; danger?: boolean }) {
    const [show, setShow] = useState(false);
    const shortId = user.userId.slice(0, 8) + "…" + user.userId.slice(-4);

    return (
        <span
            className="relative inline-flex items-center gap-1 cursor-default"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <Avatar user={user} size={18} />
            <span className="text-[12px]" style={{ color: danger ? "var(--kw-danger)" : "inherit" }}>
                {user.name}
            </span>

            {show && (
                <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 rounded-lg p-2.5 min-w-[160px]"
                    style={{
                        background: "var(--kw-bg2)",
                        border: "0.5px solid var(--kw-border)",
                        boxShadow: "var(--kw-shadow-tooltip)",
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Avatar user={user} size={32} />
                        <div>
                            <p className="text-[13px] font-medium m-0">{user.name}</p>
                            <p className="text-[11px] m-0" style={{ color: "var(--kw-muted)" }}>{shortId}</p>
                        </div>
                    </div>
                </div>
            )}
        </span>
    );
}

// ── Format date ──────────────────────────────────────────────────
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

// ── Secret row ───────────────────────────────────────────────────
function SecretRow({
    secret, canManageSecrets, onRevoke, onDelete
}: {
    secret: ClientSecret;
    canManageSecrets: boolean;
    onRevoke: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    const handleCopy = () => {
        navigator.clipboard.writeText(secret.maskedValue).catch(() => { });
        toast("Đã sao chép");
    };

    return (
        <div
            className="flex items-start gap-3 py-3"
            style={{
                borderBottom: "0.5px solid var(--kw-border)",
                opacity: secret.active ? 1 : 0.6,
            }}
        >
            <div className="flex-1 min-w-0">
                {/* Masked value + badge */}
                <div className="flex items-center gap-2 flex-wrap">
                    <code
                        className="text-[12.5px] px-2 py-1 rounded-md"
                        style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            background: "var(--kw-bg3)",
                            border: "0.5px solid var(--kw-border)",
                            textDecoration: secret.active ? "none" : "line-through",
                        }}
                    >
                        {secret.maskedValue}
                    </code>
                    <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                        style={secret.active
                            ? { background: "var(--color-background-success)", color: "var(--color-text-success)" }
                            : { background: "var(--color-background-danger)", color: "var(--color-text-danger)" }
                        }
                    >
                        {secret.active ? "Active" : "Revoked"}
                    </span>
                </div>

                {/* Created by */}
                <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                    <span className="text-[11.5px]" style={{ color: "var(--kw-muted)" }}>
                        Tạo lúc {formatDate(secret.createdAt)} bởi
                    </span>
                    <UserChip user={secret.createdByUser} />
                </div>

                {/* Revoked by */}
                {!secret.active && secret.revokedByUser && secret.revokedAt && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                        <span className="text-[11.5px]" style={{ color: "var(--color-text-danger)" }}>
                            Revoked lúc {formatDate(secret.revokedAt)} bởi
                        </span>
                        <UserChip user={secret.revokedByUser} danger />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
                {/* {secret.active && canManageSecrets && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRevoke(secret.secretId)}
                        className="text-[12px] hover:text-red-500 hover:border-red-400"
                    >
                        Revoke
                    </Button>
                )} */}
                {canManageSecrets && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(secret.secretId)}
                        className="text-[12px] hover:text-red-500 hover:border-red-400"
                    >
                        Xóa
                    </Button>
                )}
            </div>
        </div>
    );
}

// ── Main component ───────────────────────────────────────────────
export function ClientCredentials({ id, clientId, canManageSecrets, secrets }: ClientCredentialsProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [newSecret, setNewSecret] = useState<string | null>(null);
    const deleteSecret = useDeleteClientSecret();

    const handleCopyId = () => {
        navigator.clipboard.writeText(clientId).catch(() => { });
        toast("Đã sao chép Client ID");
    };

    const genSecret = useGenNewClientSecret(id);

    const handleGenerate = () => {
        genSecret.mutate(undefined, {
            onSuccess: (response) => {
                setNewSecret(response.secretValue); // ← lấy từ response thực
                setModalOpen(true);
            }
        });
    };

    const handleRevoke = (secretId: string) => {
        // TODO: gọi API revoke secret
        toast("Đã revoke secret " + secretId.slice(0, 8));
    };

    const handleClose = () => {
        setModalOpen(false);
        setNewSecret(null);
    };

    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const handleDelete = (secretId: string) => {
        setDeleteTargetId(secretId);
    };

    const confirmDelete = () => {
        if (!deleteTargetId) return;
        deleteSecret.mutate(
            { client_id: id, secret_id: deleteTargetId },
            {
                onSuccess: () => {
                    setDeleteTargetId(null);
                },
            }
        );
    };

    return (
        <>
            <Card>
                <CardHead
                    title="Client Credentials"
                    description="Dùng để xác thực ứng dụng với IdP"
                />
                <CardBody>
                    {/* Client ID */}
                    <label className="block text-[12px] mb-1.5" style={{ color: "var(--kw-muted)" }}>
                        Client ID
                    </label>
                    <div className="flex items-center gap-2 mb-4">
                        <div
                            className="flex-1 rounded-[7px] px-3 py-2 text-[12.5px]"
                            style={{
                                fontFamily: "'IBM Plex Mono', monospace",
                                background: "var(--kw-bg3)",
                                border: "1px solid var(--kw-border)",
                            }}
                        >
                            {clientId}
                        </div>
                        <Button variant="outline" size="sm" onClick={handleCopyId}>
                            Copy
                        </Button>
                    </div>

                    <hr style={{ border: "none", borderTop: "1px solid var(--kw-border)", margin: "16px 0" }} />

                    {/* Secrets header */}
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-[12.5px] font-medium m-0">Client Secrets</p>
                            <p className="text-[11.5px] mt-0.5 m-0" style={{ color: "var(--kw-muted)" }}>
                                Secret chỉ hiển thị một lần khi được tạo.
                            </p>
                        </div>
                        {canManageSecrets && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleGenerate}
                                disabled={genSecret.isPending}
                            >
                                {genSecret.isPending ? "Đang tạo..." : "Generate mới"}
                            </Button>
                        )}
                    </div>

                    {/* Secret list */}
                    <div>
                        {secrets.map(secret => (
                            <SecretRow
                                key={secret.secretId}
                                secret={secret}
                                canManageSecrets={canManageSecrets}
                                onRevoke={handleRevoke}
                                onDelete={handleDelete}
                            />
                        ))}
                        {secrets.length === 0 && (
                            <p className="text-[12.5px] py-4 text-center" style={{ color: "var(--kw-muted)" }}>
                                Chưa có secret nào.
                            </p>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* Modal hiển thị secret mới vừa generate */}
            <Modal open={modalOpen} onClose={handleClose} title="Secret mới đã được tạo">
                <ModalBody>
                    <WarnBox>
                        Sao chép và lưu ngay bây giờ. Secret này sẽ không hiển thị lại sau khi đóng.
                    </WarnBox>
                    {newSecret && <SecretBox value={newSecret} />}
                </ModalBody>
                <ModalActions>
                    <Button variant="outline" size="sm" onClick={() => {
                        navigator.clipboard.writeText(newSecret || "").catch(() => { });
                        toast("Đã sao chép secret");
                    }}>
                        Copy secret
                    </Button>
                    <Button variant="default" size="sm" onClick={handleClose}>
                        Đã lưu, đóng
                    </Button>
                </ModalActions>
            </Modal>

            <Modal open={!!deleteTargetId} onClose={() => setDeleteTargetId(null)} title="Xóa client secret?">
                <ModalBody>
                    Secret này sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể khôi phục.
                </ModalBody>
                <ModalActions>
                    <Button variant="outline" size="sm" onClick={() => setDeleteTargetId(null)}>
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={confirmDelete}
                        disabled={deleteSecret.isPending}
                    >
                        {deleteSecret.isPending ? "Đang xóa..." : "Xác nhận xóa"}
                    </Button>
                </ModalActions>
            </Modal>
        </>
    );
}