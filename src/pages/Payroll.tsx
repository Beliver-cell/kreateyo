import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Users, TrendingUp, Download, CheckCircle, Clock } from "lucide-react";

export default function Payroll() {
  const employees = [
    { id: 1, name: "John Doe", role: "Sales Manager", salary: 150000, status: "paid" },
    { id: 2, name: "Jane Smith", role: "Cashier", salary: 80000, status: "pending" },
    { id: 3, name: "Mike Johnson", role: "Stock Manager", salary: 120000, status: "paid" },
  ];

  const stats = [
    { title: "Total Payroll", value: "₦350,000", icon: DollarSign, trend: "+12%" },
    { title: "Employees", value: "12", icon: Users, trend: "+2" },
    { title: "Avg Salary", value: "₦116,667", icon: TrendingUp, trend: "+5%" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Staff Payroll</h1>
            <p className="text-muted-foreground mt-1">
              Manage employee salaries and payouts via YoPay
            </p>
          </div>
          <Button className="bg-gradient-primary">
            <DollarSign className="h-4 w-4 mr-2" />
            Process Payroll
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">{stat.trend}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Employees</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="space-y-3">
                  {employees.map(employee => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">₦{employee.salary.toLocaleString()}</p>
                          <Badge
                            variant={employee.status === 'paid' ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {employee.status === 'paid' ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> Paid</>
                            ) : (
                              <><Clock className="h-3 w-3 mr-1" /> Pending</>
                            )}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Payslip
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
