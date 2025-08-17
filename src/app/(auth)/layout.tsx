import "../globals.css";
import "@fontsource-variable/host-grotesk";

import { Providers } from "@/components/providers/Providers";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
