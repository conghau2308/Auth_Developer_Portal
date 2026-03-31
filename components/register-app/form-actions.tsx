import { Button } from "@/components/ui/button";
import { Info, Loader2 } from "lucide-react";
import Link from "next/link";

interface FormActionsProps {
    isSubmitting: boolean;
}

/**
 * FormActions
 *
 * Sticky bottom bar with:
 * - Developer Terms notice (left)
 * - Cancel + Register Client buttons (right)
 */
export default function FormActions({ isSubmitting }: FormActionsProps) {
    return (
        <div className="flex flex-col items-center justify-between gap-6 border-t border-border/20 pt-10 md:flex-row">
            {/* Terms */}
            <div className="flex items-center gap-3 text-muted-foreground">
                <Info size={18} className="text-primary shrink-0" />
                <p className="text-sm">
                    By registering, you agree to our{" "}
                    <Link href="/developer-terms" className="text-primary hover:underline">
                        Developer Terms
                    </Link>
                    .
                </p>
            </div>

            {/* Buttons */}
            <div className="flex w-full gap-4 md:w-auto">
                <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 rounded-xl px-8 py-6 font-bold md:flex-none"
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="
            flex-1 rounded-xl px-10 py-6 font-bold
            primary-gradient text-primary-foreground border-0
            shadow-[0_10px_30px_rgba(0,218,243,0.3)]
            hover:shadow-[0_15px_40px_rgba(0,218,243,0.4)]
            hover:scale-[1.02] active:scale-95
            disabled:opacity-60 disabled:scale-100
            transition-all duration-200
            md:flex-none
            flex items-center justify-center gap-2
          "
                >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    {isSubmitting ? "Registering…" : "Register Client"}
                </Button>
            </div>
        </div>
    );
}