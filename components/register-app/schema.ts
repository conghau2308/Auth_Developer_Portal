import { z } from "zod";

export const registerAppSchema = z.object({
    appName: z.string().min(2, "Application name must be at least 2 characters"),
    homepageUrl: z.string().url("Enter a valid URL"),
    description: z.string().optional(),
    callbackUrl: z.string().url("Enter a valid callback URL"),
    enableDeviceFlow: z.boolean().optional(),
});

export type RegisterAppFormData = z.infer<typeof registerAppSchema>;

export const defaultValues: RegisterAppFormData = {
    appName: "",
    homepageUrl: "",
    description: "",
    callbackUrl: "",
    enableDeviceFlow: false,
};