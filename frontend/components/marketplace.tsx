"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Heart, Download, Eye, Star, ShoppingCart, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/lib/api-client"
import { Alert, AlertDescription } from "@/components/ui/alert"

const categories = ["All", "Logos", "Templates", "Print", "UI/UX", "Icons", "Illustrations"]
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" }
]

interface Design {
  id: number;
  title: string;
  description?: string;
  category: string;
  price: number;
  watermarkedPreviewUrl: string;
  designer: {
    id: number;
    name: string;
    rating: number;
  };
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [cartItems, setCartItems] = useState(new Set())
  
  // API state
  const [designs, setDesigns] = useState<Design[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch designs from API
  useEffect(() => {
    const fetchDesigns = async () => {
      setIsLoading(true)
      setError(null)

      const params: any = {
        page: currentPage,
        limit: 20,
        sortBy,
      }

      if (selectedCategory !== "All") {
        params.category = selectedCategory
      }

      if (searchQuery.trim()) {
        params.search = searchQuery
      }

      const response = await apiClient.getDesigns(params)

      if (response.success && response.data) {
        setDesigns(response.data.designs || [])
        setPagination(response.data.pagination)
      } else {
        setError(response.error || "Failed to load designs")
      }

      setIsLoading(false)
    }

    // Debounce search
    const timer = setTimeout(() => {
      fetchDesigns()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, selectedCategory, sortBy, currentPage])

  const toggleFavorite = (designId: number) => {
    const newFavorites = new Set(favoriteIds)
    if (newFavorites.has(designId)) {
      newFavorites.delete(designId)
    } else {
      newFavorites.add(designId)
    }
    setFavoriteIds(newFavorites)
  }

  const addToCart = (designId: number) => {
    const newCart = new Set(cartItems)
    newCart.add(designId)
    setCartItems(newCart)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-primary/5 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-foreground mb-4">Explore Designs</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Discover thousands of premium design assets from talented creators
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search designs, designers, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 h-12 bg-background">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && designs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">No designs found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Designs Grid */}
        {!isLoading && designs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design) => (
                <Card key={design.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="relative aspect-[4/3] bg-muted">
                      <img
                        src={design.watermarkedPreviewUrl || "/placeholder.svg"}
                        alt={design.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 rounded-full"
                          onClick={() => toggleFavorite(design.id)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              favoriteIds.has(design.id) ? "fill-red-500 text-red-500" : ""
                            }`}
                          />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground line-clamp-1">{design.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{design.designer.name}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {design.category}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{design.designer.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">${design.price}</span>
                        <Button
                          size="sm"
                          onClick={() => addToCart(design.id)}
                          disabled={cartItems.has(design.id)}
                        >
                          {cartItems.has(design.id) ? (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
