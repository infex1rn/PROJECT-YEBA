import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-balance">About DeepFold</h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground leading-relaxed">
                DeepFold is a platform where graphic designers can upload and sell designs, while buyers can purchase
                ready-made work. We connect creative professionals with clients who need high-quality design solutions.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-6">
                Our mission is to empower designers to monetize their creativity while providing buyers with access to
                exceptional design work. Whether you're looking for logos, illustrations, web designs, or print
                materials, DeepFold is your go-to marketplace for professional design assets.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
