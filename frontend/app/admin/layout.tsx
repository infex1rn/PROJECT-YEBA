"use client"

import type React from "react"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname.replace(/\/$/, "") === "/admin/login"

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <AdminAuthGuard>
      <div className="flex h-screen flex-col bg-background md:flex-row">
        <AdminSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  )
}
