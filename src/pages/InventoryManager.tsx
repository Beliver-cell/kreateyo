import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, TrendingUp, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InventoryManager = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const inventoryItems = [
    { id: 1, name: "Product A", sku: "PRD-001", stock: 45, lowStock: 10, status: "in-stock" },
    { id: 2, name: "Product B", sku: "PRD-002", stock: 8, lowStock: 10, status: "low-stock" },
    { id: 3, name: "Product C", sku: "PRD-003", stock: 0, lowStock: 10, status: "out-of-stock" },
    { id: 4, name: "Product D", sku: "PRD-004", stock: 123, lowStock: 20, status: "in-stock" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventory Manager</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Track and manage your product inventory
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Purchase Order
        </Button>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">847</p>
            <p className="text-xs text-muted-foreground mt-1">Across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">23</p>
            <p className="text-xs text-muted-foreground mt-1">Need reordering</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">5</p>
            <p className="text-xs text-muted-foreground mt-1">Immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Inventory Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$127,420</p>
            <p className="text-xs text-muted-foreground mt-1">Total stock value</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Manage your product stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline">Filter</Button>
            </div>

            <div className="space-y-2">
              {inventoryItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      </div>
                      {item.status === "low-stock" && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Low Stock
                        </Badge>
                      )}
                      {item.status === "out-of-stock" && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Stock</p>
                      <p className="text-lg font-bold">{item.stock}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Adjust</Button>
                      <Button size="sm">Reorder</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Low Stock Alerts
          </CardTitle>
          <CardDescription>
            Products that need reordering soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {inventoryItems.filter(i => i.status === "low-stock").map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50/50">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Only {item.stock} units left (threshold: {item.lowStock})
                  </p>
                </div>
                <Button size="sm">Create Purchase Order</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supplier Management */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Management</CardTitle>
          <CardDescription>Manage your suppliers and orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Active Suppliers</p>
              <p className="text-3xl font-bold">12</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-2">Pending Orders</p>
              <p className="text-3xl font-bold">7</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;
