import Navbar from '@/components/Navbar';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import NextTopLoader from 'nextjs-toploader';

export const metadata = {
  title: 'Cardano Wallet Explorer',
  description: 'Explore Cardano wallets, NFTs, and transactions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="inter">
        <NextTopLoader 
          color="#3B82F6" // Blue color matching your theme
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800 py-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
