import { SignInButtons } from "@/components/auth/SignInButtons";
import { Card } from "@/components/ui/Card";
import { configuredAuthProviders } from "@/lib/auth/providers";

export default function LoginPage() {
  const providers = configuredAuthProviders();

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-serif font-semibold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
          Logos Engine
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-fg)]">
          Read the Greek world from the source.
        </p>
      </div>
      <Card>
        <h2 className="mb-4 text-sm font-semibold">Sign in to continue</h2>
        <SignInButtons providers={providers} />
      </Card>
    </div>
  );
}
