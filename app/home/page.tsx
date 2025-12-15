"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, Code2, Users, ArrowRight, Lock } from "lucide-react"; // Import icon
import { useRouter } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getAccessTokenByRefreshToken } from "@/api/enrollService";

const HomePage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const response = await getAccessTokenByRefreshToken();

        if (response.success) {
          setIsLogin(true);
        }
      } catch (error) {
        console.log("Get accesstoken by refreshtoken failed:", error);
      }
    };
    getAccessToken();
  }, []);

  const handleAppEnroll = () => {
    if (!isLogin) {
      router.push("/auth");
      return;
    }
    router.push("/enroll");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 space-y-12">
        {/* Text Intro */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
            Bảo mật danh tính <br />
            <span className="text-blue-600">Đơn giản hóa ủy quyền</span>
          </h1>
          <p className="text-lg text-slate-600 md:text-xl leading-relaxed">
            Nền tảng xác thực tập trung an toàn, nhanh chóng và tuân thủ chuẩn
            OAuth2/OIDC cho ứng dụng hiện đại.
          </p>
        </div>
        {/* --- SELECTION AREA (User vs Client) --- */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Card cho User */}
          <Card className="hover:shadow-lg transition-shadow border-slate-200 justify-between">
            <CardHeader>
              <div className="mb-2 w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl">Người dùng cá nhân</CardTitle>
              <CardDescription>
                Quản lý hồ sơ, bảo mật tài khoản và kiểm soát quyền truy cập của
                các ứng dụng bên thứ ba.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full gap-2 group cursor-pointer"
                size="lg"
                onClick={() => router.push("/user-enroll")}
              >
                Đăng ký Người dùng
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Card cho Developer/Client */}
          <Card className="hover:shadow-lg transition-shadow border-slate-200 justify-between">
            <CardHeader>
              <div className="mb-2 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Code2 className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl">Nhà phát triển (Client)</CardTitle>
              <CardDescription>
                Đăng ký ứng dụng OAuth2, lấy API Key, quản lý Redirect URI và
                cấu hình bảo mật.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full gap-2 group border-blue-200 text-blue-700 hover:bg-blue-50 cursor-pointer"
                size="lg"
                onClick={handleAppEnroll}
              >
                Đăng ký Ứng dụng
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* --- FEATURES MINI SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-8 border-t border-slate-100 w-full max-w-5xl">
          <div className="space-y-2">
            <ShieldCheck className="w-8 h-8 mx-auto text-slate-400" />
            <h3 className="font-semibold text-slate-900">Chuẩn bảo mật cao</h3>
            <p className="text-sm text-slate-500">
              Hỗ trợ đầy đủ PKCE, OpenID Connect.
            </p>
          </div>
          <div className="space-y-2">
            <Lock className="w-8 h-8 mx-auto text-slate-400" />
            <h3 className="font-semibold text-slate-900">Single Sign-On</h3>
            <p className="text-sm text-slate-500">
              Đăng nhập một lần, truy cập mọi nơi.
            </p>
          </div>
          <div className="space-y-2">
            <Code2 className="w-8 h-8 mx-auto text-slate-400" />
            <h3 className="font-semibold text-slate-900">Dễ dàng tích hợp</h3>
            <p className="text-sm text-slate-500">
              SDK hỗ trợ React, Next.js, Java...
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
