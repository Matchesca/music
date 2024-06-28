import getSongsByUserId from "@/actions/getSongsByUserId";
import LoadingBarMod from "@/components/LoadingBar";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "@/providers/AuthProvider";
import ModalProvider from "@/providers/ModalProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

const roboto = Roboto({
  weight: "300",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "Listen to music",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userSongs = await getSongsByUserId();
  return (
    <html
      lang="en"
      className={GeistSans.className}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToasterProvider />
          <AuthProvider>
            <LoadingBarMod>
              <ModalProvider />

              <Sidebar songs={userSongs}>{children}</Sidebar>
              <Player />
            </LoadingBarMod>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
