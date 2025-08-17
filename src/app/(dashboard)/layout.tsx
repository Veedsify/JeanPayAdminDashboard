import type { Metadata } from "next";
// import { Instrument_Sans } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/providers/Providers";
import "@fontsource-variable/host-grotesk";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// const font = Instrument_Sans({
//   subsets: ["latin"],
//   variable: "--font-instrument-sans",
// });

export const metadata: Metadata = {
  title: "JeanPay Dashboard",
  description: "Financial dashboard for JeanPay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${"font.className"} font-sans antialiased bg-gray-50`}>
        <DashboardLayout>
          <Providers>{children}</Providers>
        </DashboardLayout>
      </body>
    </html>
  );
}
