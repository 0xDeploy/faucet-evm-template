import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Silkscreen } from "@next/font/google";

const font = Silkscreen({
  subsets: ["latin"],
  weight: ["400"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={font.className}>
      <Component {...pageProps} />
    </main>
  );
}
