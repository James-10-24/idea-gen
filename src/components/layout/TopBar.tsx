"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/supabase/auth-context";
import SignInModal from "@/components/auth/SignInModal";

export default function TopBar() {
  const { user, signOut, configured } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/90 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-11 max-w-lg items-center justify-between px-5">
          <Link
            href="/"
            className="flex items-baseline gap-1 transition-opacity active:opacity-60"
          >
            <span className="text-[14px] font-semibold tracking-tight text-zinc-900">
              Idea
            </span>
            <span className="text-[12px] text-zinc-300">→</span>
            <span className="text-[14px] font-semibold tracking-tight text-zinc-900">
              Income
            </span>
          </Link>

          {configured && (
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white transition-opacity active:opacity-70"
                >
                  {initials}
                </button>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="rounded-lg px-2.5 py-1 text-[12px] font-medium text-zinc-400 transition-colors hover:text-zinc-600"
                >
                  Sign in
                </button>
              )}

              {/* Dropdown menu */}
              {showMenu && user && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-1.5 w-48 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-zinc-100">
                    <div className="border-b border-zinc-100 px-3 py-2.5">
                      <p className="truncate text-[12px] font-medium text-zinc-700">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      {user.user_metadata?.full_name && (
                        <p className="truncate text-[11px] text-zinc-400">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={async () => {
                        await signOut();
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center px-3 py-2.5 text-[12px] text-zinc-500 transition-colors hover:bg-zinc-50"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      <SignInModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
