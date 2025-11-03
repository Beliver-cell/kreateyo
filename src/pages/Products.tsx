import { useState } from 'react';
import { Plus, Search, MoreVertical, Headphones, Mouse, Keyboard, Usb, Laptop, Video, Filter, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ProductDialog } from '@/components/ProductDialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const mockProducts = [
  { id: 1, name: 'Premium Headphones', price: 299.99, stock: 45, status: 'active', icon: Headphones },
  { id: 2, name: 'Wireless Mouse', price: 49.99, stock: 120, status: 'active', icon: Mouse },
  { id: 3, name: 'Mechanical Keyboard', price: 159.99, stock: 8, status: 'low stock', icon: Keyboard },
  { id: 4, name: 'USB-C Hub', price: 79.99, stock: 0, status: 'out of stock', icon: Usb },
  { id: 5, name: 'Laptop Stand', price: 89.99, stock: 65, status: 'active', icon: Laptop },
  { id: 6, name: 'Webcam HD', price: 129.99, stock: 34, status: 'active', icon: Video },
];

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => {
            setSelectedProduct(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedIds.length} product{selectedIds.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedIds.length === filteredProducts.length}
                      onCheckedChange={(checked) => {
                        setSelectedIds(checked ? filteredProducts.map(p => p.id) : []);
                      }}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const ProductIcon = product.icon;
                  return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(product.id)}
                        onCheckedChange={(checked) => {
                          setSelectedIds(prev => 
                            checked 
                              ? [...prev, product.id]
                              : prev.filter(id => id !== product.id)
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <ProductIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${product.price}</TableCell>
                    <TableCell>{product.stock} units</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === 'active'
                            ? 'default'
                            : product.status === 'low stock'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setSelectedProduct(product);
                          setDialogOpen(true);
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ProductDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        product={selectedProduct}
      />
    </div>
  );
}
