import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Filter, Download, Printer, MoreVertical, CheckSquare, Package, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const mockOrders = [
  { id: '#ORD-001', customer: 'John Doe', total: 299.99, status: 'completed', date: '2024-01-15' },
  { id: '#ORD-002', customer: 'Jane Smith', total: 149.99, status: 'processing', date: '2024-01-15' },
  { id: '#ORD-003', customer: 'Bob Johnson', total: 499.97, status: 'shipped', date: '2024-01-14' },
  { id: '#ORD-004', customer: 'Alice Brown', total: 79.99, status: 'pending', date: '2024-01-14' },
  { id: '#ORD-005', customer: 'Charlie Wilson', total: 229.98, status: 'completed', date: '2024-01-13' },
];

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const filteredOrders = mockOrders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleAll = () => {
    setSelectedOrders(prev =>
      prev.length === filteredOrders.length ? [] : filteredOrders.map(o => o.id)
    );
  };

  const handleBulkAction = (action: string) => {
    toast({ 
      title: `Bulk ${action}`, 
      description: `${selectedOrders.length} order(s) ${action}ed successfully.` 
    });
    setSelectedOrders([]);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Track and manage customer orders</p>
        </div>
        {selectedOrders.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('fulfill')}>
              <Package className="w-4 h-4 mr-2" />
              Fulfill ({selectedOrders.length})
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('print')}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('export')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={selectedOrders.length === filteredOrders.length}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={() => toggleOrder(order.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{order.date}</TableCell>
                  <TableCell className="font-medium">${order.total}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === 'completed'
                          ? 'default'
                          : order.status === 'shipped'
                          ? 'secondary'
                          : order.status === 'processing'
                          ? 'outline'
                          : 'destructive'
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Package className="w-4 h-4 mr-2" />
                          Fulfill Order
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="w-4 h-4 mr-2" />
                          Print Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="w-4 h-4 mr-2" />
                          Print Packing Slip
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Email Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
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
    </div>
  );
}
