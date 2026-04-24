"use client";

import { Check, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";

const SCOPE_META: Record<string, { label: string; desc: string; icon: string }> = {
    "profile:read": { label: "Thông tin cá nhân", desc: "Tên, ảnh đại diện và thông tin cơ bản", icon: "👤" },
    "email:read": { label: "Địa chỉ email", desc: "Email đăng ký tài khoản của bạn", icon: "✉️" },
    "orders:read": { label: "Lịch sử đơn hàng", desc: "Xem đơn hàng và trạng thái giao dịch", icon: "📋" },
    "openid": { label: "Xác thực danh tính", desc: "Xác nhận bạn là chủ tài khoản", icon: "🔑" },
};

function scopeMeta(scope: string) {
    return SCOPE_META[scope] ?? { label: scope, desc: "Quyền truy cập vào dữ liệu của bạn", icon: "🔒" };
}

function getInitials(name: string) {
    return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

interface AuthorizeScreenProps {
    user: { name: string; email: string };
    clientName: string;
    clientIcon?: string;
    clientHomepageUrl?: string;
    scopes: string[];
    clientId: string;
    onConfirm: (scopes: string[]) => void;
    onDeny: () => void;
    isLoading?: boolean;
}

export function AuthorizeScreen({
    user, clientName, clientIcon, clientHomepageUrl,
    scopes, clientId, onConfirm, onDeny, isLoading,
}: AuthorizeScreenProps) {

    const btnPrimary = [
        "w-full py-6 rounded-xl font-bold text-base",
        "flex items-center justify-center gap-2",
        "active:scale-95 transition-all border-0",
        "btn-brand-gradient",
        "shadow-[0_10px_30px_hsl(var(--primary)/0.3)]",
        "disabled:opacity-30 disabled:cursor-not-allowed disabled:!translate-y-0 disabled:!shadow-none",
    ].join(" ");

    return (
        <div className="space-y-6">

            {/* Eyebrow + title */}
            <div className="px-1">
                <p
                    className="text-[10px] uppercase font-bold text-[var(--kw-brand)]"
                    style={{ letterSpacing: "0.2em" }}
                >
                    Yêu cầu quyền truy cập
                </p>
                <h2 className="font-bold text-lg text-[var(--kw-text-strong)]">
                    {clientName} muốn truy cập tài khoản của bạn
                </h2>
            </div>

            {/* Card */}
            <div className="bg-[var(--kw-bg2)] rounded-[2rem] p-8 shadow-2xl space-y-6">

                {/* Client header */}
                <div className="flex items-center gap-4">
                    {clientIcon ? (
                        <img
                            src={clientIcon}
                            alt={clientName}
                            className="w-14 h-14 rounded-2xl object-cover border border-[var(--kw-border)]"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border border-[var(--kw-border)] bg-[var(--kw-bg3)]">
                            🔐
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-lg leading-tight text-[var(--kw-text-strong)]">{clientName}</p>
                            {clientHomepageUrl && (
                                <a
                                    href={clientHomepageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--kw-text-muted)] hover:text-[var(--kw-brand)] transition-colors cursor-pointer"
                                >
                                    <ExternalLink size={13} />
                                </a>
                            )}
                        </div>
                        <p className="text-xs text-[var(--kw-text-muted)]">Đang yêu cầu quyền từ {user.email}</p>
                    </div>

                    {/* User avatar */}
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={{ background: "var(--kw-brand-soft)", color: "var(--kw-brand)" }}
                    >
                        {getInitials(user.name)}
                    </div>
                </div>

                {/* Scopes */}
                <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--kw-text-muted)] mb-3">
                        Quyền được yêu cầu
                    </p>
                    <div className="space-y-2">
                        {scopes.map((scope) => {
                            const meta = scopeMeta(scope);
                            return (
                                <div
                                    key={scope}
                                    className="flex items-start gap-3 p-3 rounded-xl border border-[var(--kw-border)] bg-[var(--kw-bg)]"
                                >
                                    <span className="text-lg leading-none mt-0.5">{meta.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[var(--kw-text-strong)]">{meta.label}</p>
                                        <p className="text-xs text-[var(--kw-text-muted)]">{meta.desc}</p>
                                    </div>
                                    <Check size={14} className="mt-1 flex-shrink-0" style={{ color: "var(--kw-brand)" }} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Disclaimer */}
                <div
                    className="flex items-start gap-2 p-3 rounded-xl border border-[var(--kw-border)]"
                    style={{ background: "var(--kw-brand-soft)" }}
                >
                    <AlertCircle size={14} className="mt-0.5 flex-shrink-0 text-[var(--kw-text-muted)]" />
                    <p className="text-xs text-[var(--kw-text-muted)] leading-relaxed">
                        Bằng cách cho phép, bạn đồng ý chia sẻ thông tin trên với{" "}
                        <span className="font-semibold text-[var(--kw-text-strong)]">{clientName}</span>. Bạn có thể thu hồi quyền bất kỳ lúc nào.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button onClick={() => onConfirm(scopes)} disabled={isLoading} className={btnPrimary}>
                        {isLoading
                            ? <><Loader2 size={18} className="animate-spin" /> Đang xử lý…</>
                            : <><Check size={18} /> Cho phép truy cập</>}
                    </Button>

                    <Button
                        onClick={onDeny}
                        disabled={isLoading}
                        className="w-full py-5 rounded-xl font-semibold border border-[var(--kw-border)] text-[var(--kw-text-strong)] bg-transparent hover:bg-[var(--kw-bg3)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Từ chối
                    </Button>
                </div>

            </div>
        </div>
    );
}