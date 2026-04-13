"use client";

import { useState } from "react";
import { useAuth } from "@/lib/supabase/auth-context";

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  /** Contextual message shown to explain why sign-in is needed */
  reason?: string;
}

export default function SignInModal({ open, onClose, reason }: SignInModalProps) {
  const { signInWithGoogle, signInWithEmail, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setEmailError(null);
    const { error } = await signInWithEmail(email.trim());
    if (error) {
      setEmailError(error);
    } else {
      setEmailSent(true);
    }
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm animate-in rounded-t-2xl bg-white px-6 pb-8 pt-6 shadow-xl sm:rounded-2xl sm:mx-4">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
        >
          ✕
        </button>

        {!configured ? (
          <>
            <h2 className="text-[17px] font-bold tracking-[-0.01em] text-zinc-900">
              Sign in coming soon
            </h2>
            <p className="mt-1 text-[13px] text-zinc-400">
              Auth is not configured yet. Your data is saved locally.
            </p>
          </>
        ) : emailSent ? (
          <>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-lg">
              ✉️
            </div>
            <h2 className="text-[17px] font-bold tracking-[-0.01em] text-zinc-900">
              Check your email
            </h2>
            <p className="mt-1 text-[13px] text-zinc-400">
              We sent a sign-in link to{" "}
              <span className="font-medium text-zinc-600">{email}</span>.
              Click the link to continue.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-[17px] font-bold tracking-[-0.01em] text-zinc-900">
              {reason || "Sign in to continue"}
            </h2>
            <p className="mt-1 text-[13px] text-zinc-400">
              Save your work across devices. No password needed.
            </p>

            {/* Google */}
            <button
              onClick={signInWithGoogle}
              className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl bg-zinc-900 px-4 py-3 text-[14px] font-semibold text-white transition-all duration-150 hover:bg-zinc-800 active:scale-[0.97]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-100" />
              <span className="text-[11px] text-zinc-300">or</span>
              <div className="h-px flex-1 bg-zinc-100" />
            </div>

            {/* Email magic link */}
            <form onSubmit={handleEmail}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-[14px] text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:bg-white"
              />
              {emailError && (
                <p className="mt-1.5 text-[12px] text-red-500">{emailError}</p>
              )}
              <button
                type="submit"
                disabled={sending || !email.trim()}
                className="mt-2.5 w-full rounded-xl bg-zinc-100 px-4 py-2.5 text-[14px] font-medium text-zinc-700 transition-all duration-150 hover:bg-zinc-200 active:scale-[0.97] disabled:opacity-40"
              >
                {sending ? "Sending…" : "Send magic link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
