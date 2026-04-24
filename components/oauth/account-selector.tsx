"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface AccountSelectorProps {
    user: { name: string; email: string };
    clientName: string;
    onSelect: () => void;
    onSwitchAccount: () => void;
}

function getInitials(name: string) {
    return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export function AccountSelector({
    user, clientName, onSelect, onSwitchAccount,
}: AccountSelectorProps) {
    return (
        <div className="space-y-6">

            {/* Eyebrow + title — cùng pattern các screen khác */}
            <div className="px-1">
                <p
                    className="text-[10px] uppercase font-bold text-[var(--kw-brand)]"
                    style={{ letterSpacing: "0.2em" }}
                >
                    Chọn tài khoản
                </p>
                <h2 className="font-bold text-lg text-[var(--kw-text-strong)]">
                    Tiếp tục đến {clientName}
                </h2>
            </div>

            {/* Card */}
            <div className="bg-[var(--kw-bg2)] rounded-[2rem] p-8 shadow-2xl space-y-6">

                {/* Account row */}
                <Button
                    onClick={onSelect}
                    className="w-full flex items-center gap-4 p-10 rounded-2xl border border-[var(--kw-border)] hover:border-[var(--kw-brand-glow)] hover:bg-[var(--kw-brand-soft)] transition-all group text-left cursor-pointer"
                >
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={{ background: "var(--kw-brand-soft)", color: "var(--kw-brand)" }}
                    >
                        {getInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--kw-text-strong)] truncate">{user.name}</p>
                        <p className="text-xs text-[var(--kw-text-muted)]">{user.email} · Đã đăng nhập</p>
                    </div>
                    <ChevronRight
                        size={18}
                        className="transition-colors text-[var(--kw-text-muted)] group-hover:text-[var(--kw-brand)]"
                    />
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[var(--kw-border)]" />
                    <span className="text-xs text-[var(--kw-text-muted)]">hoặc</span>
                    <div className="flex-1 h-px bg-[var(--kw-border)]" />
                </div>

                {/* Switch account — outline, không dùng btn-brand-gradient */}
                <Button
                    onClick={onSwitchAccount}
                    className="w-full py-5 rounded-xl font-semibold border border-[var(--kw-border)] text-[var(--kw-text-strong)] bg-transparent hover:bg-[var(--kw-bg3)] transition-colors cursor-pointer"
                >
                    Dùng tài khoản khác
                </Button>

            </div>
        </div>
    );
}