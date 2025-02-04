import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wealth Wizard",
  description: "A cool Wealth Wizard",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          {/* header */}
          <Header />

          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          {/* footer */}
          <footer className="py-12">
            <div className="container mx-auto px-4 text-center text-gray-600 border-gray-400">
              <p>
                Wealth Wizard is a cool finance tracker. It is built with
                Next.js and Tailwind CSS.
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
