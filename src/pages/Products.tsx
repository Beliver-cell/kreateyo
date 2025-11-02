import { useState } from 'react';
import { Plus, Search, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
  { id: 1, name: 'Premium Headphones', price: 299.99, stock: 45, status: 'active', image: '🎧' },
  { id: 2, name: 'Wireless Mouse', price: 49.99, stock: 120, status: 'active', image: '🖱️' },
  { id: 3, name: 'Mechanical Keyboard', price: 159.99, stock: 8, status: 'low stock', image: '⌨️' },
  { id: 4, name: 'USB-C Hub', price: 79.99, stock: 0, status: 'out of stock', image: '🔌' },
  { id: 5, name: 'Laptop Stand', price: 89.99, stock: 65, status: 'active', image: '💻' },
  { id: 6, name: 'Webcam HD', price: 129.99, stock: 34, status: 'active', image: '📷' },
];

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Products</h1>
            <p className="text-muted-foreground text-xs md:text-sm">Manage your product inventory</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto h-9">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Button variant="outline" size="sm" className="h-9">
                Filter
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Product</TableHead>
                    <TableHead className="text-xs">Price</TableHead>
                    <TableHead className="text-xs">Stock</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                            {product.image}
                          </div>
                          <div>
                            <p className="text-xs font-medium">{product.name}</p>
                            <p className="text-[10px] text-muted-foreground">ID: {product.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium">${product.price}</TableCell>
                      <TableCell className="text-xs">{product.stock} units</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === 'active'
                              ? 'default'
                              : product.status === 'low stock'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="text-[10px]"
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
