"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

interface ErrorScreenProps {
    message: string;
}

export function ErrorScreen({ message }: ErrorScreenProps) {
    return (
        <div className="space-y-6">
            <div className="bg-card rounded-[2rem] p-8 shadow-2xl flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle size={28} className="text-destructive" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-foreground">Yêu cầu không hợp lệ</h2>
                    <p className="text-sm text-muted-foreground mt-1">{message}</p>
                </div>
                <Link
                    href="/"
                    className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
}