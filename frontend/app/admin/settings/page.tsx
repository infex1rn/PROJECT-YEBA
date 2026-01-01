"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, CreditCard, Palette, Bell, Shield, Plus, X, Upload, Save } from "lucide-react"

export default function SettingsPage() {
  const [categories, setCategories] = useState(["Logos", "Posters", "T-Shirts", "Social Media", "Business Cards"])
  const [newCategory, setNewCategory] = useState("")
  const [commissionRate, setCommissionRate] = useState("10")
  const [settings, setSettings] = useState({
    siteName: "DeepFold",
    siteDescription: "A marketplace where graphic designers can upload and sell designs",
    maintenanceMode: false,
    userRegistration: true,
    designApproval: true,
    emailNotifications: true,
    stripeKey: "",
    paystackKey: "",
    paypalKey: "",
  })
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setNewCategory("")
    }
  }

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter((cat) => cat !== categoryToRemove))
  }

  const handleSaveSettings = () => {
    setSaveStatus("saving")
    // Simulate API call
    setTimeout(() => {
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }, 1000)
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Site Settings</h2>
        <p className="text-muted-foreground">Configure platform-wide settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    min="0"
                    max="50"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Platform commission on each sale</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                  className="min-h-20"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Platform Controls</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-xs text-muted-foreground">Temporarily disable public access to the site</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>User Registration</Label>
                    <p className="text-xs text-muted-foreground">Allow new users to register accounts</p>
                  </div>
                  <Switch
                    checked={settings.userRegistration}
                    onCheckedChange={(checked) => handleSettingChange("userRegistration", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Design Approval Required</Label>
                    <p className="text-xs text-muted-foreground">Require admin approval before designs go live</p>
                  </div>
                  <Switch
                    checked={settings.designApproval}
                    onCheckedChange={(checked) => handleSettingChange("designApproval", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Categories</CardTitle>
              <CardDescription>Manage available design categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                />
                <Button onClick={handleAddCategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Current Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge key={category} variant="secondary" className="flex items-center gap-2">
                      {category}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveCategory(category)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                {categories.length === 0 && <p className="text-sm text-muted-foreground">No categories available</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Gateway Settings
              </CardTitle>
              <CardDescription>Configure payment processing services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  API keys are encrypted and stored securely. Never share your secret keys.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stripeKey">Stripe Secret Key</Label>
                  <Input
                    id="stripeKey"
                    type="password"
                    placeholder="sk_live_..."
                    value={settings.stripeKey}
                    onChange={(e) => handleSettingChange("stripeKey", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paystackKey">Paystack Secret Key</Label>
                  <Input
                    id="paystackKey"
                    type="password"
                    placeholder="sk_live_..."
                    value={settings.paystackKey}
                    onChange={(e) => handleSettingChange("paystackKey", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paypalKey">PayPal Client Secret</Label>
                  <Input
                    id="paypalKey"
                    type="password"
                    placeholder="Client Secret..."
                    value={settings.paypalKey}
                    onChange={(e) => handleSettingChange("paypalKey", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Payment Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Stripe</span>
                      <Badge variant={settings.stripeKey ? "default" : "secondary"}>
                        {settings.stripeKey ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Credit card processing</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Paystack</span>
                      <Badge variant={settings.paystackKey ? "default" : "secondary"}>
                        {settings.paystackKey ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">African payment processing</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">PayPal</span>
                      <Badge variant={settings.paypalKey ? "default" : "secondary"}>
                        {settings.paypalKey ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Digital wallet payments</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Platform Branding
              </CardTitle>
              <CardDescription>Customize your platform's visual identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Platform Logo</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">Upload your platform logo</p>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended: PNG or SVG, max 2MB</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Favicon</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">Upload favicon (32x32)</p>
                      <Button variant="outline" size="sm">
                        Choose File
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended: ICO or PNG, 32x32px</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Current Branding</h4>
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">D</span>
                  </div>
                  <div>
                    <p className="font-medium">{settings.siteName}</p>
                    <p className="text-sm text-muted-foreground">Current logo placeholder</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure email and in-app notification templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Send email notifications to users</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Email Templates</h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Welcome Email Template</Label>
                    <Textarea
                      placeholder="Welcome to DeepFold! Thank you for joining our community..."
                      className="min-h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Design Approval Email Template</Label>
                    <Textarea placeholder="Congratulations! Your design has been approved..." className="min-h-20" />
                  </div>

                  <div className="space-y-2">
                    <Label>Purchase Confirmation Email Template</Label>
                    <Textarea
                      placeholder="Thank you for your purchase! Your design is ready for download..."
                      className="min-h-20"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">In-App Notification Templates</h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>New Sale Notification</Label>
                    <Input placeholder="You have a new sale! 🎉" />
                  </div>

                  <div className="space-y-2">
                    <Label>Design Upload Notification</Label>
                    <Input placeholder="Your design has been uploaded successfully" />
                  </div>

                  <div className="space-y-2">
                    <Label>Withdrawal Approved Notification</Label>
                    <Input placeholder="Your withdrawal request has been approved" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={saveStatus === "saving"}>
          <Save className="h-4 w-4 mr-2" />
          {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
