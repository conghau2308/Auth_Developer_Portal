"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardFooter, CardHead } from "../ui/card";
import { FormRow, Input, Select } from "../ui/form-row";
import { Button } from "@/components/ui/button";
import { useEnrollNewClient } from "@/hooks/use-developer";

export function NewAppForm() {
    const router = useRouter();
    const { mutate: enrollNewClient, isPending } = useEnrollNewClient();

    const [form, setForm] = useState({
        name: "",
        homepageUrl: "",
        redirectUri: "",
        clientType: "confidential",
    });

    const handleChange = (field: string, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = () => {
        enrollNewClient({
            clientName: form.name,
            redirectUri: form.redirectUri,
        });
    };

    return (
        <Card>
            <CardHead title="Thông tin ứng dụng" />
            <CardBody>
                <FormRow label="Tên ứng dụng" required hint="Hiển thị trên consent screen khi user cấp quyền.">
                    <Input
                        type="text"
                        placeholder="vd: My Awesome App"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                </FormRow>

                <FormRow label="Homepage URL" required>
                    <Input
                        type="url"
                        placeholder="https://myapp.example.com"
                        value={form.homepageUrl}
                        onChange={(e) => handleChange("homepageUrl", e.target.value)}
                    />
                </FormRow>

                <FormRow
                    label="Redirect URI"
                    required
                    hint="URI mà IdP sẽ redirect sau khi user xác thực. Phải khớp chính xác khi gửi request."
                >
                    <Input
                        type="url"
                        placeholder="https://myapp.example.com/callback"
                        value={form.redirectUri}
                        onChange={(e) => handleChange("redirectUri", e.target.value)}
                    />
                </FormRow>

                <FormRow
                    label="Loại client"
                    hint="Confidential client có thể lưu client_secret an toàn. Public client dùng PKCE thay thế."
                >
                    <Select
                        value={form.clientType}
                        onChange={(e) => handleChange("clientType", e.target.value)}
                    >
                        <option value="confidential">
                            Confidential — Server-side app (có backend)
                        </option>
                        <option value="public">Public — SPA / Mobile app (không có backend)</option>
                    </Select>
                </FormRow>
            </CardBody>

            <CardFooter>
                <div className="flex gap-2 ml-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => router.push("/settings/developer")}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        disabled={isPending}
                        onClick={handleSubmit}
                    >
                        {isPending ? "Đang đăng ký..." : "Đăng ký ứng dụng"}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}