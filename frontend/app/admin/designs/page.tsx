"use client"

import { useState } from "react"
import { AdminCollection, type CollectionQuery } from "@/components/admin-collection"
import { apiClient } from "@/lib/api-client"
import type { AdminDesign } from "@/lib/admin-types"
import { Button } from "@/components/ui/button"

async function load(query: CollectionQuery, signal: AbortSignal) {
  const response = await apiClient.getAllDesignsAdmin(query, signal)
  return { ...response, data: response.data ? { rows: response.data.data.designs, pagination: response.data.data.pagination } : undefined }
}
function DesignPreview({ design }: { design: AdminDesign }) {
  const [failed, setFailed] = useState(false)
  return <details><summary className="cursor-pointer">View submission</summary>
    {failed ? <p role="status">The preview could not be loaded.</p> : <img src={design.watermarkedPreviewUrl} alt={`Preview of ${design.title}`} width={240} height={180} loading="lazy" onError={() => setFailed(true)} className="my-2 max-w-none rounded object-contain" />}
    <p className="max-w-sm whitespace-pre-wrap">{design.description || "No description supplied."}</p><p>Price: {design.price.toFixed(2)}</p>
  </details>
}

export default function DesignsPage() {
  return <AdminCollection<AdminDesign> title="Design management" description="Review submissions and preserve purchase history when archiving designs." searchable load={load} statuses={["PENDING", "APPROVED", "REJECTED", "FLAGGED"]} columns={[
    { label: "Design", render: design => <div><p className="font-medium">{design.title}</p><p className="text-muted-foreground">#{design.id} · {design.category}</p><p>{design.designer.user.name}</p>{design.archivedAt && <p>Archived {new Date(design.archivedAt).toLocaleDateString()}</p>}</div> },
    { label: "Preview", render: design => <DesignPreview design={design} /> },
    { label: "Status", render: (design, mutate, busy) => <select className="rounded border bg-background p-2" aria-label={`Moderation for ${design.title}`} value={design.status} disabled={busy || !!design.archivedAt} onChange={event => void mutate(() => apiClient.moderateDesign(design.id, event.target.value))}>{["PENDING", "APPROVED", "REJECTED", "FLAGGED"].map(status => <option key={status} value={status} disabled={status === "PENDING"}>{status.toLowerCase()}</option>)}</select> },
    { label: "Actions", render: (design, mutate, busy) => <Button variant="outline" disabled={busy || !!design.archivedAt} onClick={() => void mutate(() => apiClient.deleteDesignAdmin(design.id))}>Archive</Button> },
  ]} />
}
