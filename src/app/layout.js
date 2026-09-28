import { Montserrat, Oswald } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
});

export const metadata = {
  title: "Copa Primavera - Padel",
  description: "Sistema de gestión y fixture de la Copa Primavera de Padel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${oswald.variable}`}>
      <body className="font-sans font-montserrat">{children}</body>
    </html>
  );
}
