import "./globals.css";
import { AuthProvider } from "./(dashboard)/contexts/authContext";
import GlobalToastProvider from "./contexts/GlobalToastProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`w-screen h-screen`}>
        <AuthProvider>
          <GlobalToastProvider>{children}</GlobalToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
