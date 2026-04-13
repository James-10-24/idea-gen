import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function ProSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-600" />
          <p className="mt-3 text-[13px] text-zinc-400">
            Activating your account…
          </p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
