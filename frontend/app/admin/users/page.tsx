"use client"

import { AdminCollection, type CollectionQuery } from "@/components/admin-collection"
import { apiClient } from "@/lib/api-client"
import type { AdminUser } from "@/lib/admin-types"
import { Button } from "@/components/ui/button"

async function load(query: CollectionQuery, signal: AbortSignal) {
  const response = await apiClient.getAllUsers(query, signal)
  return { ...response, data: response.data ? { rows: response.data.data.users, pagination: response.data.data.pagination } : undefined }
}

export default function UsersPage() {
  return <AdminCollection<AdminUser> title="User management" description="Manage real accounts and their current access." searchable load={load} statuses={["ACTIVE", "SUSPENDED", "BANNED"]} columns={[
    { label: "Account", render: user => <div><p className="font-medium">{user.name}</p><p>{user.email}</p><p className="text-muted-foreground">#{user.id} · {user.role.toLowerCase()}</p></div> },
    { label: "Activity", render: user => <details><summary className="cursor-pointer">Account details</summary><dl className="space-y-1 pt-2"><dt>Joined</dt><dd>{new Date(user.createdAt).toLocaleDateString()}</dd>{user.designer && <><dt>Earnings</dt><dd>{user.designer.totalEarnings.toFixed(2)}</dd><dt>Rating</dt><dd>{user.designer.rating}</dd></>}{user.buyer && <><dt>Completed purchases</dt><dd>{user.buyer.totalSpent.toFixed(2)}</dd></>}</dl></details> },
    { label: "Access", render: (user, mutate, busy) => <select className="rounded border bg-background p-2" aria-label={`Access for ${user.name}`} value={user.status} disabled={busy} onChange={event => void mutate(() => apiClient.updateUserStatus(user.id, event.target.value))}>{["ACTIVE", "SUSPENDED", "BANNED"].map(status => <option key={status} value={status}>{status.toLowerCase()}</option>)}</select> },
    { label: "Verification", render: (user, mutate, busy) => <label className="flex gap-2"><input type="checkbox" checked={user.verified} disabled={busy} onChange={event => void mutate(() => apiClient.verifyUser(user.id, event.target.checked))} />Operator verified</label> },
    { label: "Actions", render: (user, mutate, busy) => <Button variant="outline" disabled={busy || user.status === "BANNED"} onClick={() => void mutate(() => apiClient.deleteUser(user.id))}>Deactivate</Button> },
  ]} />
}
