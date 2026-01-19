// app/layout.tsx
import './globals.css'; // ⚠️ importantíssimo para Tailwind
import { ReactNode } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BreadcrumbsWrapper from './components/BreadcrumbsWrapper';


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <body className="bg-gray-50 text-gray-900">
        <Header />

        <main className="max-w-6xl mx-auto px-4 md:px-0 py-10 space-y-10">
          <BreadcrumbsWrapper /> {/* Sempre fora da Home */}
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
