'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Search, Filter, Heart, ShoppingCart, Loader2 } from 'lucide-react';
import { useSiteCategories } from '@/hooks/use-site-categories';
import { apiClient, MarketplaceDesign } from '@/lib/api-client';
import Image from 'next/image';

export default function MobileMarketplace() {
  const [designs, setDesigns] = useState<MarketplaceDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { categories: configuredCategories, error: categoryError } = useSiteCategories();
  const categories = ['All', ...configuredCategories];

  const [submittedSearch, setSubmittedSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const loadDesigns = async () => {
      setLoading(true);
      setError(null);
      const response = await apiClient.getDesigns({
        page, limit: 20,
        category: selectedCategory || undefined,
        search: submittedSearch || undefined,
      }, controller.signal);
      if (controller.signal.aborted) return;
      if (!response.success || !response.data) {
        setError(response.error || 'Unable to load designs. Please retry.');
      } else {
        const items = response.data.designs;
        setDesigns(previous => page === 1 ? items : [
          ...previous, ...items.filter(item => !previous.some(existing => existing.id === item.id)),
        ]);
        setTotalPages(response.data.pagination.totalPages);
      }
      setLoading(false);
    };
    void loadDesigns();
    return () => controller.abort();
  }, [selectedCategory, page, submittedSearch, retry]);

  const handleSearch = () => {
    setPage(1);
    setSubmittedSearch(searchQuery.trim());
    setRetry(value => value + 1);
  };

  return (
    <div className="min-h-screen">
      {categoryError && <p role="alert" className="p-4 text-destructive">{categoryError}</p>}
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="px-4 py-3 space-y-3">
          <form className="flex gap-2" onSubmit={event => { event.preventDefault(); handleSearch(); }}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                aria-label="Search designs"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Button size="lg" type="submit" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
          </form>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category || (category === 'All' && !selectedCategory) ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setPage(1); setSelectedCategory(category === 'All' ? null : category); }}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Designs Grid */}
      <div className="px-4 py-4">
        {error && <div role="alert" className="mb-4 space-y-2">
          <p>{error}</p><Button onClick={() => setRetry(value => value + 1)}>Retry</Button>
        </div>}
        {loading && page === 1 ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : designs.length === 0 && !error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No designs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {designs.map((design) => (
              <Card key={design.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={design.watermarkedPreviewUrl}
                    alt={design.title}
                    fill
                    className="object-cover"
                  />
                  <button aria-label={`Save ${design.title} to favorites`} className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="font-semibold text-sm line-clamp-1">{design.title}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">${design.price}</p>
                    <Button size="sm" variant="ghost" aria-label={`Add ${design.title} to cart`}>
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                  {design.category && (
                    <Badge variant="secondary" className="text-xs">
                      {design.category}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {designs.length > 0 && page < totalPages && (
          <div className="mt-6 text-center">
            <Button variant="outline" disabled={loading || !!error} onClick={() => setPage(page + 1)}>
              {loading ? 'Loading…' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
