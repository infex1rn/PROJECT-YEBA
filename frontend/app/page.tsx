"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Sparkles, Zap, TrendingUp } from "lucide-react"
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
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Parallax */}
        <motion.section 
          className="relative py-20 px-4 overflow-hidden"
          style={{ y, opacity }}
        >
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <motion.div
              className="absolute inset-0 opacity-30"
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
          </div>

          <motion.div 
            className="container mx-auto text-center max-w-4xl relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-6 liquid-shine"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">New: AI-Powered Design Tools</span>
              </motion.div>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance"
              variants={itemVariants}
            >
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
                Discover & Buy
              </motion.span>
              <br />
              Creative Designs
            </motion.h1>

            <motion.p 
              className="text-xl text-muted-foreground mb-8 text-pretty"
              variants={itemVariants}
            >
              Browse high-quality designs from top creators and bring your ideas to life with our marketplace.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Link href="/marketplace">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    className="relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg depth-shadow-lg liquid-shine"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span className="relative flex items-center gap-2">
                      Explore Designs
                      <Zap className="w-4 h-4" />
                    </span>
                  </Button>
                </motion.div>
              </Link>

              <Link href="/designer-signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="glass-button border-2 border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg"
                  >
                    <span className="flex items-center gap-2">
                      Become a Designer
                      <TrendingUp className="w-4 h-4" />
                    </span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/20 blur-xl"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-secondary/20 blur-xl"
              animate={{
                y: [0, 20, 0],
                x: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.section>

        {/* Categories Section with 3D Cards */}
        <section className="py-16 px-4 bg-muted/30 relative">
          <div className="container mx-auto max-w-6xl">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Browse by Category
            </motion.h2>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {[
                { name: "Logos", icon: FaPalette, color: "from-blue-500 to-cyan-500" },
                { name: "Posters", icon: BsImageFill, color: "from-purple-500 to-pink-500" },
                { name: "T-Shirts", icon: FaTshirt, color: "from-green-500 to-emerald-500" },
                { name: "Social Media", icon: FaMobileAlt, color: "from-orange-500 to-red-500" },
                { name: "Business Cards", icon: FaCreditCard, color: "from-indigo-500 to-blue-500" },
              ].map((category) => {
                const IconComponent = category.icon
                return (
                <motion.div
                  key={category.name}
                  variants={cardVariants}
                  whileHover="hover"
                  className="perspective-1000"
                >
                  <Link href={`/marketplace?category=${category.name}`}>
                    <Card className="glass-card cursor-pointer transform-gpu h-full border-2 hover:border-primary/50 transform-3d">
                      <CardContent className="p-8 text-center">
                        <motion.div
                          className={`text-5xl mb-4 p-4 rounded-2xl bg-gradient-to-br ${category.color} inline-block depth-shadow-lg flex items-center justify-center`}
                          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <IconComponent className="w-10 h-10 text-white" />
                        </motion.div>
                        <h3 className="font-semibold text-lg text-foreground">{category.name}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )})}
            </motion.div>
          </div>
        </section>

        {/* Featured Designs Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Designs
              </h2>
              <p className="text-muted-foreground text-lg">
                Handpicked designs from our top creators
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  variants={cardVariants}
                  whileHover="hover"
                  className="perspective-1000"
                >
                  <Card className="glass-card overflow-hidden border-2 hover:border-primary/50 h-full transform-3d">
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent"
                        animate={{
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-2">Featured Design {item}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                        <motion.span 
                          className="text-lg font-bold text-primary"
                          whileHover={{ scale: 1.1 }}
                        >
                          $25
                        </motion.span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link href="/marketplace">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="depth-shadow-lg liquid-shine">
                    View All Designs
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Top Designers Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Top Designers
            </motion.h2>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {[
                { name: "Sarah Johnson", designs: 45, rating: 4.9 },
                { name: "Mike Chen", designs: 38, rating: 4.8 },
                { name: "Emma Davis", designs: 52, rating: 4.7 },
              ].map((designer, index) => (
                <motion.div
                  key={designer.name}
                  variants={cardVariants}
                  whileHover="hover"
                  className="perspective-1000"
                >
                  <Card className="glass-card border-2 hover:border-primary/50 transform-3d">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 depth-shadow"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      />
                      <h3 className="font-bold text-xl mb-2">{designer.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {designer.designs} designs
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{designer.rating}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section 
          className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.5), transparent 40%)",
                "radial-gradient(circle at 80% 50%, rgba(255, 117, 140, 0.5), transparent 40%)",
                "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.5), transparent 40%)",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <motion.h2 
              className="text-3xl md:text-5xl font-bold text-foreground mb-6"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              Ready to Start Creating?
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground mb-8"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join thousands of designers selling their work on our platform
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/designer-signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="px-12 py-6 text-lg depth-shadow-lg liquid-shine">
                    Get Started Today
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  )
}
