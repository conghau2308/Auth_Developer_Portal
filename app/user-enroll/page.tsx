"use client";

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Camera, Check, RefreshCcw, Loader2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { userEnrollService } from "@/api/enrollService";

const UserEnrollPage = () => {
  // Form states
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // --- CAMERA STATES & REF ---
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở modal
  const [imgSrc, setImgSrc] = useState<string | null>(null); // Ảnh đã chụp
  const webcamRef = useRef<Webcam>(null);
  // ---------------------------

  // BƯỚC 1: Xử lý khi ấn nút ở form chính (Kiểm tra thông tin trước khi mở camera)
  const onPreEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate cơ bản
    if (!username.trim() || !name.trim() || !email.trim()) {
      toast.warning("Thiếu thông tin", {
        description: "Vui lòng điền đầy đủ Username, Name và Email trước khi tiếp tục."
      });
      return;
    }
    // Mở modal camera và reset ảnh cũ
    setIsOpen(true);
    setImgSrc(null);
  };

  // --- CÁC HÀM CAMERA HELPER (tương tự trang Login) ---
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  };
  // --------------------------------------------------


  // BƯỚC 2: Hàm xử lý cuối cùng (Gọi API) khi ấn nút "Xác nhận" trong modal
  const handleFinalEnroll = async () => {
    if (!imgSrc) {
      toast.error("Chưa có ảnh", { description: "Vui lòng chụp ảnh khuôn mặt." });
      return;
    }

    setLoading(true);

    try {
      // Lấy chuỗi raw base64 (loại bỏ header data:image/...)
      const base64Image = imgSrc.split(",")[1];
      console.log(base64Image);

      // Gửi tất cả dữ liệu lên server
      const response = await userEnrollService(username, name, email, base64Image);

      console.log("Response: ", response);

      if (response.success) {
        toast.success("Enroll thành công", {
          description: response.message || "Tài khoản và dữ liệu khuôn mặt đã được lưu.",
        });

        // Reset form và đóng modal
        setIsOpen(false);
        setUsername("");
        setName("");
        setEmail("");
        setImgSrc(null);
      } else {
        toast.error("Enroll thất bại", {
          description: response.message || "Vui lòng thử lại",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Có lỗi xảy ra", {
        description: error?.message || "Không thể kết nối đến server",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <div className="flex items-center justify-center min-h-screen py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Enroll new User & Face ID</CardTitle>
          </CardHeader>

          <CardContent>
            {/* Form chính kích hoạt onPreEnroll khi submit */}
            <form onSubmit={onPreEnroll}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <label htmlFor="username">Username</label>
                  <Input
                    id="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="name">Name</label>
                  <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Nút này giờ chỉ mở modal, không loading ở đây */}
              <Button
                type="submit"
                className="w-full cursor-pointer mt-6 bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="mr-2 h-4 w-4" /> Tiếp tục: Chụp ảnh khuôn mặt
              </Button>
            </form>
          </CardContent>
          <CardFooter>
             {/* Footer content */}
          </CardFooter>
        </Card>
      </div>

      <Footer />

      {/* --- PHẦN MODAL CAMERA (Copy và điều chỉnh từ trang Login) --- */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Thu thập dữ liệu khuôn mặt</AlertDialogTitle>
            <AlertDialogDescription>
              Vui lòng giữ khuôn mặt ở giữa khung hình và nhấn chụp. Ảnh này sẽ được dùng để đăng nhập.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Vùng hiển thị Camera hoặc Ảnh đã chụp */}
          <div className="flex flex-col items-center justify-center min-h-[350px] bg-black rounded-md overflow-hidden relative mt-4">
            {imgSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgSrc}
                alt="Captured face"
                className="w-full h-full object-cover"
              />
            ) : (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                screenshotQuality={0.9} // Giảm chất lượng một chút cho nhẹ
                videoConstraints={{
                  facingMode: "user",
                  // Dùng độ phân giải vừa đủ để nhận diện, tránh gửi ảnh quá nặng
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                }}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
            {!imgSrc ? (
              // Trạng thái 1: Chưa chụp ảnh
              <>
                <AlertDialogCancel className="cursor-pointer" onClick={() => setIsOpen(false)}>
                  Hủy bỏ
                </AlertDialogCancel>
                <Button onClick={capture} className="cursor-pointer">
                  <Camera className="mr-2 h-4 w-4" /> Chụp ảnh
                </Button>
              </>
            ) : (
              // Trạng thái 2: Đã chụp ảnh, chờ xác nhận
              <>
                 {/* Nút chụp lại bị vô hiệu hóa khi đang loading */}
                <Button variant="outline" onClick={retake} disabled={loading} className="cursor-pointer">
                  <RefreshCcw className="mr-2 h-4 w-4" /> Chụp lại
                </Button>

                {/* Nút xác nhận cuối cùng, có trạng thái loading */}
                <Button
                  onClick={handleFinalEnroll}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 cursor-pointer min-w-[140px]"
                >
                  {loading ? (
                     <>
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...
                     </>
                  ) : (
                     <>
                       <Check className="mr-2 h-4 w-4" /> Xác nhận đăng ký
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

export default UserEnrollPage;