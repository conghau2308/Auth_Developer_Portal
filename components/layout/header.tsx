"use client";

import { Loader2, Lock } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAccessTokenByRefreshToken, userLogout } from "@/api/enrollService";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/store/useAuthStore";

const Header = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isLogin, isAuthChecked, setIsLogin, setAuthChecked } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getAccessTokenByRefreshToken();

        if (response.success) {
          setIsLogin(true);
        } else {
          setIsLogin(false);
        }
      } catch {
        setIsLogin(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await userLogout();

      console.log(response);

      if (response.success) {
        toast.success("Đăng xuất thành công");
        setIsLogin(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Đăng xuất thất bại", {
        description: error?.message || "Không thể kết nối đến server",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-200">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push("/home")}
      >
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
        {!isAuthChecked ? (
          <Loader2 className="animate-spin w-4 h-4 text-slate-500" />
        ) : isLogin ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                Đăng xuất
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng hệ thống.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 /> : "Đăng xuất"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/auth")}
          >
            Đăng nhập
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
