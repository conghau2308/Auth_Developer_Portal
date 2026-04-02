"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerAppSchema, defaultValues, type RegisterAppFormData } from "@/components/register-app/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { BookOpen, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegisterApplicationPage() {
  const {
    register,
    handleSubmit,
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
      console.error("Registration failed", await res.json());
      return;
    }
    // TODO: redirect to app detail page showing client ID + secret
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Developer Settings
          </Link>
          <span>/</span>
          <Link href="/dashboard/apps" className="hover:text-foreground transition-colors">
            OAuth Apps
          </Link>
          <span>/</span>
          <span className="text-foreground">New Application</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr]">
          {/* ── Left sidebar ── */}
          <aside className="space-y-8">
            <div>
              <h1 className="text-xl font-semibold text-foreground mb-1">
                Register a new OAuth application
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                After registration, you'll receive a <strong className="text-foreground font-medium">Client ID</strong> and can generate a <strong className="text-foreground font-medium">Client Secret</strong> to authenticate your application.
              </p>
            </div>

            <div className="space-y-4 rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Resources
              </p>
              {[
                { label: "OAuth 2.0 documentation", href: "#" },
                { label: "Authorization flow guide", href: "#" },
                { label: "Scopes reference", href: "#" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <BookOpen size={13} />
                  {label}
                  <ExternalLink size={11} className="ml-auto opacity-50" />
                </a>
              ))}
            </div>

            <div className="rounded-lg border border-amber-200/60 bg-amber-50/50 dark:border-amber-800/40 dark:bg-amber-950/20 p-4 space-y-2">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                Important
              </p>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
                The Client Secret will only be shown once after registration. Store it securely — it cannot be recovered.
              </p>
            </div>
          </aside>

          {/* ── Form ── */}
          <main>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-0">
              <div className="divide-y divide-border/40 border border-border/60 rounded-lg overflow-hidden">

                {/* Application name */}
                <div className="p-5 bg-card">
                  <div className="max-w-lg space-y-1.5">
                    <Label htmlFor="appName" className="text-sm font-medium text-foreground">
                      Application name <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Something users will recognize and trust.
                    </p>
                    <Input
                      id="appName"
                      placeholder="My OAuth App"
                      className="mt-2 bg-background border-border/60 focus-visible:ring-1 focus-visible:ring-primary rounded-md h-9 text-sm"
                      aria-invalid={!!errors.appName}
                      {...register("appName")}
                    />
                    {errors.appName && (
                      <p className="text-xs text-destructive mt-1">{errors.appName.message}</p>
                    )}
                  </div>
                </div>

                {/* Homepage URL */}
                <div className="p-5 bg-card">
                  <div className="max-w-lg space-y-1.5">
                    <Label htmlFor="homepageUrl" className="text-sm font-medium text-foreground">
                      Homepage URL <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      The full URL to your application's homepage.
                    </p>
                    <Input
                      id="homepageUrl"
                      type="url"
                      placeholder="https://example.com"
                      className="mt-2 bg-background border-border/60 focus-visible:ring-1 focus-visible:ring-primary rounded-md h-9 text-sm"
                      aria-invalid={!!errors.homepageUrl}
                      {...register("homepageUrl")}
                    />
                    {errors.homepageUrl && (
                      <p className="text-xs text-destructive mt-1">{errors.homepageUrl.message}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="p-5 bg-card">
                  <div className="max-w-lg space-y-1.5">
                    <Label htmlFor="description" className="text-sm font-medium text-foreground">
                      Application description
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Shown to users on the authorization screen. Optional but recommended.
                    </p>
                    <Textarea
                      id="description"
                      placeholder="Briefly describe what your application does..."
                      rows={3}
                      className="mt-2 resize-none bg-background border-border/60 focus-visible:ring-1 focus-visible:ring-primary rounded-md text-sm"
                      {...register("description")}
                    />
                  </div>
                </div>

                {/* Callback URL */}
                <div className="p-5 bg-card">
                  <div className="max-w-lg space-y-1.5">
                    <Label htmlFor="callbackUrl" className="text-sm font-medium text-foreground">
                      Authorization callback URL <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Your application's callback URL. Read the{" "}
                      <a href="#" className="text-primary hover:underline">OAuth documentation</a>{" "}
                      for more information.
                    </p>
                    <Input
                      id="callbackUrl"
                      type="url"
                      placeholder="https://example.com/oauth/callback"
                      className="mt-2 bg-background border-border/60 focus-visible:ring-1 focus-visible:ring-primary rounded-md h-9 text-sm"
                      aria-invalid={!!errors.callbackUrl}
                      {...register("callbackUrl")}
                    />
                    {errors.callbackUrl && (
                      <p className="text-xs text-destructive mt-1">{errors.callbackUrl.message}</p>
                    )}
                  </div>
                </div>

                {/* Device flow */}
                <div className="p-5 bg-card">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-border/60 text-primary focus:ring-primary focus:ring-offset-background cursor-pointer"
                      {...register("enableDeviceFlow")}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Enable Device Authorization Flow
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Allow OAuth apps to authenticate via the device flow — suitable for CLI tools, smart TVs, and input-constrained devices.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6">
                <p className="text-xs text-muted-foreground">
                  Fields marked <span className="text-destructive">*</span> are required.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-9 px-4 text-sm"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-9 px-5 text-sm font-medium primary-gradient text-primary-foreground border-0 rounded-md hover:opacity-90 active:scale-[0.98] disabled:opacity-60 transition-all flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                    {isSubmitting ? "Registering…" : "Register application"}
                  </Button>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}