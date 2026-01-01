'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Search, Filter, Heart, ShoppingCart, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import Image from 'next/image';

export default function MobileMarketplace() {
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const categories = ['All', 'Logos', 'Templates', 'Icons', 'Illustrations', 'UI Kits', 'Mockups'];

  useEffect(() => {
    loadDesigns();
  }, [selectedCategory, page]);

  const loadDesigns = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getDesigns({
        page,
        limit: 20,
        category: selectedCategory === 'All' ? undefined : selectedCategory || undefined,
        search: searchQuery || undefined,
      });
      setDesigns(response.designs || []);
    } catch (error) {
      console.error('Failed to load designs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadDesigns();
  };

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="px-4 py-3 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 h-11"
              />
            </div>
            <Button size="lg" onClick={handleSearch}>
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category || (category === 'All' && !selectedCategory) ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category === 'All' ? null : category)}
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
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No designs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {designs.map((design) => (
              <Card key={design.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={design.images?.[0] || '/placeholder.svg'}
                    alt={design.title}
                    fill
                    className="object-cover"
                  />
                  <button className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="font-semibold text-sm line-clamp-1">{design.title}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">${design.price}</p>
                    <Button size="sm" variant="ghost">
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
        {!loading && designs.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => setPage(page + 1)}>
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
