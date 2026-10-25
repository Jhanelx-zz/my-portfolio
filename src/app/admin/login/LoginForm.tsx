"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "../actions";

const initialState: LoginState = { error: null };

export default function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-100"
        >
          Administrator email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={254}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 dark:border-white/10 dark:bg-[#0e1511] dark:text-white dark:focus:border-emerald-400"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-100"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={128}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 dark:border-white/10 dark:bg-[#0e1511] dark:text-white dark:focus:border-emerald-400"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-700 dark:text-red-300"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-wait disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-500"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
