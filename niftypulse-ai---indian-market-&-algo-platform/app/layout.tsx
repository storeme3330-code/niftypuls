import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'NiftyPulse AI - Indian Market & Algo Trading Platform',
  description: 'Intelligent Indian stock & options trading terminal with 5-minute pre-market scanners, live momentum share lists, TradingView charts, automated algo bots, multi-broker integration, and beginner paper trading.',
  openGraph: {
    title: 'NiftyPulse AI - Indian Market & Algo Trading Platform',
    description: 'Intelligent Indian stock & options trading terminal with 5-minute pre-market scanners, live momentum share lists, TradingView charts, automated algo bots, multi-broker integration, and beginner paper trading.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NiftyPulse AI - Indian Market & Algo Trading Platform',
    description: 'Intelligent Indian stock & options trading terminal with 5-minute pre-market scanners, live momentum share lists, TradingView charts, automated algo bots, multi-broker integration, and beginner paper trading.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
