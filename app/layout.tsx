import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monte Maria – A Sacred Pilgrimage Destination",
  description:
    "Discover the beauty and serenity of Monte Maria in Nasugbu, Batangas. A sacred destination for pilgrims, tourists, and those seeking peace.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
