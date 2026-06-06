import Link from "next/link";
import { ScanFace, Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative w-full border-t border-slate-200 dark:border-border bg-white dark:bg-card pt-20 pb-8 overflow-hidden">
      {/* Đường viền phát sáng nhẹ ở cạnh trên để tạo cảm giác công nghệ */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6 md:px-8">
        {/* Top Grid - Chia cột */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8 mb-16">

          {/* Brand Column (Cột logo và thông tin chính) */}
          <div className="md:col-span-2 pr-4">
            <Link href="/" className="inline-flex items-center gap-2 mb-5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 group-hover:shadow-[0_0_15px_var(--kw-brand-soft)] transition-all">
                <ScanFace size={18} className="text-primary" />
              </div>
              <span className="text-xl font-black text-strong tracking-tight">WiFaKey</span>
            </Link>
            <p className="text-[14px] text-body dark:text-muted-foreground leading-relaxed max-w-xs mb-6 font-medium">
              Drop-in biometric OAuth for your app. One face scan replaces every credential.
            </p>
            {/* System Status Ping */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-slate-50 dark:bg-muted/30 border border-slate-200 dark:border-border text-[12px] font-bold text-strong transition-colors hover:border-primary/30 shadow-sm">
              <span className="w-2 h-2 rounded-full status-online" />
              All systems operational
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-1">
            <h4 className="text-[13px] font-extrabold text-strong tracking-[0.05em] uppercase mb-5">Product</h4>
            <ul className="flex flex-col gap-3.5 text-[14px] font-medium text-body dark:text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Liveness 2.0</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Zero-knowledge</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Enterprise</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-1">
            <h4 className="text-[13px] font-extrabold text-strong tracking-[0.05em] uppercase mb-5">Developers</h4>
            <ul className="flex flex-col gap-3.5 text-[14px] font-medium text-body dark:text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">SDKs</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Open Source</Link></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div className="md:col-span-1">
            <h4 className="text-[13px] font-extrabold text-strong tracking-[0.05em] uppercase mb-5">Company</h4>
            <ul className="flex flex-col gap-3.5 text-[14px] font-medium text-body dark:text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Row - Copyright & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 dark:border-border gap-4">
          <div className="text-[13px] font-medium text-body dark:text-muted-foreground">
            © 2026 WiFaKey Inc. Encrypted End-to-End.
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-body dark:text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
              <Twitter size={18} />
            </Link>
            <Link href="#" className="text-body dark:text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
              <Github size={18} />
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-border mx-1" />
            <Link href="#" className="text-[13px] font-bold text-body dark:text-muted-foreground hover:text-strong transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-[13px] font-bold text-body dark:text-muted-foreground hover:text-strong transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}