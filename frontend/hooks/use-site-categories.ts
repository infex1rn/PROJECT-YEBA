"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"

export function useSiteCategories() {
  const [categories, setCategories] = useState<string[]>([])
  const [error, setError] = useState("")
  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      const response = await apiClient.getSiteSettings(controller.signal)
      if (controller.signal.aborted) return
      if (response.success && response.data) setCategories(response.data.data.categories)
      else setError(response.error || "Unable to load design categories.")
    }
    void load()
    return () => controller.abort()
  }, [])
  return { categories, error }
}
