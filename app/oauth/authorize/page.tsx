import { Suspense } from "react";
import OAuthAuthorizeContent from "./oauth-authorize";

export default function InvitationPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <OAuthAuthorizeContent />
        </Suspense>
    );
}