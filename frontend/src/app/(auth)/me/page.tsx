"use client";

import { authService } from "@/service/userAuth";
import { useAuthStore } from "@/store/auth.store";
import { handleApiError } from "@/utils/apiError";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  if (!user) {
    return(
        <div className="flex h-[70vh] items-center justify-center">
          <span className="h-24 w-24 animate-spin border-8 border-white border-t-black" />
       </div>
    )
  }
  //handle logout
  const handleLogout = () => {
    setError("");

    try {
      authService.logout();
      router.replace("/");
    } catch (error) {
      setError(handleApiError(error));
    }
  };

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <main className=" bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-10 ">
          <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950">
          {/* Profile Header */}
          <div className="flex items-center gap-5 border-b border-zinc-900 px-6 py-7">
            {/* Avatar */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-xl font-semibold uppercase text-black">
              {user.name[0]}
            </div>

            <div>
              <h2 className="text-lg font-medium capitalize text-white">
                {user.name}
              </h2>

              <p className="mt-1 text-sm text-zinc-500">{user.email}</p>
            </div>
          </div>

          {/* Account Information */}
          <div className="px-6">
            {/* Name */}
            <div className="flex items-center justify-between border-b border-zinc-900 py-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-600">
                  Name
                </p>
                <p className="mt-1 text-sm text-zinc-200">{user.name}</p>
              </div>

              <span className="text-xs text-zinc-700">Personal</span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between border-b border-zinc-900 py-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-600">
                  Email
                </p>
                <p className="mt-1 text-sm text-zinc-200">{user.email}</p>
              </div>

              <span className="text-xs text-emerald-500">Verified</span>
            </div>

            {/* Joined */}
            <div className="flex items-center justify-between py-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-600">
                  Joined
                </p>
                <p className="mt-1 text-sm text-zinc-200">{joinedDate}</p>
              </div>

              <span className="text-xs text-zinc-700">Snip</span>
            </div>
          </div>
        </div>

        {/* Danger / Logout */}
        <div className="mt-6 flex items-center justify-between rounded-xl border border-zinc-900 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-white">Sign out</p>
            <p className="mt-1 text-xs text-zinc-600">
              Sign out from your Snip account.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-md border border-zinc-800 px-4 py-2 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page;
