import Link from "next/link";

const links = ["Privacy Policy", "Security Whitepaper", "Terms of Service", "Compliance"];

export function AuthFooter() {
    return (
        <footer className="w-full py-12 border-t border-border bg-card">
            <div className="flex flex-col md:flex-row justify-between items-center px-8 gap-4 w-full max-w-7xl mx-auto">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    © 2024 The Obsidian Lens. Secure Biometric Auth.
                </div>
                <div className="flex gap-6">
                    {links.map((item) => (
                        <Link
                            key={item}
                            href="#"
                            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}