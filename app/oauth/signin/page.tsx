import { Suspense } from "react";
import OAuthLoginPage from "./OAuthLoginClient";
import { Card, CardContent } from "@/components/ui/card";
import { Lock } from "lucide-react";

/**
 * Component Fallback: Hiển thị trong lúc chờ useSearchParams và Client Component hydrate
 */
function OAuthLoginFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Header giả lập để giữ chỗ */}
      <div className="mb-8 text-center space-y-2 opacity-50">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-slate-300 p-1.5 rounded-lg">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-400">
              WiFaKey
            </span>
          </div>
        </div>
        <div className="h-6 w-48 bg-slate-200 rounded mx-auto mt-4 animate-pulse"></div>
      </div>

      {/* Card Loading */}
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-slate-300">
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Loading Xoay vòng (Spinner) */}
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-slate-200"></div>
              <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>

            <p className="mt-4 text-slate-500 font-medium animate-pulse">
              Loading secure gateway...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Main Page Component
 */
export default function Page() {
  return (
    <Suspense fallback={<OAuthLoginFallback />}>
      <OAuthLoginPage />
    </Suspense>
  );
}
