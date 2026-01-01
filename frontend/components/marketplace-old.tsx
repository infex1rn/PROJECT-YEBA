"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Heart, Download, Eye, Star, ShoppingCart } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample design data - replace with real data from your API
const sampleDesigns = [
  {
    id: 1,
    title: "Modern Logo Collection",
    designer: "Sarah Johnson",
    rating: 4.8,
    price: 25,
    category: "Logos",
    downloads: 156,
    preview_url: "/api/placeholder/300/200",
    tags: ["modern", "minimalist", "logo"],
    featured: true
  },
  {
    id: 2,
    title: "Social Media Templates",
    designer: "Mike Chen",
    rating: 4.6,
    price: 18,
    category: "Templates",
    downloads: 89,
    preview_url: "/api/placeholder/300/200",
    tags: ["social", "instagram", "templates"],
    featured: false
  },
  {
    id: 3,
    title: "Business Card Designs",
    designer: "Emma Davis",
    rating: 4.9,
    price: 12,
    category: "Print",
    downloads: 203,
    preview_url: "/api/placeholder/300/200",
    tags: ["business", "professional", "cards"],
    featured: true
  },
  {
    id: 4,
    title: "Web UI Kit",
    designer: "Alex Rodriguez",
    rating: 4.7,
    price: 45,
    category: "UI/UX",
    downloads: 67,
    preview_url: "/api/placeholder/300/200",
    tags: ["ui", "web", "components"],
    featured: false
  },
  {
    id: 5,
    title: "Poster Templates",
    designer: "Lisa Park",
    rating: 4.5,
    price: 22,
    category: "Print",
    downloads: 134,
    preview_url: "/api/placeholder/300/200",
    tags: ["poster", "event", "marketing"],
    featured: false
  },
  {
    id: 6,
    title: "Icon Pack - 200 Icons",
    designer: "David Kim",
    rating: 4.8,
    price: 30,
    category: "Icons",
    downloads: 298,
    preview_url: "/api/placeholder/300/200",
    tags: ["icons", "vector", "pack"],
    featured: true
  }
]

const categories = ["All", "Logos", "Templates", "Print", "UI/UX", "Icons", "Illustrations"]
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" }
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("popular")
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [cartItems, setCartItems] = useState(new Set())

  // Filter and sort designs
  const filteredDesigns = sampleDesigns
    .filter(design => {
      const matchesSearch = design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           design.designer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           design.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "All" || design.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.id - a.id
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "popular":
        default:
          return b.downloads - a.downloads
      }
    })

  const toggleFavorite = (designId) => {
    setFavoriteIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(designId)) {
        newSet.delete(designId)
      } else {
        newSet.add(designId)
      }
      return newSet
    })
  }

  const addToCart = (designId: number) => {
    setCartItems(prev => new Set([...prev, designId]))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Design Marketplace</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover thousands of premium designs from talented creators worldwide
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search designs, creators, or tags..."
              className="pl-10 h-12 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="lg:ml-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredDesigns.length} design{filteredDesigns.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Design Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDesigns.map(design => (
            <Card key={design.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader className="p-0">
                {/* Design Preview */}
                <div className="relative overflow-hidden rounded-t-lg bg-gray-100">
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Design Preview</span>
                  </div>
                  
                  {/* Featured Badge */}
                  {design.featured && (
                    <Badge className="absolute top-2 left-2 bg-primary">
                      Featured
                    </Badge>
                  )}

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(design.id)
                      }}
                    >
                      <Heart className={`h-4 w-4 ${favoriteIds.has(design.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>

                  {/* Download Count */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {design.downloads}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                {/* Design Info */}
                <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{design.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">by {design.designer}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{design.rating}</span>
                  <span className="text-xs text-muted-foreground">({design.downloads})</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {design.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">${design.price}</span>
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation()
                      addToCart(design.id)
                    }}
                    disabled={cartItems.has(design.id)}
                    className="h-8"
                  >
                    {cartItems.has(design.id) ? (
                      "Added"
                    ) : (
                      <>
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredDesigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">No designs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Cart Summary */}
        {cartItems.size > 0 && (
          <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="font-medium">{cartItems.size} item{cartItems.size !== 1 ? 's' : ''} in cart</span>
            </div>
            <Button size="sm" variant="secondary" className="w-full">
              View Cart
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}