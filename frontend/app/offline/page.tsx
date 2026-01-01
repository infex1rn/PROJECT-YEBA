'use client';

import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-muted">
            <WifiOff className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">You're Offline</h1>
          <p className="text-muted-foreground">
            It looks like you've lost your internet connection. Some features may not be available until you're back online.
          </p>
        </div>
        <div className="space-y-3">
          <Button className="w-full" onClick={() => window.location.reload()}>
            Try Again
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Cached designs and your favorites are still available offline.
        </p>
      </div>
    </div>
  );
}
