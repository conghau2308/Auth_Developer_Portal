import { NextRequest, NextResponse } from "next/server";

const REQUIRED_PARAMS = ["client_id", "redirect_uri", "response_type", "scope", "state", "nonce", "code_challenge", "code_challenge_method"];

export function proxy(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    const hasAllParams = REQUIRED_PARAMS.every((p) => searchParams.get(p));

    if (!hasAllParams) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

// Middleware chỉ chạy trên route này, không ảnh hưởng route khác
export const config = {
    matcher: ["/oauth/authorize"],
};