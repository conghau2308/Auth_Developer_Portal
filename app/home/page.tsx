"use client";

import React from "react";
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

const HomePage = () => {
  const router = useRouter();
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

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 space-y-12">
        {/* Text Intro */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Bảo mật danh tính <br />
            <span className="text-blue-600">Đơn giản hóa ủy quyền</span>
          </h1>
          <p className="text-lg text-slate-600 md:text-xl leading-relaxed">
            Nền tảng xác thực tập trung an toàn, nhanh chóng và tuân thủ chuẩn
            OAuth2.0/OIDC cho ứng dụng hiện đại.
          </p>
        </div>
        {/* --- SELECTION AREA (User vs Client) --- */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Card cho User */}
          <Card className="hover:shadow-lg transition-shadow border-slate-200">
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
              <Button className="w-full gap-2 group cursor-pointer" size="lg" onClick={() => router.push("/user-enroll")}>
                Đăng ký Người dùng
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Card cho Developer/Client */}
          <Card className="hover:shadow-lg transition-shadow border-slate-200">
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
                className="w-full gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 cursor-pointer"
                size="lg"
                onClick={() => router.push("/auth")}
              >
                Đăng ký Ứng dụng
                <ArrowRight className="w-4 h-4" />
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

      {/* --- FOOTER --- */}
      <footer className="py-6 text-center text-sm text-slate-400 bg-white border-t border-slate-100">
        <p>
          &copy; {new Date().getFullYear()} WiFaKey Authentication Service. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
