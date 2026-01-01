import { MobileLayout } from '@/components/mobile/MobileLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobile - DeepFold',
  description: 'Browse premium design assets on mobile',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function MobileRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileLayout>{children}</MobileLayout>;
}
