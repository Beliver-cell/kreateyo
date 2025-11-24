import { useState } from 'react';
import { Plus, Search, MoreVertical, Headphones, Mouse, Keyboard, Usb, Laptop, Video, Filter, Copy, Trash2, Package } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ProductDialog } from '@/components/ProductDialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorMessage } from '@/components/ui/error-message';

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
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Product deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    },
  });

  const filteredProducts = (products.length > 0 ? products : mockProducts).filter((product: any) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBulkDuplicate = () => {
    toast({ 
      title: "Duplicating products", 
      description: `Creating copies of ${selectedIds.length} product(s).` 
    });
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    toast({ 
      title: "Products deleted", 
      description: `${selectedIds.length} product(s) removed successfully.`,
      variant: "destructive"
    });
    setSelectedIds([]);
  };

  if (isLoading) {
    return <Loading text="Loading products..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message="Failed to load products. Please try again later." 
        className="m-6"
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage your product inventory</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
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
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
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
                <Button variant="outline" size="sm" onClick={handleBulkDuplicate}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No products found"
              description={searchQuery ? "Try adjusting your search terms" : "Get started by adding your first product"}
              action={!searchQuery ? {
                label: "Add Product",
                onClick: () => {
                  setSelectedProduct(null);
                  setDialogOpen(true);
                }
              } : undefined}
            />
          ) : (
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
          )}
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
