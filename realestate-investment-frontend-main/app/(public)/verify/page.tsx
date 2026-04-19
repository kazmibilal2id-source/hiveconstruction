import { OTPForm } from "@/components/forms/otp-form";
import { Suspense } from "react";

export default function VerifyPage() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6 px-4 py-16 md:px-6">
      <div>
        <h1 className="section-title text-white">Verify Your Email</h1>
        <p className="text-slate-300">We&apos;ve sent a 6-digit code to your inbox.</p>
      </div>
      <div className="glass-card p-6">
        <Suspense fallback={<p className="text-white text-sm">Loading...</p>}>
          <OTPForm />
        </Suspense>
      </div>
    </div>
  );
}
