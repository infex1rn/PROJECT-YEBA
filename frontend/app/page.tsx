"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Star, Search, TrendingUp, Download, Eye, Heart, ArrowRight } from "lucide-react"
import { FaPalette, FaTshirt, FaMobileAlt, FaCreditCard } from "react-icons/fa"
import { BsImageFill } from "react-icons/bs"
import Link from "next/link"

export default function HomePage() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      }
    }
  }

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      }
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      rotateX: 5,
      z: 50,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Clean & Professional */}
        <section className="relative py-16 md:py-24 px-4 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
                  <TrendingUp className="w-3 h-3 mr-2 inline" />
                  Over 10,000+ Premium Designs
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                  Premium Design Assets
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    For Creative Projects
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  High-quality templates, graphics, and UI kits created by professional designers
                </p>
              </motion.div>

              {/* Search Bar - Marketplace Standard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-2xl mx-auto"
              >
                <div className="relative glass-card p-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-muted-foreground ml-3" />
                    <Input
                      type="search"
                      placeholder="Search for templates, graphics, UI kits..."
                      className="border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button size="lg" className="px-6">
                      Search
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4 text-sm text-muted-foreground">
                  <span>Popular:</span>
                  <Link href="/marketplace?q=logo" className="hover:text-foreground transition-colors">Logo Templates</Link>
                  <span aria-hidden="true">•</span>
                  <Link href="/marketplace?q=ui" className="hover:text-foreground transition-colors">UI Kits</Link>
                  <span aria-hidden="true">•</span>
                  <Link href="/marketplace?q=mockup" className="hover:text-foreground transition-colors">Mockups</Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories Section - Simple Grid */}
        <section className="py-12 px-4 border-y">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Browse by Category
              </h2>
              <Link href="/marketplace" className="text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { name: "Logos", icon: FaPalette, color: "from-blue-500 to-cyan-500", count: "2.3k" },
                { name: "Illustrations", icon: BsImageFill, color: "from-purple-500 to-pink-500", count: "1.8k" },
                { name: "Templates", icon: FaTshirt, color: "from-green-500 to-emerald-500", count: "3.1k" },
                { name: "UI Kits", icon: FaMobileAlt, color: "from-orange-500 to-red-500", count: "950" },
                { name: "Mockups", icon: FaCreditCard, color: "from-indigo-500 to-blue-500", count: "1.2k" },
              ].map((category) => {
                const IconComponent = category.icon
                return (
                  <Link key={category.name} href={`/marketplace?category=${category.name}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="glass-card cursor-pointer h-full hover:border-primary/50 transition-all">
                        <CardContent className="p-6 text-center">
                          <div className={`mb-3 p-4 rounded-xl bg-gradient-to-br ${category.color} inline-flex items-center justify-center`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="font-semibold text-base mb-1">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.count} items</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured Designs Section - Marketplace Style */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Trending Designs
                </h2>
                <p className="text-muted-foreground">
                  Most popular this week
                </p>
              </div>
              <Link href="/marketplace" className="text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Modern Logo Collection", price: "$24", sales: "156", rating: "4.9", author: "Sarah Johnson" },
                { title: "UI Kit Pro Bundle", price: "$45", sales: "203", rating: "4.8", author: "Mike Chen" },
                { title: "Social Media Templates", price: "$19", sales: "124", rating: "4.7", author: "Emma Davis" },
                { title: "Website Mockup Pack", price: "$32", sales: "89", rating: "4.9", author: "James Wilson" },
              ].map((design, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/marketplace/design-${index + 1}`}>
                    <Card className="glass-card group cursor-pointer overflow-hidden h-full hover:border-primary/50 transition-all">
                      {/* Product Image */}
                      <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-purple-200/20 to-pink-200/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" className="glass">
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
                            <Button size="sm" variant="secondary" className="glass">
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-base mb-2 truncate group-hover:text-primary transition-colors">
                          {design.title}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{design.rating}</span>
                            <span className="text-xs text-muted-foreground">({design.sales})</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Download className="w-3.5 h-3.5" />
                            {design.sales}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <span className="text-xs text-muted-foreground">by {design.author}</span>
                          <span className="text-lg font-bold text-primary">{design.price}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Designers Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Top Creators
                </h2>
                <p className="text-muted-foreground">
                  Designers with the highest rated products
                </p>
              </div>
              <Link href="/marketplace?sort=top-sellers" className="text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { name: "Sarah Johnson", designs: 45, rating: 4.9, sales: "2.4k", badge: "Top Seller" },
                { name: "Mike Chen", designs: 38, rating: 4.8, sales: "1.8k", badge: "Featured" },
                { name: "Emma Davis", designs: 52, rating: 4.9, sales: "3.2k", badge: "Top Seller" },
                { name: "James Wilson", designs: 29, rating: 4.7, sales: "1.2k", badge: "Rising Star" },
              ].map((designer, index) => (
                <motion.div
                  key={designer.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/designers/${designer.name.toLowerCase().replaceAll(' ', '-')}`}>
                    <Card className="glass-card group cursor-pointer hover:border-primary/50 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div 
                            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0" 
                            role="img"
                            aria-label={`${designer.name}'s profile picture`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
                                {designer.name}
                              </h3>
                              <Badge variant="secondary" className="text-xs flex-shrink-0">
                                {designer.badge}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {designer.designs} products
                            </p>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{designer.rating}</span>
                              </div>
                              <span className="text-muted-foreground">{designer.sales} sales</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Start Selling Your Designs Today
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of creators earning from their designs. It's free to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/designer-signup">
                  <Button size="lg" className="px-8 py-6 text-lg">
                    Become a Creator
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="glass-button px-8 py-6 text-lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
