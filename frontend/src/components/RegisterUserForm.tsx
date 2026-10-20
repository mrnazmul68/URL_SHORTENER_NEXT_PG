"use client";

import { register } from "@/service/userAuth";
import { handleApiError } from "@/utils/apiError";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegisterUserForm = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
      router.push("/");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl flex justify-center items-center font-semibold tracking-tight text-white">
          Create
          <span className="text-blue-500 pl-3">free acc</span> ount
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Name */}
        <div>
          <input
            required
            type="text"
            placeholder="Your name"
            autoComplete="name"
            className="w-full border-0 border-b border-zinc-800 bg-transparent px-0 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <input
            required
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full border-0 border-b border-zinc-800 bg-transparent px-0 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div>
          <input
            required
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            className="w-full border-0 border-b border-zinc-800 bg-transparent px-0 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* API Error */}
        {error && (
          <div className="flex items-start gap-3 border border-red-500/20 bg-red-500/5 px-4 py-3">
            <span className="mt-0.5 text-sm text-red-400">!</span>

            <p className="text-sm leading-5 text-red-400">{error}</p>
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center bg-white text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin border-2 border-black/20 border-t-black" />
              Creating account...
            </span>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/login" className="cursor-pointer text-zinc-300 transition hover:text-white">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterUserForm;
