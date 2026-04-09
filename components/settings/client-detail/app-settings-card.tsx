"use client";

import { useState } from "react";
import { Card, CardBody, CardFooter, CardHead } from "../ui/card";
import { FormRow, Input } from "../ui/form-row";
import { Button } from "@/components/ui/button";
import { ClientCredentialsResponseDto } from "@/types/api.types";
import { useUpdateClient } from "@/hooks/use-developer";

interface AppSettingsCardProps {
    app: ClientCredentialsResponseDto;
}

export function AppSettingsCard({ app }: AppSettingsCardProps) {
    const { mutate: updateClient, isPending } = useUpdateClient(app.id);

    const [clientName, setClientName] = useState(app.clientName ?? "");
    const [redirectUri, setRedirectUri] = useState(app.redirectUri ?? "");

    const isUnchanged = clientName === app.clientName && redirectUri === app.redirectUri;

    const handleSave = () => {
        updateClient({ clientName, redirectUri });
    };

    return (
        <Card>
            <CardHead title="Cài đặt ứng dụng" />
            <CardBody>
                <FormRow label="Tên ứng dụng" required>
                    <Input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                    />
                </FormRow>
                <FormRow label="Homepage URL">
                    <Input
                        type="url"
                        value={app.clientHomePageUrl ?? ""}
                        readOnly
                    />
                </FormRow>
                <FormRow
                    label="Redirect URI"
                    required
                    hint="Chỉ chấp nhận các URI đã đăng ký. Phân cách nhiều URI bằng dòng mới."
                >
                    <Input
                        type="url"
                        value={redirectUri}
                        onChange={(e) => setRedirectUri(e.target.value)}
                    />
                </FormRow>
                <FormRow
                    label="Icon URL"
                    hint="Hiển thị trên consent screen. Kích thước tối thiểu 64×64px."
                >
                    <Input
                        type="url"
                        value={app.clientIcon ?? ""}
                        readOnly
                    />
                </FormRow>
            </CardBody>
            <CardFooter note="Thay đổi có hiệu lực ngay lập tức.">
                <Button
                    variant="default"
                    size="sm"
                    onClick={handleSave}
                    disabled={isPending || isUnchanged}
                >
                    {isPending ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
            </CardFooter>
        </Card>
    );
}