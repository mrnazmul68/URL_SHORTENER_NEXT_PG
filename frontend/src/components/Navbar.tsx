"use client";

import Link from "next/link";
import {  useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/service/userAuth";
import { useAuthStore } from "@/store/auth.store";
import { handleApiError } from "@/utils/apiError";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState("");


  const handleLogout = async () => {
    setError("");

    try {
      await authService.logout();
      setMenuOpen(false);
      router.replace("/");
    } catch (logoutError) {
      setError(handleApiError(logoutError));
    }
  };

  return (
    <nav className="w-full border-b border-zinc-900 bg-black">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex cursor-pointer items-center gap-2.5">
           <Link href="/" className="text-sm font-black">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-black">
              ↗
          </div>
            </Link>

          <span className="text-lg font-semibold tracking-tight text-white">
            snip
          </span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                type="button"
                aria-label="Open profile menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold uppercase text-black"
              >
                {user.name.charAt(0)}
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-zinc-800 bg-zinc-950 p-2 shadow-lg">
                  <p className="truncate px-3 py-2 text-sm text-zinc-400">
                    {user.name}
                  </p>
                  <Link
                    href="/me"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded px-3 py-2 text-sm text-white hover:bg-zinc-900"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-900"
                  >
                    Logout
                  </button>
                  {error && (
                    <p role="alert" className="px-3 py-2 text-xs text-red-400">
                      {error}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-zinc-400 transition hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
