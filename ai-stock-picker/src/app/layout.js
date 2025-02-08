import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Stock Picker",
  description: "Generate a super accurate stock predictions report",
  icons: {
    icon: '/chart-candlestick.svg',
    type: 'image/svg+xml',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-grow flex items-center">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
