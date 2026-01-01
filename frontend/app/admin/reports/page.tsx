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
import { Textarea } from "@/components/ui/textarea"
import { Search, MoreHorizontal, Eye, AlertTriangle, Ban, MessageSquare, Flag } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample reports data
const sampleReports = [
  {
    id: "RPT-001",
    reporter: "Emma Davis",
    reportedUser: "Mike Wilson",
    reason: "Copyright Violation",
    type: "Design",
    description: "This design appears to be copied from another artist's work",
    date: "2024-03-20",
    status: "Open",
    priority: "High",
    designId: "DSN-123",
  },
  {
    id: "RPT-002",
    reporter: "John Smith",
    reportedUser: "Alex Chen",
    reason: "Inappropriate Content",
    type: "Message",
    description: "User sent inappropriate messages in chat",
    date: "2024-03-19",
    status: "Under Review",
    priority: "Medium",
    messageId: "MSG-456",
  },
  {
    id: "RPT-003",
    reporter: "Sarah Johnson",
    reportedUser: "Emma Davis",
    reason: "Spam",
    type: "Design",
    description: "User is uploading multiple low-quality designs",
    date: "2024-03-18",
    status: "Resolved",
    priority: "Low",
    designId: "DSN-789",
  },
  {
    id: "RPT-004",
    reporter: "Alex Chen",
    reportedUser: "John Smith",
    reason: "Harassment",
    type: "User Behavior",
    description: "User is harassing other designers in comments",
    date: "2024-03-17",
    status: "Open",
    priority: "High",
    userId: "USR-101",
  },
  {
    id: "RPT-005",
    reporter: "Mike Wilson",
    reportedUser: "Sarah Johnson",
    reason: "False Claims",
    type: "Design",
    description: "User claiming ownership of designs they didn't create",
    date: "2024-03-16",
    status: "Escalated",
    priority: "High",
    designId: "DSN-321",
  },
]

export default function ReportsPage() {
  const [reports, setReports] = useState(sampleReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<any>(null)

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status.toLowerCase().includes(statusFilter.toLowerCase())
    const matchesPriority = priorityFilter === "all" || report.priority.toLowerCase() === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleReportAction = (reportId: string, action: string) => {
    setReports(
      reports.map((report) => {
        if (report.id === reportId) {
          switch (action) {
            case "resolve":
              return { ...report, status: "Resolved" }
            case "escalate":
              return { ...report, status: "Escalated", priority: "High" }
            case "dismiss":
              return { ...report, status: "Dismissed" }
            case "review":
              return { ...report, status: "Under Review" }
            default:
              return report
          }
        }
        return report
      }),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Open</Badge>
      case "under review":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Under Review</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>
      case "escalated":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Escalated</Badge>
      case "dismissed":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Dismissed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "design":
        return <Flag className="h-4 w-4" />
      case "message":
        return <MessageSquare className="h-4 w-4" />
      case "user behavior":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Reports & Moderation</h2>
        <p className="text-muted-foreground">Handle user reports and moderate platform content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{reports.length}</div>
            <p className="text-sm text-muted-foreground">Total Reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{reports.filter((r) => r.status === "Open").length}</div>
            <p className="text-sm text-muted-foreground">Open Reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{reports.filter((r) => r.priority === "High").length}</div>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {reports.filter((r) => r.status === "Resolved").length}
            </div>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Reports</CardTitle>
          <CardDescription>Manage user reports and take moderation actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Reported User</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-mono text-sm">{report.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(report.type)}
                        <span className="text-sm">{report.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>{report.reporter}</TableCell>
                    <TableCell>{report.reportedUser}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedReport(report)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {report.status === "Open" && (
                            <DropdownMenuItem onClick={() => handleReportAction(report.id, "review")}>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Start Review
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleReportAction(report.id, "escalate")}>
                            <Flag className="mr-2 h-4 w-4" />
                            Escalate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReportAction(report.id, "resolve")}>
                            <Ban className="mr-2 h-4 w-4" />
                            Resolve
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

      {/* Report Details Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>Complete information about the report</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Report ID</Label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedReport.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getTypeIcon(selectedReport.type)}
                    <span className="text-sm">{selectedReport.type}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Reporter</Label>
                  <p className="text-sm text-muted-foreground">{selectedReport.reporter}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Reported User</Label>
                  <p className="text-sm text-muted-foreground">{selectedReport.reportedUser}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Reason</Label>
                  <p className="text-sm text-muted-foreground">{selectedReport.reason}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="mt-1">{getPriorityBadge(selectedReport.priority)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Report Date</Label>
                  <p className="text-sm text-muted-foreground">{selectedReport.date}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">{selectedReport.description}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Admin Notes</Label>
                <Textarea placeholder="Add moderation notes..." className="min-h-20" />
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedReport.status === "Open" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      handleReportAction(selectedReport.id, "review")
                      setSelectedReport(null)
                    }}
                  >
                    Start Review
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleReportAction(selectedReport.id, "escalate")
                    setSelectedReport(null)
                  }}
                >
                  Escalate
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    handleReportAction(selectedReport.id, "resolve")
                    setSelectedReport(null)
                  }}
                >
                  Resolve
                </Button>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedReport(null)}>
                  Close
                </Button>
                <Button>Save Notes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
