import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const atmospheric = localFont({
  src: "../../public/fonts/a-atmospheric-font-FONT/Atmospheric-rg4aL.ttf",
  variable: "--font-atmospheric",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KONIK - Clothing & Digital Tools",
  description:
    "Modern platform combining premium clothing with powerful digital self-improvement tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${poppins.variable} ${atmospheric.variable} ${inter.variable} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
