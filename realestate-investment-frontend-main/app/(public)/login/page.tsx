import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6 px-4 py-16 md:px-6">
      <div>
        <h1 className="section-title text-white">Welcome back</h1>
        <p className="text-slate-300">Sign in as admin or investor.</p>
      </div>
      <div className="glass-card p-6">
        <LoginForm />
      </div>
    </div>
  );
}
