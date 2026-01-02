import Link from "next/link"
import { FaLayerGroup, FaTwitter, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa"
import { Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  // Use fixed year to avoid hydration mismatches
  const currentYear = 2025

  return (
    <footer className="glass border-t border-border/40 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                <FaLayerGroup className="h-5 w-5 text-white relative z-10" />
              </div>
              <span className="text-xl font-bold text-foreground">DeepFold</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your premier marketplace for high-quality design assets. Empowering creators worldwide.
            </p>
            <div className="flex space-x-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our Twitter page" className="w-9 h-9 rounded-lg glass-button flex items-center justify-center hover:text-primary transition-colors">
                <FaTwitter className="h-4 w-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our GitHub repository" className="w-9 h-9 rounded-lg glass-button flex items-center justify-center hover:text-primary transition-colors">
                <FaGithub className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our LinkedIn page" className="w-9 h-9 rounded-lg glass-button flex items-center justify-center hover:text-primary transition-colors">
                <FaLinkedin className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram profile" className="w-9 h-9 rounded-lg glass-button flex items-center justify-center hover:text-primary transition-colors">
                <FaInstagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Marketplace Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Marketplace</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/marketplace" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Designs
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Logos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Logos
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Templates" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=UI Kits" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  UI Kits
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Mockups" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Mockups
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/designer-signup" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Become a Designer
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:hello@deepfold.com" className="hover:text-primary transition-colors">
                  hello@deepfold.com
                </a>
              </li>
              <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="tel:+12345678900" className="hover:text-primary transition-colors">
                  +1 (234) 567-8900
                </a>
              </li>
              <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>San Francisco, CA 94102</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} DeepFold. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
