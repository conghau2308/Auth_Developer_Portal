"use client";

import { registerClientService } from "@/api/enrollService";
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
import { Lock } from "lucide-react";
import { useState } from "react";

const Enroll = () => {
  const [appName, setAppName] = useState<string>("");
  const [redirectUri, setRedirectUri] = useState<string>("");
  const [result, setResult] = useState<{
    client_id: string;
    client_secret: string;
  } | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleEnroll = async () => {
    try {
      const response = await registerClientService({
        appName: appName,
        redirectUris: [redirectUri],
      });

      if (response) {
        console.log(response);
        setResult(response);
        setOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* --- HEADER / NAVBAR --- */}
      <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            WiFaKey
          </span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-blue-600">
            Giới thiệu
          </a>
          <a href="#" className="hover:text-blue-600">
            Tài liệu
          </a>
          <a href="#" className="hover:text-blue-600">
            Hỗ trợ
          </a>
        </nav>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm">
            Đăng nhập
          </Button>
        </div>
      </header>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Enroll application with Authorization Service</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <label>App name</label>
                  <Input
                    required
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label>RedirectUri</label>
                  <Input
                    required
                    value={redirectUri}
                    onChange={(e) => setRedirectUri(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" onClick={handleEnroll}>
              Enroll
            </Button>
          </CardFooter>
        </Card>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>
                🎉 Client Registered Successfully!
              </AlertDialogTitle>
              <AlertDialogDescription>
                Ứng dụng của bạn đã được đăng ký thành công.
                <br />
                Dưới đây là thông tin xác thực:
              </AlertDialogDescription>

              <div className="mt-4 p-3 rounded-md bg-gray-100 font-mono text-sm break-all">
                <strong>Client ID:</strong> {result?.client_id}
                <br />
                <strong>Client Secret:</strong> {result?.client_secret}
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
    </div>
  );
};

export default Enroll;
