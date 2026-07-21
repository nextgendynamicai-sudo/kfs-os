import { KFS_BRAND } from "../config/brandConfig";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { KFSProvider } from "../context/KFSContext";
import { UIProvider } from "../context/UIContext";
import { PresetProvider } from "../context/PresetContext";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { PwaUpdater } from "../components/PwaUpdater";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
};

export const metadata: Metadata = {
  title: `${KFS_BRAND.productAcronym} OS`,
  description: "Business Operating System by Kreatek.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: `${KFS_BRAND.productAcronym} OS`,
  },
  icons: {
    icon: "/kfs-logo.png",
    apple: "/kfs-logo.png",
  },
};
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              if (typeof window !== 'undefined') {
                if (localStorage.getItem("theme") === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              }
              if (typeof window !== 'undefined' && localStorage.getItem("kfs_hard_reset_v3.2") !== "done") {
                localStorage.removeItem("kfs_os_current_user");
                localStorage.setItem("kfs_hard_reset_v3.2", "done");
                if ('caches' in window) {
                  caches.keys().then(names => {
                    for (let name of names) caches.delete(name);
                  });
                }
                window.location.reload();
              }
            } catch (e) {
              console.error("Initialization failed", e);
            }
          `
        }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ErrorBoundary>
          <UIProvider>
            <KFSProvider>
              <PresetProvider>
                <PwaUpdater />
                {children}
              </PresetProvider>
            </KFSProvider>
          </UIProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
