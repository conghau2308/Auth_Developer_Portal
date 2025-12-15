"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { CopyButton } from "./copy-button";

export function SecretField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>

      <div className="flex items-center gap-2">
        <Input
          type={visible ? "text" : "password"}
          value={value}
          readOnly
          className="font-mono"
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setVisible(!visible)}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>

        <CopyButton value={value} />
      </div>
    </div>
  );
}
