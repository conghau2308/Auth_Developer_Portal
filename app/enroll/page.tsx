"use client";

import { registerClientService } from "@/api/enrollService";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { ReadonlyField } from "@/components/layout/normal-field";
import { SecretField } from "@/components/layout/secret-field";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const Enroll = () => {
  const [appName, setAppName] = useState<string>("");
  const [redirectUri, setRedirectUri] = useState<string>("");
  const [result, setResult] = useState<{
    client_id: string;
    client_secret: string;
  } | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const authorizationEndpoint =
    process.env.NEXT_PUBLIC_OAUTH_AUTHORIZATION_ENDPOINT ||
    "http://localhost:3000/oauth/signin";

  const handleEnroll = async () => {
    // Validate input
    if (!appName.trim() || !redirectUri.trim()) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data: response, error: serviceError } =
        await registerClientService({
          appName: appName,
          redirectUris: [redirectUri],
        });

      // Nếu có lỗi từ service
      if (serviceError) {
        let errorMessage = "";

        if (serviceError.includes("401")) {
          errorMessage =
            "Chưa đăng nhập hoặc phiên làm việc hết hạn. Vui lòng đăng nhập lại.";
        } else if (serviceError.includes("400")) {
          errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
        } else if (serviceError.includes("403")) {
          errorMessage = "Bạn không có quyền thực hiện thao tác này.";
        } else if (serviceError.includes("500")) {
          errorMessage = "Lỗi máy chủ. Vui lòng thử lại sau.";
        } else {
          errorMessage = serviceError;
        }

        setError(errorMessage);
        toast.error("Đăng ký Client thất bại", {
          description: errorMessage,
        });
        return;
      }

      // Kiểm tra response có client_id và client_secret không
      if (response && response.client_id && response.client_secret) {
        console.log("✅ Đăng ký thành công:", response);
        setResult(response);
        setOpen(true);

        // Hiển thị toast success
        toast.success("Đăng ký Client thành công", {
          description: "Vui lòng lưu lại thông tin Client ID và Client Secret",
        });

        // Reset form
        setAppName("");
        setRedirectUri("");
      } else {
        const errorMsg = "Đăng ký không thành công. Vui lòng thử lại.";
        setError(errorMsg);
        toast.error("Đăng ký Client thất bại", {
          description: errorMsg,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Fallback cho unexpected errors
      console.error("❌ Unexpected error:", error);
      const errorMsg = "Có lỗi không mong muốn xảy ra. Vui lòng thử lại.";
      setError(errorMsg);
      toast.error("Đăng ký Client thất bại", {
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Enroll application with Authorization Service</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEnroll();
              }}
            >
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <label>App name</label>
                  <Input
                    required
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <label>RedirectUri</label>
                  <Input
                    required
                    value={redirectUri}
                    onChange={(e) => setRedirectUri(e.target.value)}
                    disabled={loading}
                    placeholder="http://localhost:3000/callback"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              onClick={handleEnroll}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Enroll"}
            </Button>
          </CardFooter>
        </Card>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Client Registered Successfully!
              </AlertDialogTitle>
              <AlertDialogDescription>
                Ứng dụng của bạn đã được đăng ký thành công.
                <br />
                Dưới đây là thông tin xác thực:
              </AlertDialogDescription>

              <div className="mt-4 p-4 rounded-md bg-gray-100 space-y-4">
                <ReadonlyField
                  label="Client ID"
                  value={result?.client_id ?? ""}
                />

                <SecretField
                  label="Client Secret"
                  value={result?.client_secret ?? ""}
                />

                <ReadonlyField
                  label="Authorization Endpoint"
                  value={authorizationEndpoint}
                />
              </div>

              <AlertDialogDescription className="text-left text-yellow-600 mt-2">
                ⚠️ Hãy lưu lại thông tin này — bạn sẽ không thể xem lại sau!
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setOpen(false)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Footer />
    </div>
  );
};

export default Enroll;
