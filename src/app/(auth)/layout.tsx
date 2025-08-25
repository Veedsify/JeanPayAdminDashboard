import "../globals.css";
import "@fontsource-variable/host-grotesk";

import { Providers } from "@/components/providers/Providers";
import { AuthProvider } from "@/components/contexts/UserAuthContext";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50">
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
