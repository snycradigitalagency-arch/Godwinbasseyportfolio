import { signIn } from "@/app/admin/login/actions";

export const metadata = { title: "Sign In — Admin" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-text-primary">Sign In</h1>
        <p className="mt-2 text-sm text-text-muted">Admin access only.</p>

        {searchParams.error && (
          <p className="mt-4 rounded-md border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
            {searchParams.error === "not_authorized"
              ? "Your account doesn't have admin access yet."
              : searchParams.error}
          </p>
        )}

        <form action={signIn} className="mt-8 flex flex-col gap-4">
          <input type="hidden" name="next" value={searchParams.next ?? "/admin/dashboard"} />
          <label className="flex flex-col gap-2 text-sm text-text-secondary">
            Email
            <input
              name="email"
              type="email"
              required
              className="rounded-md border border-border bg-card px-4 py-3 text-text-primary focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-text-secondary">
            Password
            <input
              name="password"
              type="password"
              required
              className="rounded-md border border-border bg-card px-4 py-3 text-text-primary focus:border-accent"
            />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-accent-hover"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
