"use client"

import Link from "next/link"
import { useTheme } from "@/components/theme-provider"
import { Sun, Moon, Shield } from "lucide-react"
import { FaLayerGroup } from "react-icons/fa"
import { Button } from "@/components/ui/button"

export function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-border/40">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo - Enhanced Design */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-50" />
              <FaLayerGroup className="h-5 w-5 text-white relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground tracking-tight">DeepFold</span>
              <span className="text-[10px] text-muted-foreground -mt-1">Design Marketplace</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 rounded-lg text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium">
              Home
            </Link>
            <Link href="/marketplace" className="px-4 py-2 rounded-lg text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium">
              Marketplace
            </Link>
            <Link href="/about" className="px-4 py-2 rounded-lg text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium">
              About
            </Link>
            <Link href="/contact" className="px-4 py-2 rounded-lg text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 font-medium">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Link href="/admin/login">
              <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-2 glass-button">
                <Shield className="h-4 w-4" />
                <span>Log In</span>
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 hover:bg-primary/10"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
