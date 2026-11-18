"use client";

import { useState } from "react";
import { ChevronLeft, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Step = "choose" | "email" | "sent";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [step, setStep] = useState<Step>("choose");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogle() {
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google Oauth error : ", error.message);
      setError(error.message);
      setLoading(false);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setStep("sent");
  }

  function reset() {
    setStep("choose");
    setEmail("");
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-100 placeholder:text-gray-400";

  const outlineButton =
    "flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-medium text-gray-800 transition hover:border-gray-400 active:scale-[0.99]";

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      {/* hero section */}
      <section className="flex flex-col gap-8 bg-zinc-900 px-6 py-8 text-white md:px-12 md:py-14">
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Pondr your
            <br />
            Purchase.
          </h1>
          <p className="max-w-md text-sm text-zinc-400 md:text-base">
            Pause, check in with yourself,
            <br />
            and spend on what actually matters.
          </p>
        </div>
      </section>

      {/* sign in */}
      <section className="flex items-center justify-center px-6 py-10 md:px-12">
        <div className="w-full max-w-sm space-y-6">
          {step === "choose" && (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Welcome
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Sign in or create an account to start.
                </p>
              </div>

              <div className="space-y-3">
                {error && (
                  <p className="text-sm text-red-500" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading}
                  className={`${outlineButton} disabled:opacity-50`}
                >
                  <GoogleIcon />
                  {loading ? "Connecting..." : "continue with google"}
                </button>

                <button
                  type="button"
                  disabled
                  title="Email sign-in is temporarily unavailable due to Supabase's email sending limit."
                  className={`${outlineButton} cursor-not-allowed opacity-50`}
                >
                  <Mail size={20} />
                  Continue with email
                </button>
              </div>
            </>
          )}

          {step === "email" && (
            <>
              <button
                type="button"
                onClick={reset}
                className="-ml-2 flex items-center gap-1 rounded-full py-2 pl-2 pr-3 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <ChevronLeft size={18} />
                Back
              </button>

              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                What&apos;s your email?
              </h2>

              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                  required
                />
                {error && (
                  <p className="text-sm text-red-500" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-zinc-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-gray-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Continue"}
                </button>
              </form>
            </>
          )}

          {step === "sent" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Check your inbox
              </h2>
              <p className="text-sm text-gray-500">
                We sent a sign-in link to{" "}
                <span className="font-medium text-gray-800">{email}</span>.
              </p>
              <button
                type="button"
                onClick={reset}
                className="text-sm text-gray-600 underline hover:text-gray-900"
              >
                Use a different email
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
