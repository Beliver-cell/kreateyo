import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, Mail, Send, Search, Bot, User,
  Archive, Star, MoreHorizontal, Clock, CheckCheck
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const channelIcons = {
  email: Mail,
  whatsapp: MessageSquare,
};

export default function ConversationsInbox() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "ai">("all");

  const { data: threads, isLoading: threadsLoading } = useQuery({
    queryKey: ["message_threads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("message_threads")
        .select("*")
        .order("last_message_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["thread_messages", selectedThread?.id],
    queryFn: async () => {
      if (!selectedThread) return [];
      const { data, error } = await supabase
        .from("thread_messages")
        .select("*")
        .eq("thread_id", selectedThread.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!selectedThread,
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from("thread_messages")
        .insert({
          thread_id: selectedThread.id,
          sender_type: "business",
          content,
        });
      if (error) throw error;

      // Update thread last_message_at
      await supabase
        .from("message_threads")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", selectedThread.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thread_messages", selectedThread?.id] });
      queryClient.invalidateQueries({ queryKey: ["message_threads"] });
      setNewMessage("");
      toast.success("Message sent");
    },
    onError: (error) => {
      toast.error("Failed to send message: " + error.message);
    },
  });

  const filteredThreads = threads?.filter((t) => {
    if (filter === "open" && t.status !== "open") return false;
    if (filter === "ai" && !t.is_ai_handled) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        t.customer_name?.toLowerCase().includes(query) ||
        t.customer_email?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const stats = {
    total: threads?.length || 0,
    open: threads?.filter(t => t.status === "open").length || 0,
    aiHandled: threads?.filter(t => t.is_ai_handled).length || 0,
    unread: threads?.reduce((acc, t) => acc + (t.unread_count || 0), 0) || 0,
  };

  return (
    <DashboardLayout>
      <div className="w-full h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-4 p-4">
        {/* Sidebar - Thread List */}
        <Card className="w-full lg:w-96 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Conversations</span>
              <Badge variant="secondary">{stats.unread} unread</Badge>
            </CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-1 mt-2">
              <Button
                size="sm"
                variant={filter === "all" ? "default" : "ghost"}
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filter === "open" ? "default" : "ghost"}
                onClick={() => setFilter("open")}
              >
                Open
              </Button>
              <Button
                size="sm"
                variant={filter === "ai" ? "default" : "ghost"}
                onClick={() => setFilter("ai")}
              >
                <Bot className="h-4 w-4 mr-1" />
                AI
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {threadsLoading ? (
                <div className="p-4 text-center text-muted-foreground">Loading...</div>
              ) : filteredThreads?.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No conversations</div>
              ) : (
                filteredThreads?.map((thread) => {
                  const ChannelIcon = channelIcons[thread.channel as keyof typeof channelIcons] || MessageSquare;
                  return (
                    <div
                      key={thread.id}
                      className={cn(
                        "p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                        selectedThread?.id === thread.id && "bg-muted"
                      )}
                      onClick={() => setSelectedThread(thread)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {thread.customer_name?.charAt(0) || "C"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm truncate">
                              {thread.customer_name || thread.customer_email}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {thread.last_message_at && new Date(thread.last_message_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <ChannelIcon className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground truncate">
                              {thread.subject || "No subject"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {thread.is_ai_handled && (
                              <Badge variant="outline" className="text-xs">
                                <Bot className="h-3 w-3 mr-1" />
                                AI
                              </Badge>
                            )}
                            {thread.unread_count > 0 && (
                              <Badge className="bg-primary text-xs">
                                {thread.unread_count}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main - Messages */}
        <Card className="flex-1 flex flex-col min-h-0">
          {selectedThread ? (
            <>
              <CardHeader className="pb-2 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {selectedThread.customer_name?.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {selectedThread.customer_name || selectedThread.customer_email}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedThread.customer_email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-4">
                  {messagesLoading ? (
                    <div className="text-center text-muted-foreground">Loading messages...</div>
                  ) : messages?.length === 0 ? (
                    <div className="text-center text-muted-foreground">No messages yet</div>
                  ) : (
                    <div className="space-y-4">
                      {messages?.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-3",
                            message.sender_type === "business" && "justify-end"
                          )}
                        >
                          {message.sender_type !== "business" && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {message.sender_type === "ai" ? (
                                  <Bot className="h-4 w-4" />
                                ) : (
                                  "C"
                                )}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={cn(
                              "max-w-[70%] rounded-lg p-3",
                              message.sender_type === "business"
                                ? "bg-primary text-primary-foreground"
                                : message.sender_type === "ai"
                                ? "bg-blue-500/10 border border-blue-500/20"
                                : "bg-muted"
                            )}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className="text-xs opacity-70">
                                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {message.sender_type === "business" && (
                                <CheckCheck className="h-3 w-3 opacity-70" />
                              )}
                            </div>
                          </div>
                          {message.sender_type === "business" && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[44px] max-h-32"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (newMessage.trim()) {
                          sendMessage.mutate(newMessage);
                        }
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      if (newMessage.trim()) {
                        sendMessage.mutate(newMessage);
                      }
                    }}
                    disabled={!newMessage.trim() || sendMessage.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to view messages</p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Stats Panel - Desktop Only */}
        <Card className="hidden xl:block w-64">
          <CardHeader>
            <CardTitle className="text-lg">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Conversations</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-500">{stats.open}</div>
              <p className="text-sm text-muted-foreground">Open</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-500">{stats.aiHandled}</div>
              <p className="text-sm text-muted-foreground">AI Handled</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.unread}</div>
              <p className="text-sm text-muted-foreground">Unread Messages</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
