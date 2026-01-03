"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Camera,
  RefreshCcw,
  Check,
  ShieldCheck,
  ArrowLeft,
  Lock,
  AlertCircle,
  User,
  Plus,
  LogOut,
} from "lucide-react";

const BACKEND_URL = "https://uninherited-todd-febriferous.ngrok-free.dev";

interface SavedAccount {
  username: string;
  name?: string;
  lastUsed: number;
}

const OAuthLoginPage = () => {
  const searchParams = useSearchParams();
  const webcamRef = useRef<Webcam>(null);

  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const scope = searchParams.get("scope") || "openid profile";
  const responseType = searchParams.get("response_type") || "code";
  const state = searchParams.get("state");
  const nonce = searchParams.get("nonce");
  const codeChallenge = searchParams.get("code_challenge");
  const codeChallengeMethod = searchParams.get("code_challenge_method");

  const [currentView, setCurrentView] = useState<"picker" | "manual">("picker");
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [username, setUsername] = useState<string>("");
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState<{
    error: string;
    description: string;
    shouldRedirect: boolean;
    redirectUrl?: string;
  } | null>(null);
  const [clientInfo, setClientInfo] = useState<{
    clientName: string;
    scopes: string[];
  } | null>(null);

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  useEffect(() => {
    const accounts = localStorage.getItem("wifakey_accounts");
    if (accounts) {
      try {
        const parsed = JSON.parse(accounts);
        setSavedAccounts(parsed.sort((a: SavedAccount, b: SavedAccount) => b.lastUsed - a.lastUsed));
      } catch (e) {
        console.error("Failed to parse saved accounts", e);
      }
    }
  }, []);

  const saveAccount = (username: string, name?: string) => {
    const accounts = [...savedAccounts];
    const existingIndex = accounts.findIndex((a) => a.username === username);

    if (existingIndex >= 0) {
      accounts[existingIndex].lastUsed = Date.now();
      if (name) accounts[existingIndex].name = name;
    } else {
      accounts.push({
        username,
        name,
        lastUsed: Date.now(),
      });
    }

    setSavedAccounts(accounts.sort((a, b) => b.lastUsed - a.lastUsed));
    localStorage.setItem("wifakey_accounts", JSON.stringify(accounts));
  };

  const removeAccount = (username: string) => {
    const filtered = savedAccounts.filter((a) => a.username !== username);
    setSavedAccounts(filtered);
    localStorage.setItem("wifakey_accounts", JSON.stringify(filtered));
  };

  useEffect(() => {
    const validateOAuth = async () => {
      if (!clientId || !redirectUri) {
        setValidationError({
          error: "invalid_request",
          description: "Missing required parameters: client_id and redirect_uri",
          shouldRedirect: false,
        });
        setIsValidating(false);
        return;
      }

      try {
        const params = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          scope,
          response_type: responseType,
        });

        if (state) params.append("state", state);
        if (nonce) params.append("nonce", nonce);
        if (codeChallenge) params.append("code_challenge", codeChallenge);
        if (codeChallengeMethod) params.append("code_challenge_method", codeChallengeMethod);

        const response = await fetch(
          `${BACKEND_URL}/oauth2/authorize/validate?${params.toString()}`
        );

        const data = await response.json();

        if (!response.ok || !data.valid) {
          setValidationError({
            error: data.error,
            description: data.error_description,
            shouldRedirect: data.should_redirect || false,
            redirectUrl: data.redirect_url,
          });
        } else {
          setClientInfo({
            clientName: data.client_name,
            scopes: data.scopes,
          });
        }
      } catch (error) {
        console.error("Validation error:", error);
        setValidationError({
          error: "server_error",
          description: "Failed to validate OAuth request. Please try again.",
          shouldRedirect: false,
        });
      } finally {
        setIsValidating(false);
      }
    };

    validateOAuth();
  }, [clientId, redirectUri, scope, responseType, state, nonce, codeChallenge, codeChallengeMethod]);

  const trySSO = async (accountUsername: string) => {
    setIsAuthenticating(true);
    setAuthError(null);
    setSelectedAccount(accountUsername);

    try {
      const response = await fetch(`${BACKEND_URL}/oauth2/authenticate`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: accountUsername,
          clientId,
          redirectUri,
          scope,
          state,
          nonce,
          codeChallenge,
          codeChallengeMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.sso_used) {
          console.log("✅ SSO authentication successful");
        }

        saveAccount(accountUsername);
        window.location.href = data.redirect_url;
      } else {
        if (data.error === "access_denied" &&
          data.error_description?.includes("khuôn mặt")) {
          console.log("🔑 SSO expired, falling back to face auth");
          setUsername(accountUsername);
          setIsDialogOpen(true);
        } else {
          setAuthError(data.error_description || "Authentication failed");
        }
      }
    } catch (error) {
      console.error("SSO error:", error);
      setUsername(accountUsername);
      setIsDialogOpen(true);
    } finally {
      setIsAuthenticating(false);
      setSelectedAccount(null);
    }
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    }
  }, []);

  const retake = () => {
    setImgSrc(null);
    setAuthError(null);
  };

  const handleAuthenticate = async () => {
    if (!imgSrc || !username.trim()) {
      alert("Please provide username and face image");
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const base64Image = imgSrc.split(",")[1];

      const response = await fetch(`${BACKEND_URL}/oauth2/authenticate`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          image_b64: base64Image,
          clientId,
          redirectUri,
          scope,
          state,
          nonce,
          codeChallenge,
          codeChallengeMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        saveAccount(username.trim());
        window.location.href = data.redirect_url;
      } else {
        setAuthError(data.error_description || "Authentication failed");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthError("Network error. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const onManualLogin = () => {
    if (!username.trim()) {
      alert("Please enter username");
      return;
    }
    setIsDialogOpen(true);
    setImgSrc(null);
    setAuthError(null);
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Validating request...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (validationError && !validationError.shouldRedirect) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-t-4 border-t-red-600">
          <CardHeader>
            <CardTitle className="text-xl text-red-600 flex items-center gap-2">
              <AlertCircle />
              Authorization Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>
                <strong>{validationError.error}</strong>
                <br />
                {validationError.description}
              </AlertDescription>
            </Alert>
            <p className="text-sm text-gray-600 mt-4">
              Please contact the application developer if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center space-y-2">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              WiFaKey
            </span>
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-4">
          Authorize {clientInfo?.clientName}
        </h1>
        <p className="text-sm text-gray-600">
          Requested permissions: {clientInfo?.scopes.join(", ")}
        </p>
      </div>

      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-blue-600">
        <CardHeader>
          <CardTitle className="text-xl">
            {currentView === "picker" ? "Choose an account" : "Login to your account"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {currentView === "picker" && savedAccounts.length > 0 ? (
            <div className="space-y-3">
              {savedAccounts.map((account) => (
                <div
                  key={account.username}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer group relative"
                  onClick={() => !isAuthenticating && trySSO(account.username)}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {account.name || account.username}
                    </p>
                    <p className="text-sm text-slate-500 truncate">
                      {account.username}
                    </p>
                  </div>
                  {isAuthenticating && selectedAccount === account.username ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAccount(account.username);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-opacity"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCurrentView("manual")}
                disabled={isAuthenticating}
              >
                <Plus className="mr-2 h-4 w-4" /> Use another account
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onManualLogin()}
                  className="bg-slate-50"
                  disabled={isAuthenticating}
                />
              </div>
              <Button
                onClick={onManualLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-md"
                disabled={isAuthenticating}
              >
                <ShieldCheck className="mr-2 h-5 w-5" /> Continue with Face ID
              </Button>

              {savedAccounts.length > 0 && currentView === "manual" && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentView("picker")}
                  disabled={isAuthenticating}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to account selection
                </Button>
              )}
            </div>
          )}

          {authError && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t bg-slate-50 py-4">
          <Button
            variant="link"
            className="text-slate-500 hover:text-red-600"
            onClick={() => {
              if (redirectUri && state) {
                const errorUrl = `${redirectUri}${redirectUri.includes("?") ? "&" : "?"
                  }error=access_denied&error_description=User cancelled&state=${state}`;
                window.location.href = errorUrl;
              } else {
                window.close();
              }
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Cancel and return to{" "}
            {clientInfo?.clientName}
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Face Verification</AlertDialogTitle>
            <AlertDialogDescription>
              Please look directly at the camera to grant access to{" "}
              <b>{clientInfo?.clientName}</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col items-center justify-center min-h-[400px] bg-black rounded-md overflow-hidden relative">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                screenshotQuality={1}
                videoConstraints={{
                  width: { ideal: 1920 },
                  height: { ideal: 1080 },
                  facingMode: "user",
                }}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <AlertDialogFooter className="!flex !flex-col gap-3 !items-stretch">
            {!imgSrc ? (
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-center">
                <AlertDialogCancel
                  onClick={() => setIsDialogOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </AlertDialogCancel>
                <Button onClick={capture} className="w-full sm:w-auto">
                  <Camera className="mr-2 h-4 w-4" /> Take Photo
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-center">
                <Button
                  variant="outline"
                  onClick={retake}
                  disabled={isAuthenticating}
                  className="w-full sm:w-auto"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> Retake
                </Button>
                <Button
                  onClick={handleAuthenticate}
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                  disabled={isAuthenticating}
                >
                  {isAuthenticating ? (
                    "Authenticating..."
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Confirm and Log In
                    </>
                  )}
                </Button>
              </div>
            )}

            {authError && (
              <Alert variant="destructive" className="w-full mt-2">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OAuthLoginPage;
