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
} from "lucide-react";

const BACKEND_URL = "http://localhost:8080";

const OAuthLoginPage = () => {
  const searchParams = useSearchParams();
  const webcamRef = useRef<Webcam>(null);

  // OAuth parameters từ URL
  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const scope = searchParams.get("scope") || "openid profile";
  const responseType = searchParams.get("response_type") || "code";
  const state = searchParams.get("state");
  const nonce = searchParams.get("nonce");
  const codeChallenge = searchParams.get("code_challenge");
  const codeChallengeMethod = searchParams.get("code_challenge_method");

  // UI state
  const [username, setUsername] = useState<string>("");
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Validation state
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

  // Auth state
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  /**
   * STEP 1: Validate OAuth parameters khi page load
   */
  useEffect(() => {
    const validateOAuth = async () => {
      // Kiểm tra required parameters
      if (!clientId || !redirectUri) {
        setValidationError({
          error: "invalid_request",
          description:
            "Missing required parameters: client_id and redirect_uri",
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
        if (codeChallengeMethod)
          params.append("code_challenge_method", codeChallengeMethod);

        const response = await fetch(
          `${BACKEND_URL}/oauth2/authorize/validate?${params.toString()}`
        );

        const data = await response.json();

        if (!response.ok || !data.valid) {
          // Có lỗi validation
          setValidationError({
            error: data.error,
            description: data.error_description,
            shouldRedirect: data.should_redirect || false,
            redirectUrl: data.redirect_url,
          });
        } else {
          // Validation thành công
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
  }, [
    clientId,
    redirectUri,
    scope,
    responseType,
    state,
    nonce,
    codeChallenge,
    codeChallengeMethod,
  ]);

  /**
   * STEP 2: Auto-redirect nếu có lỗi và shouldRedirect = true
   */
  useEffect(() => {
    if (validationError?.shouldRedirect && validationError.redirectUrl) {
      // Đợi 3 giây để user đọc lỗi, sau đó redirect
      // const timer = setTimeout(() => {
      //   window.location.href = validationError.redirectUrl!;
      // }, 3000);
      // return () => clearTimeout(timer);
    }
  }, [validationError]);

  /**
   * STEP 3: Handle face capture
   */
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

  /**
   * STEP 4: Handle authentication
   */
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
        // Authentication thành công - redirect về client
        window.location.href = data.redirect_url;
      } else {
        // Authentication thất bại
        setAuthError(data.error_description || "Authentication failed");

        // Nếu là lỗi nghiêm trọng (không phải face auth failed), redirect
        if (data.error !== "access_denied" && data.redirect_url) {
          // setTimeout(() => {
          //   window.location.href = data.redirect_url;
          // }, 3000);
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthError("Network error. Please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const onPreLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      alert("Please enter username");
      return;
    }
    setIsDialogOpen(true);
    setImgSrc(null);
    setAuthError(null);
  };

  // Loading state
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

  // Error state - KHÔNG thể redirect
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
              Please contact the application developer if you believe this is an
              error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state - CÓ THỂ redirect
  // if (validationError && validationError.shouldRedirect) {
  //   return (
  //     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
  //       <Card className="w-full max-w-md border-t-4 border-t-orange-600">
  //         <CardHeader>
  //           <CardTitle className="text-xl text-orange-600 flex items-center gap-2">
  //             <AlertCircle />
  //             Authorization Error
  //           </CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <Alert>
  //             <AlertDescription>
  //               <strong>{validationError.error}</strong>
  //               <br />
  //               {validationError.description}
  //             </AlertDescription>
  //           </Alert>
  //           <p className="text-sm text-gray-600 mt-4">
  //             Redirecting you back to the application in 3 seconds...
  //           </p>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  // Main login UI
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
          <CardTitle className="text-xl">Login to your account</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onPreLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-50"
                  disabled={isAuthenticating}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-md"
                disabled={isAuthenticating}
              >
                <ShieldCheck className="mr-2 h-5 w-5" /> Continue with Face ID
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t bg-slate-50 py-4">
          <Button
            variant="link"
            className="text-slate-500 hover:text-red-600"
            onClick={() => {
              if (redirectUri && state) {
                const errorUrl = `${redirectUri}${
                  redirectUri.includes("?") ? "&" : "?"
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

      {/* Face Authentication Dialog */}
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
              // eslint-disable-next-line @next/next/no-img-element
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
