import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-center">
      <span className="inline-block bg-brand/10 text-brand font-medium text-sm px-3 py-1 rounded-full mb-6">
        Built for the Kenyan job market
      </span>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
        Get an ATS-winning CV for just{" "}
        <span className="text-brand">20 Bob</span>
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        Fill a simple form, preview your CV instantly, pay via M-Pesa, and
        download a professional, ATS-friendly PDF — ready in under 10
        minutes.
      </p>
      <Link
        href="/create"
        className="inline-block bg-brand hover:bg-brand-dark transition-colors text-white font-semibold px-8 py-4 rounded-lg text-lg"
      >
        Start My CV →
      </Link>
      <p className="text-sm text-gray-400 mt-4">
        No sign-up needed to start. Pay only when you're ready to download.
      </p>
    </main>
  );
}
