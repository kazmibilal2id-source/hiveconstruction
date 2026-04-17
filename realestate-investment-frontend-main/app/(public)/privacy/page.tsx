export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-12 md:px-6">
      <h1 className="section-title text-white">Privacy Policy</h1>
      <div className="glass-card space-y-3 p-6 text-sm text-slate-300">
        <p>We collect profile and investment data solely to operate and secure the platform.</p>
        <p>Data is processed under strict access control and never sold to third parties.</p>
        <p>Security controls include hashed credentials, role-based access, and audit trails.</p>
      </div>
    </div>
  );
}
