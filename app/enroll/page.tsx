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
import { useState } from "react";

const Enroll = () => {
  const [appName, setAppName] = useState<string>("");
  const [redirectUri, setRedirectUri] = useState<string>("");
  const [result, setResult] = useState<{
    clientId: string;
    clientSecret: string;
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
              <strong>Client ID:</strong> {result?.clientId}
              <br />
              <strong>Client Secret:</strong> {result?.clientSecret}
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
  );
};

export default Enroll;
