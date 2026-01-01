import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Shield } from 'lucide-react';

export default function MobilePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-4 pt-8 pb-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to <span className="text-primary">DeepFold</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Discover and purchase premium design assets from talented designers worldwide
            </p>
            <div className="flex flex-col gap-3 pt-4">
              <Button size="lg" className="w-full" asChild>
                <Link href="/m/marketplace">
                  Browse Designs <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full" asChild>
                <Link href="/m/designer-signup">Become a Designer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-12">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Why Choose DeepFold?</h2>
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Curated collection of high-quality designs from verified designers
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Secure Transactions</h3>
                <p className="text-sm text-muted-foreground">
                  Safe and secure payment processing with buyer protection
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Growing Community</h3>
                <p className="text-sm text-muted-foreground">
                  Join thousands of designers and buyers in our marketplace
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-12 bg-muted/30">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {['Logos', 'Templates', 'Icons', 'Illustrations', 'UI Kits', 'Mockups'].map((category) => (
              <Link
                key={category}
                href={`/m/marketplace?category=${category}`}
                className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-center"
              >
                <p className="font-medium">{category}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
