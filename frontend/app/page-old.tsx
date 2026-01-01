import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { FaPalette, FaTshirt, FaMobileAlt, FaCreditCard } from "react-icons/fa"
import { BsImageFill } from "react-icons/bs"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Discover & Buy Creative Designs
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Browse high-quality designs from top creators and bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
                Explore Designs
              </Button>
            </Link>
            <Link href="/designer-signup">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 px-8 py-3 text-lg bg-transparent"
              >
                Become a Designer
              </Button>
            </Link>
          </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { name: "Logos", icon: FaPalette },
                { name: "Posters", icon: BsImageFill },
                { name: "T-Shirts", icon: FaTshirt },
                { name: "Social Media", icon: FaMobileAlt },
                { name: "Business Cards", icon: FaCreditCard },
              ].map((category) => {
                const IconComponent = category.icon
                return (
                  <Card key={category.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3 flex justify-center items-center">
                        <IconComponent className="w-10 h-10" />
                      </div>
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Featured Designs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  image: "/minimalist-logo-design-pack.png",
                  title: "Minimalist Logo Pack",
                  price: "$12",
                  designer: "Jane Doe",
                },
                {
                  image: "/vintage-poster-bundle-design.png",
                  title: "Vintage Poster Bundle",
                  price: "$20",
                  designer: "John Smith",
                },
                {
                  image: "/social-media-templates-design.png",
                  title: "Social Media Templates",
                  price: "$15",
                  designer: "Emily Lee",
                },
              ].map((design) => (
                <Card key={design.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={design.image || "/placeholder.svg"}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">{design.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">{design.price}</span>
                      <span className="text-sm text-muted-foreground">by {design.designer}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Top Designers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  avatar: "/professional-designer-avatar-jane-doe.png",
                  name: "Jane Doe",
                  rating: "4.9",
                  specialty: "Branding & Logos",
                },
                {
                  avatar: "/professional-designer-avatar-john-smith.png",
                  name: "John Smith",
                  rating: "4.8",
                  specialty: "Posters & Prints",
                },
              ].map((designer) => (
                <Card key={designer.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <img
                      src={designer.avatar || "/placeholder.svg"}
                      alt={designer.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{designer.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{designer.specialty}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{designer.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">Join DeepFold Today</h2>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Whether you're a designer looking to sell or a buyer looking for quality work — DeepFold is for you.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
              Get Started
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
