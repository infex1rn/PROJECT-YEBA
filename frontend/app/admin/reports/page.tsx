"use client"

import { AdminCollection, type CollectionQuery } from "@/components/admin-collection"
import { apiClient } from "@/lib/api-client"
import type { AdminReport } from "@/lib/admin-types"
import { Button } from "@/components/ui/button"

async function load(query: CollectionQuery, signal: AbortSignal) {
  const response = await apiClient.getReports(query, signal)
  return { ...response, data: response.data ? { rows: response.data.data.reports, pagination: response.data.data.pagination } : undefined }
}
export default function ReportsPage() {
  return <AdminCollection<AdminReport> title="Reports and moderation" description="Review submitted reports and record decisions with a resolution note." load={load} statuses={["PENDING", "REVIEWING", "FLAGGED", "RESOLVED", "DISMISSED"]} columns={[
    { label: "Report", render: report => <div><p className="font-medium">#{report.id} · {report.reason}</p><p>{report.type.toLowerCase()} #{report.subjectId}</p><p className="text-muted-foreground">Reporter #{report.reporterId} · {new Date(report.createdAt).toLocaleString()}</p></div> },
    { label: "Status", render: report => report.status.toLowerCase() },
    { label: "Review", render: (report, mutate, busy) => <details><summary className="cursor-pointer">Read report</summary><p className="max-w-md whitespace-pre-wrap py-2">{report.description}</p>{report.resolution && <p className="whitespace-pre-wrap">Decision: {report.resolution}</p>}{!["RESOLVED", "DISMISSED"].includes(report.status) && <form className="min-w-56 space-y-2 pt-2" onSubmit={event => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)
      void mutate(() => apiClient.decideReport(report.id, { status: String(data.get("status")), expectedStatus: report.status, resolution: String(data.get("resolution")) }))
    }}><label className="block">Decision<select name="status" className="block w-full rounded border bg-background p-2" disabled={busy}><option value="REVIEWING">Under review</option><option value="FLAGGED">Escalate</option><option value="RESOLVED">Resolve</option><option value="DISMISSED">Dismiss</option></select></label><label className="block">Resolution note<textarea name="resolution" required minLength={3} maxLength={2000} rows={3} className="block w-full rounded border bg-background p-2" disabled={busy} /></label><Button type="submit" disabled={busy}>Save decision</Button></form>}</details> },
  ]} />
}
