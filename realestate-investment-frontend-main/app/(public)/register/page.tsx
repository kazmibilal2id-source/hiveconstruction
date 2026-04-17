import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-12 md:px-6">
      <div>
        <h1 className="section-title text-white">Investor Registration</h1>
        <p className="text-slate-300">Create your account and request verification for platform access.</p>
      </div>
      <div className="glass-card p-6">
        <RegisterForm />
      </div>
    </div>
  );
}
