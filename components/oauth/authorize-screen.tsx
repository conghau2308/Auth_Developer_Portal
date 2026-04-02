"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { useAuthorize } from "@/hooks/use-oauth";

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
    onConfirm: (scopes: string[]) => void;   // ← delegate lên page
    onDeny: () => void;
    isLoading?: boolean;
}

export function AuthorizeScreen({
    user, clientName, clientIcon, clientHomepageUrl,
    scopes, clientId, onConfirm, onDeny, isLoading,
}: AuthorizeScreenProps) {
    return (
        <div className="space-y-6">
            <div className="px-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Yêu cầu quyền truy cập</p>
                <h2 className="text-foreground font-bold text-lg">{clientName} muốn truy cập tài khoản của bạn</h2>
            </div>

            <div className="bg-card rounded-[2rem] p-8 shadow-2xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    {clientIcon ? (
                        <img src={clientIcon} alt={clientName} className="w-14 h-14 rounded-2xl object-cover border border-border" />
                    ) : (
                        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-2xl border border-border">🔐</div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-foreground text-lg leading-tight">{clientName}</p>
                            {clientHomepageUrl && (
                                <a href={clientHomepageUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    <ExternalLink size={13} />
                                </a>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">Đang yêu cầu quyền từ {user.email}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                        {getInitials(user.name)}
                    </div>
                </div>

                {/* Scopes */}
                <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Quyền được yêu cầu</p>
                    <div className="space-y-2">
                        {scopes.map((scope) => {
                            const meta = scopeMeta(scope);
                            return (
                                <div key={scope} className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border">
                                    <span className="text-lg leading-none mt-0.5">{meta.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground">{meta.label}</p>
                                        <p className="text-xs text-muted-foreground">{meta.desc}</p>
                                    </div>
                                    <Check size={14} className="text-primary mt-1 flex-shrink-0" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/30 border border-border">
                    <AlertCircle size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Bằng cách cho phép, bạn đồng ý chia sẻ thông tin trên với{" "}
                        <span className="font-semibold text-foreground">{clientName}</span>. Bạn có thể thu hồi quyền bất kỳ lúc nào.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button onClick={() => onConfirm(scopes)} disabled={isLoading}>
                        {isLoading
                            ? <><Loader2 size={18} className="animate-spin" /> Đang xử lý…</>
                            : <><Check size={18} /> Cho phép truy cập</>}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onDeny}
                        disabled={isLoading}
                        className="w-full py-5 rounded-xl border-border text-foreground font-semibold"
                    >
                        Từ chối
                    </Button>
                </div>
            </div>
        </div>
    );
}