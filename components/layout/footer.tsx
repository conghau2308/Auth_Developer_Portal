import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 py-10 gap-6 max-w-screen-2xl mx-auto">
        <div className="text-muted-foreground text-xs tracking-wide">
          © 2024 Ethereal Sentinel. Encrypted End-to-End.
        </div>
        <div className="flex gap-8">
          {["Twitter", "GitHub", "Discord", "Contact Support"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors text-xs tracking-wide opacity-80 hover:opacity-100"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}