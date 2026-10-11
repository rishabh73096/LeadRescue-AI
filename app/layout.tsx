import type { Metadata, Viewport } from "next";
import { Averia_Sans_Libre, Averia_Serif_Libre, Inter, Montserrat } from "next/font/google";
import { GlobalLoader } from "@/components/ui/global-loader";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { BRAND, SEO, SITE_URL } from "@/config/site";

const averiaSans = Averia_Sans_Libre({
  variable: "--font-averia-sans",
  weight: ["400"],
  subsets: ["latin"],
});

const averiaSerif = Averia_Serif_Libre({
  variable: "--font-averia-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter-src",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: BRAND.appTitle,
    template: `%s · ${BRAND.name}`,
  },
  description: SEO.description,
  applicationName: BRAND.name,
  authors: [{ name: BRAND.name, url: SITE_URL }],
  creator: BRAND.name,
  publisher: BRAND.name,
  category: "business",
  formatDetection: { telephone: false, email: false, address: false },
  // The app itself is private; public pages opt in to indexing individually.
  robots: { index: false, follow: false },
  openGraph: { type: "website", siteName: BRAND.name, locale: SEO.locale, url: SITE_URL, title: SEO.title, description: SEO.description },
  twitter: { card: "summary_large_image", title: SEO.title, description: SEO.description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${averiaSans.variable} ${averiaSerif.variable} ${montserrat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <MotionProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          </MotionProvider>
          <GlobalLoader />
          <Toaster closeButton position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
