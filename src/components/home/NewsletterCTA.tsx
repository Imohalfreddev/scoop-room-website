"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/api/newsletter";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const result = await subscribeToNewsletter(email, "homepage");
    if (result.success) {
      setStatus("success");
      setMessage("You're subscribed. Check your inbox to confirm.");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.error ?? "Enter a valid email address.");
    }
  }

  return (
    <section id="newsletter" className="bg-ink text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-white/10">
            <Mail size={20} className="text-signal-bright" />
          </div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            The Scoop, in your inbox
          </h2>
          <p className="mt-3 text-white/70">
            One email every morning with the stories Scoop Room&rsquo;s editors think matter most.
          </p>
          <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 outline-none focus-visible:border-signal"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-full bg-signal px-6 py-3 text-sm font-semibold transition hover:bg-signal-bright disabled:opacity-60"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
          {message && (
            <p
              className={`mt-3 text-sm ${
                status === "error" ? "text-signal-bright" : "text-white/70"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
