import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CREST OS — Launch. Operate. Scale Globally.",
  description: "CREST OS by CrestOrigin helps entrepreneurs launch and operate global commerce businesses.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('crest_os_theme');if(t!=='light'&&t!=='dark')t='dark';var d=document.documentElement;d.classList.remove('dark','light');d.classList.add(t);d.style.colorScheme=t;d.lang=d.lang||'en';}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
