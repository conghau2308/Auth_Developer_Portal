"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

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
            <div className="px-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Chọn tài khoản</p>
                <h2 className="text-foreground font-bold text-lg">Tiếp tục đến {clientName}</h2>
            </div>

            <div className="bg-card rounded-[2rem] p-8 shadow-2xl space-y-6">
                <button
                    onClick={onSelect}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                >
                    <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                        {getInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email} · Đã đăng nhập</p>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">hoặc</span>
                    <div className="flex-1 h-px bg-border" />
                </div>

                <Button
                    variant="outline"
                    onClick={onSwitchAccount}
                    className="w-full py-5 rounded-xl border-border text-foreground font-semibold"
                >
                    Dùng tài khoản khác
                </Button>
            </div>
        </div>
    );
}