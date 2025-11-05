import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { Bot, MessageSquare, TrendingUp, Settings, Plus, Trash2, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ChatbotManager = () => {
  const { businessProfile } = useBusinessContext();
  const { toast } = useToast();
  const [chatbotEnabled, setChatbotEnabled] = useState(false);
  const [customResponses, setCustomResponses] = useState([
    { id: 1, question: "Where is my order?", answer: "Hi! Check your order status here: [tracking-link] 😊" },
    { id: 2, question: "What are your business hours?", answer: "We're available Monday-Friday 9AM-6PM, Weekends 10AM-4PM" },
  ]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const isTeamAccount = businessProfile.accountType === 'team';

  const handleActivateChatbot = () => {
    setChatbotEnabled(!chatbotEnabled);
    toast({
      title: chatbotEnabled ? "Chatbot Deactivated" : "Chatbot Activated",
      description: chatbotEnabled ? "Your chatbot is now offline" : "Your chatbot is now live on your website!",
    });
  };

  const handleAddResponse = () => {
    if (!newQuestion || !newAnswer) {
      toast({
        title: "Missing Information",
        description: "Please fill in both question and answer",
        variant: "destructive",
      });
      return;
    }

    const newResponse = {
      id: customResponses.length + 1,
      question: newQuestion,
      answer: newAnswer,
    };
    setCustomResponses([...customResponses, newResponse]);
    setNewQuestion("");
    setNewAnswer("");
    toast({
      title: "Response Added",
      description: "Custom response has been saved successfully",
    });
  };

  const handleDeleteResponse = (id: number) => {
    setCustomResponses(customResponses.filter(r => r.id !== id));
    toast({
      title: "Response Deleted",
      description: "Custom response has been removed",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Chatbot Manager</h1>
        <p className="text-muted-foreground">
          {isTeamAccount 
            ? "Manage your AI-powered customer support chatbot"
            : "Create custom responses for your customer support chatbot"}
        </p>
      </div>

      {/* Chatbot Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Chatbot Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Active Conversations</span>
              </div>
              <p className="text-2xl font-bold">{chatbotEnabled ? "23" : "0"}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Resolution Rate</span>
              </div>
              <p className="text-2xl font-bold">{chatbotEnabled ? "89%" : "0%"}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Customer Satisfaction</span>
              </div>
              <p className="text-2xl font-bold">{chatbotEnabled ? "4.5/5" : "0/5"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
            <div>
              <p className="font-medium">Chatbot Status</p>
              <p className="text-sm text-muted-foreground">
                {chatbotEnabled ? "Your chatbot is active and responding to customers" : "Activate your chatbot to start helping customers"}
              </p>
            </div>
            <Button 
              onClick={handleActivateChatbot}
              className={chatbotEnabled ? "" : "bg-gradient-to-r from-primary to-primary/80 shadow-lg"}
            >
              {chatbotEnabled ? "Deactivate Chatbot" : "Activate Chatbot"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Users - AI Powered System */}
      {isTeamAccount && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🤖 OpenAI Powered Assistant
            </CardTitle>
            <CardDescription>
              Your AI automatically learns from your business data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Product knowledge loaded</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>FAQ training complete</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                <span>Learning from conversations</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Policy understanding active</span>
              </div>
            </div>

            <div className="mt-6 p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">AI Capabilities</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Natural conversation flow</li>
                <li>• Context understanding</li>
                <li>• Multi-language support</li>
                <li>• Sentiment analysis</li>
                <li>• Automatic escalation to human support</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">Advanced Settings</Button>
              <Button>Train AI</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solo Users - Custom Response Builder */}
      {!isTeamAccount && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Custom Response Library</CardTitle>
              <CardDescription>
                Add automatic responses for common customer questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {customResponses.map((response) => (
                <div key={response.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">When customers ask: {response.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">Response: {response.answer}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteResponse(response.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Custom Response</CardTitle>
              <CardDescription>
                Create a new automatic response for your chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">When Customers Ask:</Label>
                <Input
                  id="question"
                  placeholder="e.g., Where is my order?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Your Response:</Label>
                <Textarea
                  id="answer"
                  placeholder="e.g., Hi! Check your order status here: [tracking-link] 😊"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddResponse}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Response
                </Button>
                <Button variant="outline">
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Reply
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common Questions Templates</CardTitle>
              <CardDescription>
                Quick start with these popular templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  "Shipping times and costs",
                  "Return policy",
                  "Product availability",
                  "Business hours",
                  "Contact information"
                ].map((template) => (
                  <Button key={template} variant="outline" className="justify-start">
                    {template}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ChatbotManager;
