import type { Metadata, Viewport } from "next";
import { Averia_Sans_Libre, Averia_Serif_Libre, Inter, Montserrat } from "next/font/google";
import { GlobalLoader } from "@/components/ui/global-loader";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionProvider } from "@/components/providers/motion-provider";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { BRAND, SITE_URL } from "@/config/site";

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
  description: `${BRAND.name} app`,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
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
