"use client";

import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Card, CardBody, CardHead } from "../ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UploadIcon = () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width={13} height={13}>
        <path d="M8 2v9M4 7l4-5 4 5" />
        <path d="M2 13h12" />
    </svg>
);

export function AvatarCard() {
    const { data: user } = useAuth();

    return (
        <Card>
            <CardHead
                title="Ảnh đại diện"
                description="Ảnh hiển thị trên profile và OAuth consent screen"
            />
            <CardBody>
                <div className="flex items-center gap-5">
                    {/* Avatar preview with hover overlay */}
                    <div
                        className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center shrink-0 overflow-hidden cursor-pointer group"
                        style={{
                            background: "linear-gradient(135deg, var(--ol-accent), #c084fc)",
                            border: "2px solid var(--ol-border2)",
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 800,
                            fontSize: 24,
                            color: "#fff",
                        }}
                        onClick={() => toast("Chức năng upload ảnh")}
                    >
                        <Avatar>
                            <AvatarImage src={user?.avatar || ""} alt="User Avatar" />
                            <AvatarFallback>
                                {(user?.name || "U").slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px] uppercase tracking-[0.05em] text-white"
                            style={{
                                background: "rgba(0,0,0,0.6)",
                                fontFamily: "'IBM Plex Mono', monospace",
                            }}
                        >
                            Thay đổi
                        </div>
                    </div>

                    {/* Info + actions */}
                    <div>
                        <p className="text-[13px] font-medium mb-1.5" style={{ color: "#e8e8ed" }}>
                            {user?.name || "Unknown User"}
                        </p>
                        <p className="text-[12px] mb-3" style={{ color: "var(--ol-muted)" }}>
                            JPG, PNG tối đa 2MB. Khuyến nghị 400×400px.
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => toast("Chức năng upload ảnh")}>
                                <UploadIcon />
                                Upload ảnh
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => toast("Đã xóa ảnh")}>
                                Xóa
                            </Button>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}