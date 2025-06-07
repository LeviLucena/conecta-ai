
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthGuard } from '@/components/layout/auth-guard';

export const metadata: Metadata = {
  title: 'Conecta Aí',
  description: 'Conecta Aí - Sua nova forma de conectar.',
  manifest: '/manifest.json',
  themeColor: '#42A5F5',
  appleWebAppCapable: 'yes',
  appleWebAppStatusBarStyle: 'default',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon-180x180.png" />
      </head>
      <body className="font-body antialiased">
        <AuthGuard>
          {children}
        </AuthGuard>
        <Toaster />
      </body>
    </html>
  );
}
