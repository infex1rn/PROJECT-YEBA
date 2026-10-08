"use client"

import { useEffect, useRef, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { SiteSettings } from "@/lib/admin-types"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [categories, setCategories] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const pending = useRef(false)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      setError("")
      const response = await apiClient.getAdminSettings(controller.signal)
      if (controller.signal.aborted) return
      if (response.success && response.data) {
        setSettings(response.data.data)
        setCategories(response.data.data.categories.join("\n"))
      } else setError(response.error || "Unable to load settings.")
      setLoading(false)
    }
    void load()
    return () => controller.abort()
  }, [refresh])

  const save = async () => {
    if (!settings || pending.current) return
    pending.current = true
    setSaving(true)
    setError("")
    setNotice("")
    const response = await apiClient.updateSettings({
      version: settings.version, maintenanceMode: settings.maintenanceMode,
      userRegistration: settings.userRegistration, designApproval: settings.designApproval,
      categories: categories.split("\n").map(value => value.trim()).filter(Boolean),
    })
    if (!response.success) setError(response.error || "Settings could not be confirmed. Reload and retry.")
    else { setNotice("Settings confirmed by the server."); setRefresh(value => value + 1) }
    pending.current = false
    setSaving(false)
  }

  return <section className="max-w-2xl space-y-5">
    <div><h2 className="text-2xl font-semibold">Platform settings</h2><p className="text-muted-foreground">These controls are enforced by the API. Payment and storage credentials are managed on the server.</p></div>
    {error && <p role="alert" className="text-destructive">{error}</p>}{notice && <p role="status">{notice}</p>}
    {loading && <p role="status">Loading settings…</p>}
    {settings && <form className="space-y-5" onSubmit={event => { event.preventDefault(); void save() }}>
      <fieldset className="space-y-4" disabled={saving || loading}>
        <label className="flex items-start gap-3"><input type="checkbox" checked={settings.maintenanceMode} onChange={event => setSettings({ ...settings, maintenanceMode: event.target.checked })} /><span>Maintenance mode<span className="block text-sm text-muted-foreground">Pause public marketplace requests while administrators retain access.</span></span></label>
        <label className="flex items-start gap-3"><input type="checkbox" checked={settings.userRegistration} onChange={event => setSettings({ ...settings, userRegistration: event.target.checked })} /><span>Allow new accounts<span className="block text-sm text-muted-foreground">Controls buyer and designer registration.</span></span></label>
        <label className="flex items-start gap-3"><input type="checkbox" checked={settings.designApproval} onChange={event => setSettings({ ...settings, designApproval: event.target.checked })} /><span>Require design approval<span className="block text-sm text-muted-foreground">New submissions remain pending until an administrator approves them.</span></span></label>
        <label className="block space-y-2"><span>Design categories, one per line</span><textarea className="block w-full rounded border bg-background p-3" rows={8} value={categories} onChange={event => setCategories(event.target.value)} required /></label>
      </fieldset>
      <div className="flex gap-3"><Button type="submit" disabled={saving || loading}>{saving ? "Saving…" : "Save settings"}</Button><Button type="button" variant="outline" disabled={saving || loading} onClick={() => setRefresh(value => value + 1)}>Reload</Button></div>
    </form>}
    {!settings && !loading && <Button variant="outline" onClick={() => setRefresh(value => value + 1)}>Retry</Button>}
  </section>
}
