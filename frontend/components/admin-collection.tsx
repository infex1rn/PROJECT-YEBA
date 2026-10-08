"use client"

import { useEffect, useState, useRef, type ReactNode } from "react"
import type { ApiResponse } from "@/lib/api-client"
import type { AdminPagination } from "@/lib/admin-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface CollectionQuery { page: number; limit: number; status?: string; search?: string }
export interface CollectionData<T> { rows: T[]; pagination: AdminPagination }
export type Mutation = (action: () => Promise<ApiResponse<unknown>>) => Promise<void>

export function AdminCollection<T extends { id: number }>({ title, description, statuses, searchable = false, load, columns }: {
  title: string; description: string; statuses: string[]; searchable?: boolean;
  load: (query: CollectionQuery, signal: AbortSignal) => Promise<ApiResponse<CollectionData<T>>>;
  columns: { label: string; render: (row: T, mutate: Mutation, busy: boolean) => ReactNode }[];
}) {
  const [rows, setRows] = useState<T[]>([])
  const [pagination, setPagination] = useState<AdminPagination | null>(null)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState("")
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const mutationPending = useRef(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const fetchRows = async () => {
      setLoading(true)
      setError("")
      const response = await load({ page, limit: 20, status: status || undefined, search: search || undefined }, controller.signal)
      if (controller.signal.aborted) return
      if (response.success && response.data) {
        setRows(response.data.rows)
        setPagination(response.data.pagination)
      } else setError(response.error || "Unable to load records. Please retry.")
      setLoading(false)
    }
    void fetchRows()
    return () => controller.abort()
  }, [load, page, status, search, refresh])

  const mutate: Mutation = async action => {
    if (mutationPending.current) return
    mutationPending.current = true
    setBusy(true)
    setError("")
    setNotice("")
    try {
      const response = await action()
      if (!response.success) setError(response.error || "The change could not be confirmed. Reload and retry.")
      else {
        setNotice("Change confirmed by the server.")
        setRefresh(value => value + 1)
      }
    } catch {
      setError("The change could not be confirmed. Reload and retry.")
    } finally { mutationPending.current = false; setBusy(false) }
  }

  return <section className="space-y-4" aria-label={title}>
    <div><h2 className="text-2xl font-semibold">{title}</h2><p className="text-muted-foreground">{description}</p></div>
    <div className="flex flex-wrap items-end gap-3">
      {searchable && <form className="flex gap-2" onSubmit={event => { event.preventDefault(); setPage(1); setSearch(searchInput.trim()) }}>
        <Input aria-label={`Search ${title.toLowerCase()}`} value={searchInput} disabled={busy} onChange={event => setSearchInput(event.target.value)} maxLength={200} />
        <Button type="submit" variant="outline" disabled={busy}>Search</Button>
      </form>}
      <label className="space-y-1"><span className="block text-sm">Status</span><select className="rounded-md border bg-background p-2" value={status} disabled={busy} onChange={event => { setPage(1); setStatus(event.target.value) }}>
        <option value="">All statuses</option>{statuses.map(value => <option key={value} value={value}>{value.toLowerCase()}</option>)}
      </select></label>
      <Button variant="outline" disabled={loading} onClick={() => setRefresh(value => value + 1)}>Reload</Button>
    </div>
    {error && <p role="alert" className="text-destructive">{error}</p>}
    {notice && <p role="status">{notice}</p>}
    {loading && <p role="status">Loading records…</p>}
    <div className="overflow-x-auto rounded-md border" aria-busy={loading || busy}>
      <table className="w-full text-sm"><caption className="sr-only">{title}</caption><thead><tr>
        {columns.map(column => <th key={column.label} scope="col" className="p-3 text-left">{column.label}</th>)}
      </tr></thead><tbody>{rows.map(row => <tr key={row.id} className="border-t">
        {columns.map(column => <td key={column.label} className="p-3 align-top">{column.render(row, mutate, busy || loading)}</td>)}
      </tr>)}</tbody></table>
    </div>
    {!loading && !error && rows.length === 0 && <p role="status">No matching records.</p>}
    {pagination && <div className="flex flex-wrap items-center gap-3">
      <span>{pagination.total} records · Page {page} of {Math.max(1, pagination.totalPages)}</span>
      <Button variant="outline" disabled={loading || busy || page <= 1} onClick={() => setPage(value => value - 1)}>Previous</Button>
      <Button variant="outline" disabled={loading || busy || page >= pagination.totalPages} onClick={() => setPage(value => value + 1)}>Next</Button>
    </div>}
  </section>
}
