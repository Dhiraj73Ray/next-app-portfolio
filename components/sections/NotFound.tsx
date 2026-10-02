import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-start gap-8 border-b-4 border-ink px-6 pb-24 pt-40 md:px-16">
      <span className="font-mono text-xs uppercase tracking-widest text-olive">[ 404 — WRONG STOP ]</span>
      <h1 className="font-serif text-6xl leading-none tracking-tight text-ink md:text-9xl">
        This page is not on the route.
      </h1>
      <Link
        href="/"
        className="border-2 border-ink bg-burnt px-6 py-3 font-mono text-sm uppercase text-cream transition-colors hover:bg-ink"
      >
        Back to home
      </Link>
    </main>
  );
}