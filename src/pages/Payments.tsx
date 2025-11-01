import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, TrendingUp, Download } from 'lucide-react';

const paymentMethods = [
  { name: 'Stripe', status: 'connected', icon: '💳', color: 'bg-blue-500' },
  { name: 'PayPal', status: 'not connected', icon: '🅿️', color: 'bg-blue-600' },
  { name: 'Apple Pay', status: 'connected', icon: '🍎', color: 'bg-gray-900' },
  { name: 'Google Pay', status: 'not connected', icon: '🔵', color: 'bg-green-600' },
];

const recentTransactions = [
  { id: '#TRX-001', amount: '$299.99', customer: 'John Doe', date: 'Jan 15, 2024', status: 'completed' },
  { id: '#TRX-002', amount: '$149.99', customer: 'Jane Smith', date: 'Jan 15, 2024', status: 'completed' },
  { id: '#TRX-003', amount: '$499.97', customer: 'Bob Johnson', date: 'Jan 14, 2024', status: 'completed' },
  { id: '#TRX-004', amount: '$79.99', customer: 'Alice Brown', date: 'Jan 14, 2024', status: 'pending' },
  { id: '#TRX-005', amount: '$229.98', customer: 'Charlie Wilson', date: 'Jan 13, 2024', status: 'completed' },
];

export default function Payments() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Payment Gateway</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Manage payment methods and transactions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345.67</div>
            <p className="text-xs text-success mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transactions
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-success mt-1">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Transaction
            </CardTitle>
            <CreditCard className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$79.13</div>
            <p className="text-xs text-success mt-1">+5.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Connect and manage your payment providers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentMethods.map((method) => (
              <Card key={method.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-3xl">{method.icon}</div>
                    <Badge variant={method.status === 'connected' ? 'default' : 'secondary'}>
                      {method.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{method.name}</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    {method.status === 'connected' ? 'Configure' : 'Connect'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest payment activity</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-sm font-semibold">{transaction.id}</span>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{transaction.customer}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="text-sm text-muted-foreground">{transaction.date}</span>
                      <span className="font-bold text-success">{transaction.amount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
