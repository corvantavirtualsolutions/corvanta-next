import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CerenaChat from "@/components/CerenaChat";
import { createClient } from "@/lib/supabase/server";
import RouteScrollReset from "@/app/components/RouteScrollReset";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Corvanta Virtual Solutions | Vetted Virtual Assistants for Growing Businesses",
  description:
    "Corvanta Virtual Solutions connects growing businesses with vetted, skilled Virtual Assistants — so you can focus on what matters most.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authUser = user ? { email: user.email ?? "" } : null;

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable}`}
      style={
        {
          "--font-heading": "var(--font-plus-jakarta), 'Poppins', sans-serif",
          "--font-body": "var(--font-inter), sans-serif",
        } as React.CSSProperties
      }
    >
      <body>
        <RouteScrollReset />
        <Header user={authUser} />
        <main>{children}</main>
        <Footer />
        <CerenaChat />
      </body>
    </html>
  );
}
