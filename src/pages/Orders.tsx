import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">Track and manage customer orders</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
