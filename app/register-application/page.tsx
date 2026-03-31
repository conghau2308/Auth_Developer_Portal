"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import { registerAppSchema, defaultValues, type RegisterAppFormData } from "@/components/register-app/schema";
import AppDetailsSection from "@/components/register-app/app-details-section";
import ClientTypeSelector from "@/components/register-app/client-type-selector";
import AuthConfigSection from "@/components/register-app/auth-config-section";
import ScopesSection from "@/components/register-app/scopes-section";
import FormActions from "@/components/register-app/form-actions";
import { Navbar } from "@/components/layout/navbar";

/**
 * RegisterApplicationPage
 *
 * Single-page OAuth client registration form.
 * All four sections share a single react-hook-form context —
 * validation runs once on submit, error messages appear inline.
 *
 * POST /api/apps/register receives { appName, description,
 * clientType, redirectUris[], postLogoutUri, scopes[] }.
 */
export default function RegisterApplicationPage() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterAppFormData>({
    resolver: zodResolver(registerAppSchema),
    defaultValues,
  });

  async function onSubmit(data: RegisterAppFormData) {
    const res = await fetch("/api/apps/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      // TODO: surface server error via toast / error state
      console.error("Registration failed", await res.json());
      return;
    }

    // TODO: redirect to app dashboard or show client credentials
  }

  return (
    <div className="bg-background text-foreground font-body min-h-screen">
      {/* ── Decorative background pulse ── */}
      <Navbar />
      <div
        aria-hidden
        className="pointer-events-none fixed right-0 top-0 -z-10 h-[600px] w-[600px] translate-x-1/2 -translate-y-1/2"
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-[120px] opacity-20" />
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full text-primary/10"
        >
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <main className="mx-auto max-w-4xl px-6 pb-20 pt-24">
        {/* ── Page header ── */}
        <header className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary-foreground">
            <ShieldCheck size={14} className="fill-current" />
            Encrypted End-to-End
          </div>
          <h1 className="mb-4 font-headline text-5xl font-extrabold tracking-tight text-foreground md:text-6xl">
            Register Your{" "}
            <span className="text-primary">Application</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Configure your OAuth 2.0 client to start integrating biometric
            FaceID authentication into your digital ecosystem.
          </p>
        </header>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
          {/* Section 1 */}
          <AppDetailsSection register={register} errors={errors} />

          {/* Section 2 */}
          <ClientTypeSelector register={register} watch={watch} />

          {/* Section 3 */}
          <AuthConfigSection control={control} />

          {/* Section 4 */}
          <ScopesSection register={register} watch={watch} />

          {/* Actions */}
          <FormActions isSubmitting={isSubmitting} />
        </form>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-border/10 bg-background px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 md:flex-row md:justify-between">
          <span className="font-headline text-lg font-black uppercase tracking-widest text-primary">
            The Obsidian Lens
          </span>
          <nav className="flex flex-wrap justify-center gap-6">
            {["Privacy Policy", "Terms of Service", "Security Audit", "Status"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item}
              </Link>
            ))}
          </nav>
          <span className="text-sm text-muted-foreground/80">
            © 2024 The Obsidian Lens. Secure by Design.
          </span>
        </div>
      </footer>
    </div>
  );
}