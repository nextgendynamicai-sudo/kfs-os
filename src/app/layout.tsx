import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { KFSProvider } from "../context/KFSContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0A1128",
};

export const metadata: Metadata = {
  title: "KFS OS",
  description: "Business Operating System by Kreatek.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KFS OS",
  },
  icons: {
    icon: "/kfs-logo.png",
    apple: "/kfs-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              if (typeof window !== 'undefined' && localStorage.getItem("kfs_hard_reset_v2") !== "done") {
                localStorage.removeItem("kfs_os_current_user");
                localStorage.setItem("kfs_hard_reset_v2", "done");
                if ('caches' in window) {
                  caches.keys().then(names => {
                    for (let name of names) caches.delete(name);
                  });
                }
                window.location.reload();
              }
            } catch (e) {
              console.error("Hard reset failed", e);
            }
          `
        }} />
      </head>
      <body className="min-h-full flex flex-col">
        <KFSProvider>{children}</KFSProvider>
      </body>
    </html>
  );
}
