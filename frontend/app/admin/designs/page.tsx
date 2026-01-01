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
import { Search, MoreHorizontal, Eye, Check, X, Flag, Trash2, Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample design data
const sampleDesigns = [
  {
    id: 1,
    title: "Modern Logo Pack",
    category: "Logos",
    price: "$25",
    designer: "John Smith",
    status: "Approved",
    dateUploaded: "2024-03-15",
    downloads: 45,
    revenue: "$1,125",
    thumbnail: "/modern-logo.png",
  },
  {
    id: 2,
    title: "Vintage Poster Collection",
    category: "Posters",
    price: "$30",
    designer: "Sarah Johnson",
    status: "Pending",
    dateUploaded: "2024-03-20",
    downloads: 0,
    revenue: "$0",
    thumbnail: "/vintage-poster.png",
  },
  {
    id: 3,
    title: "Social Media Templates",
    category: "Social Media",
    price: "$15",
    designer: "Mike Wilson",
    status: "Flagged",
    dateUploaded: "2024-03-18",
    downloads: 12,
    revenue: "$180",
    thumbnail: "/social-media-template-design.png",
  },
  {
    id: 4,
    title: "Business Card Set",
    category: "Business Cards",
    price: "$20",
    designer: "Emma Davis",
    status: "Approved",
    dateUploaded: "2024-03-10",
    downloads: 28,
    revenue: "$560",
    thumbnail: "/modern-business-card.png",
  },
  {
    id: 5,
    title: "T-Shirt Graphics Bundle",
    category: "T-Shirts",
    price: "$35",
    designer: "Alex Chen",
    status: "Rejected",
    dateUploaded: "2024-03-22",
    downloads: 0,
    revenue: "$0",
    thumbnail: "/abstract-geometric-tee.png",
  },
]

export default function DesignsManagementPage() {
  const [designs, setDesigns] = useState(sampleDesigns)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDesign, setSelectedDesign] = useState<any>(null)

  const filteredDesigns = designs.filter((design) => {
    const matchesSearch =
      design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.designer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || design.category.toLowerCase() === categoryFilter
    const matchesStatus = statusFilter === "all" || design.status.toLowerCase() === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDesignAction = (designId: number, action: string) => {
    setDesigns(
      designs.map((design) => {
        if (design.id === designId) {
          switch (action) {
            case "approve":
              return { ...design, status: "Approved" }
            case "reject":
              return { ...design, status: "Rejected" }
            case "flag":
              return { ...design, status: "Flagged" }
            case "remove":
              return { ...design, status: "Removed" }
            default:
              return design
          }
        }
        return design
      }),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "flagged":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Flagged</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      case "removed":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Removed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      Logos: "border-blue-500 text-blue-700",
      Posters: "border-purple-500 text-purple-700",
      "T-Shirts": "border-green-500 text-green-700",
      "Social Media": "border-pink-500 text-pink-700",
      "Business Cards": "border-orange-500 text-orange-700",
    }

    return (
      <Badge variant="outline" className={colors[category as keyof typeof colors] || "border-gray-500 text-gray-700"}>
        {category}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Designs Management</h2>
        <p className="text-muted-foreground">Monitor and moderate uploaded designs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{designs.length}</div>
            <p className="text-sm text-muted-foreground">Total Designs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {designs.filter((d) => d.status === "Approved").length}
            </div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {designs.filter((d) => d.status === "Pending").length}
            </div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {designs.filter((d) => d.status === "Flagged").length}
            </div>
            <p className="text-sm text-muted-foreground">Flagged</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {designs.filter((d) => d.status === "Rejected").length}
            </div>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Design Directory</CardTitle>
          <CardDescription>Search and filter designs by category or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or designer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="logos">Logos</SelectItem>
                <SelectItem value="posters">Posters</SelectItem>
                <SelectItem value="t-shirts">T-Shirts</SelectItem>
                <SelectItem value="social media">Social Media</SelectItem>
                <SelectItem value="business cards">Business Cards</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Designs Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Design</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Designer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Uploaded</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDesigns.map((design) => (
                  <TableRow key={design.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={design.thumbnail || "/placeholder.svg"}
                          alt={design.title}
                          className="w-12 h-12 rounded-lg object-cover border"
                        />
                        <div>
                          <div className="font-medium">{design.title}</div>
                          <div className="text-sm text-muted-foreground">ID: #{design.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(design.category)}</TableCell>
                    <TableCell className="font-medium">{design.price}</TableCell>
                    <TableCell>{design.designer}</TableCell>
                    <TableCell>{getStatusBadge(design.status)}</TableCell>
                    <TableCell>{design.dateUploaded}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{design.downloads} downloads</div>
                        <div className="text-muted-foreground">{design.revenue} revenue</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedDesign(design)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Files
                          </DropdownMenuItem>
                          {design.status === "Pending" && (
                            <>
                              <DropdownMenuItem onClick={() => handleDesignAction(design.id, "approve")}>
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDesignAction(design.id, "reject")}>
                                <X className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => handleDesignAction(design.id, "flag")}>
                            <Flag className="mr-2 h-4 w-4" />
                            Flag Design
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDesignAction(design.id, "remove")}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Design
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

      {/* Design Details Dialog */}
      <Dialog open={!!selectedDesign} onOpenChange={() => setSelectedDesign(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Design Details</DialogTitle>
            <DialogDescription>Detailed information about the design</DialogDescription>
          </DialogHeader>
          {selectedDesign && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <img
                      src={selectedDesign.thumbnail || "/placeholder.svg"}
                      alt={selectedDesign.title}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="font-medium">Downloads</Label>
                      <p className="text-muted-foreground">{selectedDesign.downloads}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Revenue</Label>
                      <p className="text-muted-foreground">{selectedDesign.revenue}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Title</Label>
                      <p className="text-sm text-muted-foreground">{selectedDesign.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Price</Label>
                      <p className="text-sm text-muted-foreground">{selectedDesign.price}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Category</Label>
                      <div className="mt-1">{getCategoryBadge(selectedDesign.category)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedDesign.status)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Designer</Label>
                      <p className="text-sm text-muted-foreground">{selectedDesign.designer}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Upload Date</Label>
                      <p className="text-sm text-muted-foreground">{selectedDesign.dateUploaded}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Admin Notes</Label>
                    <Textarea placeholder="Add moderation notes..." className="min-h-20" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedDesign.status === "Pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => {
                            handleDesignAction(selectedDesign.id, "approve")
                            setSelectedDesign(null)
                          }}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            handleDesignAction(selectedDesign.id, "reject")
                            setSelectedDesign(null)
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        handleDesignAction(selectedDesign.id, "flag")
                        setSelectedDesign(null)
                      }}
                    >
                      <Flag className="mr-2 h-4 w-4" />
                      Flag
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedDesign(null)}>
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
