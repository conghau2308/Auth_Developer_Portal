"use client";

import { userEnrollService } from "@/api/enrollService";
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
import { toast } from "sonner";

const UserEnrollPage = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnroll = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // ✅ tránh reload form
    setLoading(true);

    try {
      const response = await userEnrollService(username, name, email);

      if (response.success) {
        toast.success("Enroll thành công 🎉", {
          description:
            response.message || "Tài khoản đã được đăng ký với WiFaKey",
        });

        // (optional) reset form
        setUsername("");
        setName("");
        setEmail("");
      } else {
        toast.error("Enroll thất bại ❌", {
          description: response.message || "Vui lòng thử lại",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Có lỗi xảy ra ❌", {
        description: error?.message || "Không thể enroll",
      });
    } finally {
      setLoading(false);
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
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Enroll with WiFaKey</CardTitle>
          </CardHeader>

          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <label>Username</label>
                  <Input
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <label>Name</label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <label>Email</label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              onClick={handleEnroll}
              disabled={loading}
            >
              {loading ? "Enrolling..." : "Enroll"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserEnrollPage;
