"use client"

import { AdminCollection, type CollectionQuery } from "@/components/admin-collection"
import { apiClient } from "@/lib/api-client"
import type { AdminTransaction, AdminWithdrawal } from "@/lib/admin-types"
import { Button } from "@/components/ui/button"

async function loadTransactions(query: CollectionQuery, signal: AbortSignal) {
  const response = await apiClient.getAllTransactions(query, signal)
  return { ...response, data: response.data ? { rows: response.data.data.transactions, pagination: response.data.data.pagination } : undefined }
}
async function loadWithdrawals(query: CollectionQuery, signal: AbortSignal) {
  const response = await apiClient.getAllWithdrawals(query, signal)
  return { ...response, data: response.data ? { rows: response.data.data.withdrawals, pagination: response.data.data.pagination } : undefined }
}
export default function TransactionsPage() {
  return <div className="space-y-10">
    <AdminCollection<AdminTransaction> title="Transactions" description="Recorded purchases. Refunds require confirmation from the payment provider." load={loadTransactions} statuses={["PENDING", "COMPLETED", "FAILED"]} columns={[
      { label: "Purchase", render: transaction => <div><p>#{transaction.id} · {transaction.designTitle}</p><p>{transaction.buyer.user.name}</p><p className="text-muted-foreground">{new Date(transaction.createdAt).toLocaleString()}</p></div> },
      { label: "Amount", render: transaction => transaction.amount.toFixed(2) },
      { label: "Payment", render: transaction => <p>{transaction.paymentStatus.toLowerCase()} · {transaction.paymentMethod.toLowerCase()}</p> },
      { label: "Actions", render: (transaction, mutate, busy) => <Button variant="outline" disabled={busy || transaction.paymentStatus !== "COMPLETED"} onClick={() => void mutate(() => apiClient.processRefund(transaction.id))}>Request refund</Button> },
    ]} />
    <AdminCollection<AdminWithdrawal> title="Withdrawals" description="Approval requires a real provider transfer. Rejections are saved immediately; completed payouts cannot be marked manually." load={loadWithdrawals} statuses={["PENDING", "APPROVED", "REJECTED", "COMPLETED"]} columns={[
      { label: "Request", render: withdrawal => <div><p>#{withdrawal.id} · {withdrawal.designer.user.name}</p><p className="text-muted-foreground">{new Date(withdrawal.createdAt).toLocaleString()}</p></div> },
      { label: "Amount", render: withdrawal => withdrawal.amount.toFixed(2) },
      { label: "Status", render: withdrawal => <div><p>{withdrawal.status.toLowerCase()}</p>{withdrawal.processedAt && <p>{new Date(withdrawal.processedAt).toLocaleString()}</p>}</div> },
      { label: "Actions", render: (withdrawal, mutate, busy) => <div className="flex gap-2"><Button variant="outline" disabled={busy || withdrawal.status !== "PENDING"} onClick={() => void mutate(() => apiClient.processWithdrawal(withdrawal.id, "APPROVED"))}>Approve payout</Button><Button variant="outline" disabled={busy || withdrawal.status !== "PENDING"} onClick={() => void mutate(() => apiClient.processWithdrawal(withdrawal.id, "REJECTED"))}>Reject</Button></div> },
    ]} />
  </div>
}
