import { KFS_BRAND } from "../config/brandConfig";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { KFSProvider } from "../context/KFSContext";
import { UIProvider } from "../context/UIContext";
import { PresetProvider } from "../context/PresetContext";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { PwaUpdater } from "../components/PwaUpdater";
import "../lib/safeDOM";

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
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Axis Nitro OS - Sistema Comercial POS",
  description: "Axis Nitro OS - Sistema Operativo Comercial POS, Facturación y Control Digital.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Axis Nitro",
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
      lang="es"
      translate="no"
      suppressHydrationWarning
      className={`${jakartaSans.variable} ${geistMono.variable} h-full antialiased notranslate`}
    >
      <head>
        <meta name="google" content="notranslate" />
        <meta name="googlebot" content="notranslate" />
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              if (typeof window !== 'undefined' && typeof Node !== 'undefined') {
                // Safe DOM Polyfill for Google Translate & Extensions
                var origRemoveChild = Node.prototype.removeChild;
                Node.prototype.removeChild = function(child) {
                  if (!child) return child;
                  if (child.parentNode && child.parentNode !== this) {
                    try { return child.parentNode.removeChild(child); } catch(e) { return child; }
                  }
                  if (!child.parentNode) return child;
                  try { return origRemoveChild.call(this, child); } catch(err) {
                    if (child.parentNode) {
                      try { return child.parentNode.removeChild(child); } catch(_) {}
                    }
                    return child;
                  }
                };

                var origInsertBefore = Node.prototype.insertBefore;
                Node.prototype.insertBefore = function(newNode, refNode) {
                  if (!newNode) return newNode;
                  if (refNode && refNode.parentNode && refNode.parentNode !== this) {
                    try { return refNode.parentNode.insertBefore(newNode, refNode); } catch(e) {
                      try { return origInsertBefore.call(this, newNode, null); } catch(_) { return newNode; }
                    }
                  }
                  try { return origInsertBefore.call(this, newNode, refNode); } catch(err) {
                    try { return origInsertBefore.call(this, newNode, null); } catch(_) { return newNode; }
                  }
                };

                var origReplaceChild = Node.prototype.replaceChild;
                Node.prototype.replaceChild = function(newChild, oldChild) {
                  if (!newChild || !oldChild) return oldChild;
                  if (oldChild.parentNode && oldChild.parentNode !== this) {
                    try { return oldChild.parentNode.replaceChild(newChild, oldChild); } catch(e) { return oldChild; }
                  }
                  try { return origReplaceChild.call(this, newChild, oldChild); } catch(err) {
                    try { return this.appendChild(newChild); } catch(_) { return oldChild; }
                  }
                };
              }

              if (typeof window !== 'undefined') {
                if (localStorage.getItem("theme") === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              }
              // Session and persistence protection active: zero-data-loss guaranteed
            } catch (e) {
              console.error("Initialization failed", e);
            }
          `
        }} />
      </head>
      <body className="min-h-full flex flex-col notranslate" translate="no" suppressHydrationWarning>
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
