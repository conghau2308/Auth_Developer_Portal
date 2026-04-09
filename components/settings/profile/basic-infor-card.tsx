"use client";

import { Card, CardBody, CardFooter, CardHead } from "../ui/card";
import { Button } from "../../ui/button";
import { FormGrid, FormRow, Input } from "../ui/form-row";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateProfile } from "@/hooks/use-user";
import { useEffect, useState } from "react";

export function BasicInfoCard() {
    const { data: user } = useAuth();
    const { mutate: updateProfile, isPending } = useUpdateProfile();
    const [name, setName] = useState(user?.name || "");

    useEffect(() => {
        if (user?.name) setName(user.name);
    }, [user?.name]);

    const handleSave = () => {
        updateProfile({ name });
    };

    return (
        <Card>
            <CardHead title="Thông tin cơ bản" description="Tên hiển thị và thông tin liên hệ" />
            <CardBody>
                <FormGrid>
                    <FormRow label="Họ và tên" required>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormRow>
                    <FormRow
                        label="Username"
                        hint="Username không thể thay đổi sau khi đăng ký."
                    >
                        <Input type="text" defaultValue={user?.name || ""} readOnly />
                    </FormRow>
                </FormGrid>
                <FormRow
                    label="Email"
                    hint="Email được sử dụng để xác thực, không thể thay đổi tại đây."
                >
                    <Input type="text" defaultValue={user?.email || ""} readOnly />
                </FormRow>
            </CardBody>
            <CardFooter note="Thay đổi sẽ được phản chiếu trên consent screen.">
                <Button
                    variant="default"
                    size="sm"
                    onClick={handleSave}
                    disabled={isPending || name === user?.name}
                >
                    {isPending ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
            </CardFooter>
        </Card>
    );
}