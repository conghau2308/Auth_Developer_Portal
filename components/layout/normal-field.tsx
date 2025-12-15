import { Input } from "@/components/ui/input";
import { CopyButton } from "./copy-button";

export function ReadonlyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>

      <div className="flex items-center gap-2">
        <Input value={value} readOnly className="font-mono" />
        <CopyButton value={value} />
      </div>
    </div>
  );
}
