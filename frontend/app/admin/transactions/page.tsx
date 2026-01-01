"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, MoreHorizontal, Eye, Download, Check, DollarSign } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample transaction data
const sampleTransactions = [
  {
    id: "TXN-001",
    buyer: "Emma Davis",
    designer: "John Smith",
    design: "Modern Logo Pack",
    amount: "$25.00",
    commission: "$2.50",
    designerEarning: "$22.50",
    status: "Completed",
    date: "2024-03-20",
    paymentMethod: "Credit Card",
  },
  {
    id: "TXN-002",
    buyer: "Mike Wilson",
    designer: "Sarah Johnson",
    design: "Vintage Poster Collection",
    amount: "$30.00",
    commission: "$3.00",
    designerEarning: "$27.00",
    status: "Pending",
    date: "2024-03-21",
    paymentMethod: "PayPal",
  },
  {
    id: "TXN-003",
    buyer: "Alex Chen",
    designer: "Emma Davis",
    design: "Business Card Set",
    amount: "$20.00",
    commission: "$2.00",
    designerEarning: "$18.00",
    status: "Failed",
    date: "2024-03-19",
    paymentMethod: "Credit Card",
  },
  {
    id: "TXN-004",
    buyer: "Sarah Johnson",
    designer: "Mike Wilson",
    design: "Social Media Templates",
    amount: "$15.00",
    commission: "$1.50",
    designerEarning: "$13.50",
    status: "Completed",
    date: "2024-03-18",
    paymentMethod: "Stripe",
  },
  {
    id: "TXN-005",
    buyer: "John Smith",
    designer: "Alex Chen",
    design: "T-Shirt Graphics Bundle",
    amount: "$35.00",
    commission: "$3.50",
    designerEarning: "$31.50",
    status: "Withdrawal Pending",
    date: "2024-03-17",
    paymentMethod: "Credit Card",
  },
]

// Sample withdrawal requests
const sampleWithdrawals = [
  {
    id: "WD-001",
    designer: "John Smith",
    amount: "$450.00",
    method: "Bank Transfer",
    status: "Pending",
    requestDate: "2024-03-20",
    transactions: 18,
  },
  {
    id: "WD-002",
    designer: "Sarah Johnson",
    amount: "$320.00",
    method: "PayPal",
    status: "Approved",
    requestDate: "2024-03-19",
    transactions: 12,
  },
  {
    id: "WD-003",
    designer: "Emma Davis",
    amount: "$180.00",
    method: "Bank Transfer",
    status: "Completed",
    requestDate: "2024-03-15",
    transactions: 9,
  },
]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(sampleTransactions)
  const [withdrawals, setWithdrawals] = useState(sampleWithdrawals)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("transactions")

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.designer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.design.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || transaction.status.toLowerCase().includes(statusFilter.toLowerCase())

    return matchesSearch && matchesStatus
  })

  const handleWithdrawalAction = (withdrawalId: string, action: string) => {
    setWithdrawals(
      withdrawals.map((withdrawal) => {
        if (withdrawal.id === withdrawalId) {
          switch (action) {
            case "approve":
              return { ...withdrawal, status: "Approved" }
            case "complete":
              return { ...withdrawal, status: "Completed" }
            case "reject":
              return { ...withdrawal, status: "Rejected" }
            default:
              return withdrawal
          }
        }
        return withdrawal
      }),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
      case "withdrawal pending":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Withdrawal Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const totalRevenue = transactions
    .filter((t) => t.status === "Completed")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount.replace("$", "")), 0)

  const totalCommission = transactions
    .filter((t) => t.status === "Completed")
    .reduce((sum, t) => sum + Number.parseFloat(t.commission.replace("$", "")), 0)

  const pendingWithdrawals = withdrawals
    .filter((w) => w.status === "Pending")
    .reduce((sum, w) => sum + Number.parseFloat(w.amount.replace("$", "")), 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Transactions & Payments</h2>
        <p className="text-muted-foreground">Monitor financial activity and manage withdrawals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">${totalCommission.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Platform Commission</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary">${pendingWithdrawals.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Pending Withdrawals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">
              {transactions.filter((t) => t.status === "Failed").length}
            </div>
            <p className="text-sm text-muted-foreground">Failed Transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "transactions" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("transactions")}
        >
          Transactions
        </Button>
        <Button
          variant={activeTab === "withdrawals" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("withdrawals")}
        >
          Withdrawals
        </Button>
      </div>

      {activeTab === "transactions" && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>All platform transactions and payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Designer</TableHead>
                    <TableHead>Design</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                      <TableCell>{transaction.buyer}</TableCell>
                      <TableCell>{transaction.designer}</TableCell>
                      <TableCell>{transaction.design}</TableCell>
                      <TableCell className="font-medium">{transaction.amount}</TableCell>
                      <TableCell className="text-primary">{transaction.commission}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedTransaction(transaction)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download Receipt
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "withdrawals" && (
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Requests</CardTitle>
            <CardDescription>Manage designer payout requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Designer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="font-mono text-sm">{withdrawal.id}</TableCell>
                      <TableCell>{withdrawal.designer}</TableCell>
                      <TableCell className="font-medium">{withdrawal.amount}</TableCell>
                      <TableCell>{withdrawal.method}</TableCell>
                      <TableCell>{withdrawal.transactions} transactions</TableCell>
                      <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                      <TableCell>{withdrawal.requestDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {withdrawal.status === "Pending" && (
                            <>
                              <Button size="sm" onClick={() => handleWithdrawalAction(withdrawal.id, "approve")}>
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleWithdrawalAction(withdrawal.id, "reject")}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {withdrawal.status === "Approved" && (
                            <Button size="sm" onClick={() => handleWithdrawalAction(withdrawal.id, "complete")}>
                              Mark Completed
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction Details Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Complete information about the transaction</DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Transaction ID</Label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedTransaction.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Buyer</Label>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.buyer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Designer</Label>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.designer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Design</Label>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.design}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.paymentMethod}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Amount</Label>
                  <p className="text-sm text-muted-foreground font-medium">{selectedTransaction.amount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Platform Commission</Label>
                  <p className="text-sm text-primary font-medium">{selectedTransaction.commission}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Designer Earning</Label>
                  <p className="text-sm text-secondary font-medium">{selectedTransaction.designerEarning}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Transaction Date</Label>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.date}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                  Close
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
