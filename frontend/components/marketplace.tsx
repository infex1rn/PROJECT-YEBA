"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Heart, ShoppingCart, Star, Loader2, Sparkles } from "lucide-react"
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    }
  }
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    }
  },
  hover: {
    y: -10,
    scale: 1.02,
    rotateX: 2,
    rotateY: 2,
    z: 50,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    }
  }
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
      {/* Enhanced Header Section with Gradient and Animation */}
      <motion.div 
        className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 px-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(255, 117, 140, 0.3), transparent 50%)",
              "radial-gradient(circle at 50% 80%, rgba(120, 119, 198, 0.3), transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              <motion.span
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                Explore Designs
              </motion.span>
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Discover thousands of premium design assets from talented creators
            </p>
          </motion.div>

          {/* Search and Filters with Enhanced Animation */}
          <motion.div 
            className="flex flex-col md:flex-row gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search designs, designers, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background/80 backdrop-blur-sm border-2 focus:border-primary transition-colors"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 h-12 bg-background/80 backdrop-blur-sm border-2">
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
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Category Filters with Hover Animation */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full transition-all ${
                    selectedCategory === category 
                      ? "shadow-lg shadow-primary/30" 
                      : ""
                  }`}
                >
                  {category}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              className="flex justify-center items-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="h-8 w-8 text-primary" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {!isLoading && designs.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              </motion.div>
              <p className="text-muted-foreground text-lg mb-4">No designs found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Designs Grid with 3D Effects */}
        <AnimatePresence mode="wait">
          {!isLoading && designs.length > 0 && (
            <>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={`${searchQuery}-${selectedCategory}-${sortBy}-${currentPage}`}
              >
                {designs.map((design, index) => (
                  <motion.div
                    key={design.id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="transform-gpu"
                    custom={index}
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-shadow border-2 hover:border-primary/50 h-full">
                      <CardHeader className="p-0">
                        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                          <motion.img
                            src={design.watermarkedPreviewUrl || "/placeholder.svg"}
                            alt={design.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          {/* Gradient Overlay */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />

                          {/* Action Buttons */}
                          <div className="absolute top-2 right-2 flex gap-2">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm shadow-lg"
                                onClick={() => toggleFavorite(design.id)}
                              >
                                <Heart
                                  className={`h-4 w-4 ${
                                    favoriteIds.has(design.id) ? "fill-red-500 text-red-500" : ""
                                  }`}
                                />
                              </Button>
                            </motion.div>
                          </div>

                          {/* Category Badge */}
                          <div className="absolute top-2 left-2">
                            <motion.div
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Badge className="bg-primary/90 backdrop-blur-sm shadow-lg">
                                {design.category}
                              </Badge>
                            </motion.div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground line-clamp-1">{design.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">{design.designer.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{design.designer.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.span 
                              className="text-lg font-bold text-primary"
                              whileHover={{ scale: 1.1 }}
                            >
                              ${design.price}
                            </motion.span>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                size="sm"
                                onClick={() => addToCart(design.id)}
                                disabled={cartItems.has(design.id)}
                                className="shadow-md"
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
                            </motion.div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination with Animation */}
              {pagination && pagination.totalPages > 1 && (
                <motion.div 
                  className="flex justify-center items-center gap-2 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                  </motion.div>
                  <span className="text-sm text-muted-foreground px-4">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      disabled={currentPage === pagination.totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
