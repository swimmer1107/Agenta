import "./globals.css";
import { Providers } from "@/components/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OrchestrAI | Autonomous Project Team",
  description: "A persistent multi-agent software team for modern developers.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen selection:bg-blue-500/30`}>
        <Providers>
          <Toaster position="top-center" />
          <DashboardLayout session={session}>
            {children}
          </DashboardLayout>
        </Providers>
      </body>
    </html>
  );
}
