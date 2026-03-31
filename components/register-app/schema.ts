import { z } from "zod";

// ─── Zod schema ───────────────────────────────────────────────────────────────

export const registerAppSchema = z.object({
    appName: z
        .string()
        .min(2, "Application name must be at least 2 characters"),

    description: z.string().optional(),

    clientType: z.enum(["web", "spa", "mobile", "server"], {
        error: "Please select a client type",
    }),

    redirectUris: z
        .array(z.object({ value: z.string().url("Enter a valid URL") }))
        .min(1, "At least one redirect URI is required"),

    postLogoutUri: z
        .string()
        .url("Enter a valid URL")
        .optional()
        .or(z.literal("")),

    scopes: z
        .array(z.enum(["openid", "profile", "email", "face_data_access"]))
        .min(1, "Select at least one scope"),
});

// ─── Inferred type ────────────────────────────────────────────────────────────

export type RegisterAppFormData = z.infer<typeof registerAppSchema>;

// ─── Default values ───────────────────────────────────────────────────────────

export const defaultValues: RegisterAppFormData = {
    appName: "",
    description: "",
    clientType: "web",
    redirectUris: [{ value: "https://app.obsidian.io/callback" }],
    postLogoutUri: "",
    scopes: ["openid", "profile"],
};