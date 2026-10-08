"use client"

import { useState } from "react"
import { apiClient } from "@/lib/api-client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, ImageIcon, CreditCard, Flag, Settings, LogOut, Shield } from "lucide-react"

const sidebarItems = [
  {
    title: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Designs Management",
    href: "/admin/designs",
    icon: ImageIcon,
  },
  {
    title: "Transactions",
    href: "/admin/transactions",
    icon: CreditCard,
  },
  {
    title: "Reports & Moderation",
    href: "/admin/reports",
    icon: Flag,
  },
  {
    title: "Site Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError("");
    const result = await apiClient.logout();
    if (result.success) router.replace("/admin/login");
    else setLogoutError(result.error || "Unable to sign out. Please retry.");
    setLoggingOut(false);
  };

  return (
    <div className="flex w-full shrink-0 flex-col md:h-full md:w-64 bg-sidebar border-r border-sidebar-border">
      {logoutError && <p role="alert" className="p-4 text-destructive">{logoutError}</p>}
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-sidebar-accent rounded-lg flex items-center justify-center">
            <Shield className="h-4 w-4 text-sidebar-accent-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">Admin Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex gap-1 overflow-x-auto p-2 md:block md:flex-1 md:space-y-1 md:p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href} className="shrink-0">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start space-x-2 h-10",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          onClick={handleLogout} disabled={loggingOut}
          className="w-full justify-start space-x-2 h-10 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}
