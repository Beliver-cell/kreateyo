import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, MessageSquare, Clock, Star, Download, Plus } from "lucide-react";

const SupportAnalytics = () => {
  const topQuestions = [
    { question: "Order tracking", count: 45, trend: "+12%" },
    { question: "Return policy", count: 23, trend: "+5%" },
    { question: "Business hours", count: 18, trend: "-3%" },
    { question: "Product specifications", count: 15, trend: "+8%" },
    { question: "Payment methods", count: 12, trend: "+2%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Analytics</h1>
          <p className="text-muted-foreground">
            Track your customer support performance and insights
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bot Resolutions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">78%</span>
                <span className="text-sm text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5%
                </span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Human Escalations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">22%</span>
                <span className="text-sm text-red-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  -3%
                </span>
              </div>
              <Progress value={22} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">2m</span>
                <span className="text-sm text-green-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  -30s
                </span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">4.5</span>
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Support Overview</CardTitle>
            <CardDescription>Last 30 days performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Bot Resolutions</span>
                <span className="font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Human Escalations</span>
                <span className="font-medium">22%</span>
              </div>
              <Progress value={22} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg Response Time</span>
                <span className="font-medium">2 minutes</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Customer Satisfaction</span>
                <span className="font-medium">4.5/5.0 ⭐</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customer Questions</CardTitle>
            <CardDescription>Most frequently asked questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topQuestions.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.question}</p>
                      <p className="text-sm text-muted-foreground">{item.count} times</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${item.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {item.trend}
                    </span>
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversation Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversation Insights
          </CardTitle>
          <CardDescription>
            Deep dive into your customer interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Conversations</p>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-sm text-green-500 mt-1">+15% from last month</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Resolved Without Escalation</p>
              <p className="text-2xl font-bold">973</p>
              <p className="text-sm text-green-500 mt-1">78% success rate</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Average Messages/Conversation</p>
              <p className="text-2xl font-bold">4.2</p>
              <p className="text-sm text-muted-foreground mt-1">Optimal range: 3-5</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>
            Improve your support based on data insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <p className="font-medium">Add auto-response for "Order tracking"</p>
                <p className="text-sm text-muted-foreground">
                  This is your #1 question (45 times) - create an automatic response to improve resolution time
                </p>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div className="flex-1">
                <p className="font-medium">Optimize "Return policy" response</p>
                <p className="text-sm text-muted-foreground">
                  High escalation rate on this topic - consider adding more detail
                </p>
              </div>
              <Button size="sm" variant="outline">Review</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportAnalytics;
