import { MobileNav } from './MobileNav';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen pb-16">
      {/* Main content */}
      <main className="pb-safe">
        {children}
      </main>

      {/* Bottom navigation */}
      <MobileNav />
    </div>
  );
}
