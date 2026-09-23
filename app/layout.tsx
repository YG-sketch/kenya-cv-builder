import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Kenya — ATS CVs for 20 Bob",
  description:
    "Build a job-winning, ATS-friendly CV in minutes. Pay only 20 KES via M-Pesa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-900">{children}</body>
    </html>
  );
}
