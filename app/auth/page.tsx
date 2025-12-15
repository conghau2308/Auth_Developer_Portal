"use client";

import { userLogin } from "@/api/enrollService";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import {
  AlertDialog,
  AlertDialogCancel,
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
import { useAuthStore } from "@/store/useAuthStore";
import { Camera, RefreshCcw, Check, Loader2 } from "lucide-react"; // Import icon cho đẹp
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const router = useRouter();
  const { setIsLogin } = useAuthStore();

  // State quản lý việc mở Camera Modal
  const [isOpen, setIsOpen] = useState(false);
  // State lưu ảnh đã chụp (dạng base64 string)
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const webcamRef = useRef<Webcam>(null);

  // Hàm xử lý khi ấn nút "Login" ở form
  const onPreLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Chặn reload form
    if (!username.trim()) {
      toast.warning("Thiếu thông tin", {
        description: "Vui lòng điền đầy đủ Username.",
      });
      return;
    }
    // Mở Modal Camera
    setIsOpen(true);
    setImgSrc(null); // Reset ảnh cũ nếu có
  };

  // Hàm chụp ảnh từ Webcam
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  // Hàm chụp lại (nếu ảnh chưa ưng ý)
  const retake = () => {
    setImgSrc(null);
  };

  // Hàm gửi dữ liệu đi xác thực (gửi cả username và ảnh)
  const handleFinalLogin = async () => {
    if (!imgSrc) {
      toast.error("Chưa có ảnh", {
        description: "Vui lòng chụp ảnh khuôn mặt.",
      });
      return;
    }
    setIsLoading(true);

    const base64Image = imgSrc.split(",")[1];

    console.log("Base64 length:", base64Image.length);
    console.log("Base64 preview:", base64Image.slice(0, 30));

    try {
      console.log("Ảnh đã chụp:", imgSrc); // Debug xem ảnh base64

      const response = await userLogin(username, base64Image); // Giữ nguyên code cũ của bạn tạm thời

      console.log("response auth:", response)

      if (response?.success === true) {
        toast.success("Xác thực thành công", {
          description: response.message || "Đăng nhập thành công.",
        });
        setIsOpen(false); // Đóng modal
        setIsLogin(true);
        router.back();
      } else {
        toast.error("Xác thực thất bại", {
          description: response?.message || "Vui lòng thử lại",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error("Có lỗi xảy ra", {
        description: error?.message || "Không thể kết nối đến server",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onPreLogin}>
              <div>
                <div className="grid gap-2">
                  <label htmlFor="username">Username</label>
                  <Input
                    id="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              {/* Button Login trigger mở modal */}
              <Button type="submit" className="w-full cursor-pointer mt-4">
                Login with Face ID
              </Button>
            </form>
          </CardContent>
          <CardFooter>{/* Footer content if needed */}</CardFooter>
        </Card>
      </div>

      <Footer />

      {/* --- PHẦN MODAL CAMERA --- */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác thực khuôn mặt</AlertDialogTitle>
            <AlertDialogDescription>
              Vui lòng nhìn thẳng vào camera để xác thực danh tính.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col items-center justify-center min-h-[400px] bg-black rounded-md overflow-hidden relative">
            {imgSrc ? (
              // Nếu đã chụp, hiện ảnh tĩnh
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgSrc}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            ) : (
              // Nếu chưa chụp, hiện Webcam
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                screenshotQuality={1}
                videoConstraints={{
                  width: { ideal: 1920 },
                  height: { ideal: 1080 },
                  facingMode: "user", // Camera trước
                }}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <AlertDialogFooter className="sm:justify-center gap-2">
            {!imgSrc ? (
              <>
                <AlertDialogCancel
                  className="cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  Hủy
                </AlertDialogCancel>
                <Button
                  onClick={capture}
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  <Camera className="mr-2 h-4 w-4" /> Chụp ảnh
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={retake}
                  disabled={isLoading}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> Chụp lại
                </Button>
                <Button
                  onClick={handleFinalLogin}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Xác nhận & Đăng nhập
                    </>
                  )}
                </Button>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Login;
