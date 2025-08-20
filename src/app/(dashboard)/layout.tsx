import type { Metadata } from "next";
// import { Instrument_Sans } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/providers/Providers";
import "@fontsource-variable/host-grotesk";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Toaster } from "react-hot-toast";

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
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            className: "bg-white text-gray-800 shadow-lg",
            duration: 5000,
            style: {
              borderRadius: "8px",
              padding: "16px",
              fontSize: "14px",
            },
          }}
        />
        <DashboardLayout>
          <Providers>{children}</Providers>
        </DashboardLayout>
      </body>
    </html>
  );
}
