import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Sparkles, Users } from "lucide-react";
import { useState } from "react";

export default function Messaging() {
  const [message, setMessage] = useState("");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">WhatsApp & SMS</h1>
            <p className="text-muted-foreground mt-1">
              Send automated messages to your customers
            </p>
          </div>
        </div>

        <Tabs defaultValue="whatsapp">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Compose Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recipients</label>
                    <Input placeholder="Enter phone numbers or select from contacts" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      {message.length} characters
                    </p>
                  </div>

                  <Button className="w-full bg-gradient-primary">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate with AI
                  </Button>

                  <Button className="w-full" variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Message Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        title: "Order Confirmation",
                        message: "Hi {name}! Your order #{order_id} has been confirmed...",
                      },
                      {
                        title: "Delivery Update",
                        message: "Your order is out for delivery and will arrive soon!",
                      },
                      {
                        title: "Payment Reminder",
                        message: "Hi {name}, your payment of {amount} is due on {date}.",
                      },
                    ].map((template, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => setMessage(template.message)}
                      >
                        <p className="font-semibold text-sm">{template.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {template.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { recipient: "+234 801 234 5678", message: "Order confirmed", time: "2 hours ago" },
                    { recipient: "+234 802 345 6789", message: "Payment reminder sent", time: "5 hours ago" },
                  ].map((msg, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{msg.recipient}</p>
                        <p className="text-sm text-muted-foreground">{msg.message}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{msg.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="mt-6">
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  SMS messaging coming soon. Use WhatsApp for now.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
