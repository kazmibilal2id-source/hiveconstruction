export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-navy/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between md:px-6">
        <p>© {new Date().getFullYear()} Hive Construction Ventures. All rights reserved.</p>
        <p className="text-slate-500">Built for serious investors and smart real-estate growth.</p>
      </div>
    </footer>
  );
}
