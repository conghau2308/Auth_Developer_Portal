import Link from "next/link";
import { Info, Settings, ShieldCheck, Lock } from "lucide-react";
import { AuthorizeForm } from "@/components/oauth/authorize-form";
import { MobileNavBar } from "@/components/layout/mobile-navbar";

export default function AuthorizePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="w-full sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-card border-b border-border">
        <Link href="/" className="text-xl font-black tracking-tighter text-primary">
          Ethereal Sentinel
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {["Security", "Help"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-muted-foreground font-medium hover:text-foreground tracking-tight transition-colors duration-300"
            >
              {item}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
            <Info size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background ambient */}
        <div className="absolute inset-0 biometric-pulse pointer-events-none" />

        <div className="max-w-xl w-full flex flex-col gap-8 relative z-10">
          {/* Context header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Authorize with The Obsidian Lens
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border">
                <img
                  src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=64&q=80"
                  alt="App icon"
                  className="w-6 h-6 object-cover rounded"
                />
              </div>
              <p className="text-muted-foreground font-medium">
                <span className="text-foreground font-semibold not-italic">Application X</span>
                {" "}wants to access your profile
              </p>
            </div>
          </div>

          {/* Main card */}
          <AuthorizeForm />

          {/* Security badges */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: ShieldCheck, label: "Secure Biometric Node" },
              { icon: Lock, label: "End-to-End Encrypted" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="bg-muted/20 px-4 py-2 rounded-full flex items-center gap-2 border border-border"
              >
                <Icon size={16} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-semibold">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <MobileNavBar />
    </div>
  );
}