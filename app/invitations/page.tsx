import { Suspense } from "react";
import InvitationContent from "./invitation-content";

export default function InvitationPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <InvitationContent />
        </Suspense>
    );
}