import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Praxis AI — ИИ для бизнеса в Грузии",
  description: "Обучение сотрудников, внедрение ИИ и разработка решений для бизнеса в Грузии.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
