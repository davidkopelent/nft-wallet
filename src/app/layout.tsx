import Navbar from '@/components/Navbar';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import NextTopLoader from 'nextjs-toploader';

export const metadata = {
  title: 'Cardano Wallet Explorer',
  description: 'Explore Cardano wallets, NFTs, and transactions',
  icons: {
    icon: '/images/cardano.ico',
  },
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
          color="rgb(253, 111, 77)"
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
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900/95 py-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
