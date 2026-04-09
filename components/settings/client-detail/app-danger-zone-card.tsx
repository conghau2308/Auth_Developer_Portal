"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHead } from "../ui/card";
import { Modal, ModalActions, ModalBody } from "../ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ClientCredentialsResponseDto } from "@/types/api.types";
import { useDeleteClient } from "@/hooks/use-developer";

interface AppDangerZoneCardProps {
    app: ClientCredentialsResponseDto;
}

export function AppDangerZoneCard({ app }: AppDangerZoneCardProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const deleteClient = useDeleteClient(app.id);

    const handleDelete = () => {
        deleteClient.mutate(undefined, {
            onSuccess: () => {
                setOpen(false);
                toast.success("Đã xóa OAuth App thành công.");
                router.push("/settings/developer")
            }
        });
    };

    return (
        <>
            <Card danger>
                <CardHead title="Vùng nguy hiểm" danger />
                <CardBody className="flex items-center justify-between">
                    <div>
                        <p className="text-[13.5px] font-medium" style={{ color: "#e8e8ed" }}>
                            Xóa ứng dụng
                        </p>
                        <p className="text-[12px] mt-0.5" style={{ color: "var(--ol-muted)" }}>
                            Xóa vĩnh viễn ứng dụng. Tất cả token liên quan sẽ bị thu hồi.
                        </p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
                        Xóa ứng dụng
                    </Button>
                </CardBody>
            </Card>

            <Modal open={open} onClose={() => setOpen(false)} title="Xóa OAuth App?">
                <ModalBody>
                    Ứng dụng{" "}
                    <strong style={{ color: "#e8e8ed" }}>{app.clientName}</strong> sẽ bị xóa vĩnh viễn.
                    {/* Tất cả token, secret và consent của{" "}
                    <strong style={{ color: "#e8e8ed" }}>{app.userCount} users</strong> sẽ bị thu
                    hồi ngay lập tức. */}
                </ModalBody>
                <ModalActions>
                    <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleteClient.isPending} // ← thêm vào
                    >
                        {deleteClient.isPending ? "Đang xóa..." : "Xác nhận xóa"}
                    </Button>
                </ModalActions>
            </Modal>
        </>
    );
}