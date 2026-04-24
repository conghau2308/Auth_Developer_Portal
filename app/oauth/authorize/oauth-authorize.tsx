"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useOAuthValidate } from "@/hooks/use-oauth";
import { useAuthorize, useAuthorizeConsent } from "@/hooks/use-oauth";
import { PageShell } from "@/components/oauth/page-shell";
import { LoginFlow } from "@/components/oauth/login-flow";
import { AccountSelector } from "@/components/oauth/account-selector";
import { AuthorizeScreen } from "@/components/oauth/authorize-screen";
import { ErrorScreen } from "@/components/oauth/error-screen";

type OAuthScreen = "account-select" | "login" | "authorize";

export default function OAuthAuthorizeContent() {
  const searchParams = useSearchParams();

  const client_id = searchParams.get("client_id") ?? "";
  const redirect_uri = searchParams.get("redirect_uri") ?? "";
  const response_type = searchParams.get("response_type") ?? "";
  const scope = searchParams.get("scope") ?? "";
  const state = searchParams.get("state") ?? "";
  const nonce = searchParams.get("nonce") ?? "";
  const code_challenge = searchParams.get("code_challenge") ?? "";
  const code_challenge_method = searchParams.get("code_challenge_method") ?? "";

  const oauthParams = {
    client_id, redirect_uri, response_type,
    scope, state, nonce, code_challenge, code_challenge_method,
  };

  // ── Data fetching ──
  const { data: authData, isLoading: authLoading } = useAuth();
  const {
    data: validateData,
    isLoading: validateLoading,
    isError: validateError,
  } = useOAuthValidate(oauthParams);

  // ── Screen state ──
  // Chỉ dùng cho trường hợp cần consent sau khi authorize
  const [screen, setScreen] = useState<OAuthScreen | null>(null);
  const [pendingScopes, setPendingScopes] = useState<string[]>([]);

  // ── Authorize mutation — dùng chung cho cả 2 case (sau login và sau chọn account) ──
  const authorize = useAuthorize((scopes) => {
    setPendingScopes(scopes);
    setScreen("authorize");
  });

  const authorizeConsent = useAuthorizeConsent();

  // ── Handlers ──
  const handleAuthorize = () => {
    authorize.mutate(oauthParams);
  };

  // Sau khi login xong → gọi authorize luôn, không qua AccountSelector
  const handleLoginSuccess = () => {
    handleAuthorize();
  };

  const handleConsentConfirm = (scopes: string[]) => {
    authorizeConsent.mutate({ ...oauthParams, scope: scopes.join(" ") });
  };

  // ── Derived screen ──
  // Nếu screen được set manually (sau khi authorize trả về consent_required) → dùng đó
  // Nếu chưa → dựa vào authData
  const resolvedScreen: OAuthScreen = (() => {
    if (screen) return screen;
    if (authLoading) return "login";        // placeholder trong lúc loading
    return authData ? "account-select" : "login";
  })();

  // ── Guards ──
  const isLoading = authLoading || validateLoading;

  if (!client_id || validateError) {
    return (
      <PageShell>
        <ErrorScreen message="Client ID không hợp lệ hoặc ứng dụng không được phép." />
      </PageShell>
    );
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="loading-center">
          <Loader2 size={32} className="spinner-brand" />
          <p className="loading-text">Đang kiểm tra phiên đăng nhập…</p>
        </div>
      </PageShell>
    );
  }

  const clientName = validateData?.clientName ?? "Ứng dụng";
  const scopes = validateData?.scopes ?? [];
  const user = { name: authData?.name ?? "", email: authData?.email ?? "" };

  return (
    <PageShell clientName={clientName} clientUrl={validateData?.clientHomepageUrl}>

      {/* Chưa đăng nhập → form login, sau login gọi authorize luôn */}
      {resolvedScreen === "login" && (
        <LoginFlow onSuccess={handleLoginSuccess} />
      )}

      {/* Đã đăng nhập → chọn account, sau đó gọi authorize */}
      {resolvedScreen === "account-select" && authData && (
        <AccountSelector
          user={user}
          clientName={clientName}
          onSelect={handleAuthorize}
          onSwitchAccount={() => setScreen("login")}
        />
      )}

      {/* Backend trả consent_required=true → hiện màn hình cấp quyền */}
      {resolvedScreen === "authorize" && (
        <AuthorizeScreen
          user={user}
          clientName={clientName}
          clientIcon={validateData?.clientIcon}
          clientHomepageUrl={validateData?.clientHomepageUrl}
          scopes={pendingScopes.length > 0 ? pendingScopes : scopes}
          clientId={client_id}
          onConfirm={handleConsentConfirm}
          onDeny={() => setScreen(authData ? "account-select" : "login")}
          isLoading={authorizeConsent.isPending}
        />
      )}

    </PageShell>
  );
}