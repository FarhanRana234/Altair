import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-space-deep text-slate-100 p-6 text-center">
      <h1 className="text-4xl font-light mb-4">404 - Page Not Found</h1>
      <p className="text-slate-400 mb-6">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-6 py-2 rounded-full border border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
