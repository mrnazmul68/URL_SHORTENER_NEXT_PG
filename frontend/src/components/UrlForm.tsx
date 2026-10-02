"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Copy, Check, Link as LinkIcon, AlertCircle } from "lucide-react";
import { shortUrl } from "@/service/urlService";
import { handleApiError } from "@/utils/apiError";
import { ShortUrlResponse } from "@/service/uelResponseType";

// import { Trash2 } from "lucide-react";
// const recent = [
//   {
//     short: "snip.link/q8Xk2m",
//     original: "https://github.com/vercel/next.js/discussions/12345",
//   },
//   {
//     short: "snip.link/portfolio",
//     original: "https://my-very-long-portfolio-website.vercel.app/projects",
//   },
//   {
//     short: "snip.link/a7Tn9P",
//     original: "https://docs.google.com/document/d/1AbCdEfGhIjKlMnOpQrStUv/edit",
//   },
// ];

const UrlForm = () => {
  const [full, setFull] = useState("");
  const [short, setShort] = useState("");
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState<ShortUrlResponse | null>(null);

  const formHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setCopy(false);
    setError(null);
    setResult(null);

    try {
      setResult(await shortUrl(full, short));
      setFull("");
      setShort("");
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.data?.shortUrl) return;

    try {
      await navigator.clipboard.writeText(result.data.shortUrl);
      setCopy(true);

      setTimeout(() => {
        setCopy(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };
  return (
    <section className="relative mx-auto w-full max-w-2xl px-5 py-16 sm:py-24">
      {/* soft glow behind the form */}

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 -z-10 h-72 w-xl -translate-x-1/2 rounded-full bg-violet-600/10 blur-[100px]"
      />

      {/* Heading */}
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/4 text-violet-400 shadow-lg shadow-violet-950/20">
          <LinkIcon className="h-5 w-5" />
        </div>

        <h1 className="mt-7 text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
          Shorten links.
          <br />
          <span className="text-zinc-500">Share smarter.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-zinc-400 sm:text-base">
          Turn long URLs into short, memorable links with a custom alias.
          Simple, fast, and built for sharing.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={formHandler}
        className="mx-auto mt-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl"
      >
        {/* Long URL */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor="url" className="sr-only">
            Long URL
          </label>

          <div className="flex min-w-0 flex-1 items-center rounded-xl border border-transparent bg-white/3 transition-colors focus-within:border-violet-500/40 focus-within:bg-white/5">
            <div className="pl-4 text-zinc-600">
              <LinkIcon className="h-4 w-4" />
            </div>

            <input
              value={full}
              onChange={(e) => setFull(e.target.value)}
              id="url"
              type="url"
              required
              placeholder="Paste your long URL here..."
              className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-zinc-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-violet-500 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-violet-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </div>

        {/* Custom alias */}
        <div className="mt-2 flex items-center rounded-xl border border-white/5 bg-white/2 px-4 py-3 transition-colors focus-within:border-violet-500/40 focus-within:bg-white/5">
          <span className="shrink-0 text-xs font-medium text-zinc-600 sm:text-sm">
            snip.link/
          </span>

          <label htmlFor="alias" className="sr-only">
            Custom alias
          </label>

          <input
            value={short}
            onChange={(e) => setShort(e.target.value)}
            id="alias"
            type="text"
            placeholder="custom-alias"
            className="ml-1 min-w-0 flex-1 bg-transparent px-1 text-sm text-white outline-none placeholder:text-zinc-700"
          />

          <span className="hidden text-xs text-zinc-700 sm:block">
            Optional
          </span>
        </div>
      </form>

      {/* Small trust / feature text */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-zinc-600">
        <span>Fast redirects</span>
        <span className="h-1 w-1 rounded-full bg-zinc-700" />
        <span>Custom aliases</span>
        <span className="h-1 w-1 rounded-full bg-zinc-700" />
        <span>No clutter</span>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Result card */}
      {result && (
        <div className="mt-6 rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-500/15 to-transparent p-6">
          <p className="text-sm text-zinc-400">Short link</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <Link
              href={result.data.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-2xl font-semibold tracking-tight text-white/90 underline-offset-4 hover:underline"
            >
              {result.data.shortUrl}
            </Link>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {copy ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy link</span>
                </>
              )}
            </button>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/10 pt-4 text-sm">
            <span className="max-w-full truncate text-zinc-500 line-through decoration-zinc-600">
              {result.data.fullUrl}
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-violet-300">
              {`Shortened from ${result.data.fullUrl.length} characters to ${result.data.shortUrl.length} characters`}
            </span>
          </div>
        </div>
      )}

      {/* Recent links */}
      {/* <div className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold opacity-90 text-white">
            Recent links
          </h2>
          <button
            type="button"
            className="rounded  border p-1 text-sm text-zinc-500 transition-colors hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            Remove all
          </button>
        </div>

        <ul className="mt-4 divide-y divide-white/10 rounded-xl border border-white/10 bg-zinc-950">
          {recent.map((item) => (
            <li
              key={item.short}
              className="flex items-center gap-3 px-4 py-3.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-violet-300">
                  {item.short}
                </p>
                <p className="truncate text-sm text-zinc-500">
                  {item.original}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Copy ${item.short}`}
                className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={`Delete ${item.short}`}
                className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div> */}
    </section>
  );
};

export default UrlForm;
