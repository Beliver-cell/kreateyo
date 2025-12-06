import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Plus, Calendar as CalendarIcon, FileText, Video, Mail } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { format } from "date-fns";

export default function ContentCalendar() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    content_type: "blog",
    platform: "website",
    description: "",
    scheduled_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    word_count: "",
    author: "",
    tags: ""
  });

  const { data: content, isLoading } = useQuery({
    queryKey: ["content-calendar"],
    queryFn: async () => {
      const response = await api.get<{ data: any[] }>("/data/content_calendar?orderBy=scheduled_date&order=asc");
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.post("/data/content_calendar", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-calendar"] });
      setDialogOpen(false);
      toast.success("Content scheduled successfully");
      setFormData({ 
        title: "", 
        content_type: "blog", 
        platform: "website", 
        description: "", 
        scheduled_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        word_count: "", 
        author: "", 
        tags: "" 
      });
    },
    onError: () => toast.error("Failed to schedule content")
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      word_count: formData.word_count ? parseInt(formData.word_count) : null,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
    });
  };

  const getContentForDate = (date: Date) => {
    return content?.filter(c => {
      const contentDate = new Date(c.scheduled_date);
      return contentDate.toDateString() === date.toDateString();
    }) || [];
  };

  const upcomingContent = content?.filter(c => new Date(c.scheduled_date) >= new Date()) || [];
  const stats = {
    total: content?.length || 0,
    draft: content?.filter(c => c.status === 'draft').length || 0,
    scheduled: content?.filter(c => c.status === 'scheduled').length || 0,
    published: content?.filter(c => c.status === 'published').length || 0
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'blog': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Content Calendar</h1>
            <p className="text-muted-foreground">Plan and schedule your content</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule Content</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Content Type</Label>
                    <Select value={formData.content_type} onValueChange={(v) => setFormData({ ...formData, content_type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="email">Email Newsletter</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="podcast">Podcast</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Platform</Label>
                    <Select value={formData.platform} onValueChange={(v) => setFormData({ ...formData, platform: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Scheduled Date & Time</Label>
                    <Input 
                      type="datetime-local"
                      value={formData.scheduled_date}
                      onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Word Count</Label>
                    <Input 
                      type="number"
                      value={formData.word_count}
                      onChange={(e) => setFormData({ ...formData, word_count: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Author</Label>
                  <Input 
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Tags (comma separated)</Label>
                  <Input 
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="seo, marketing, tutorial"
                  />
                </div>
                <Button type="submit" className="w-full">Schedule Content</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draft}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scheduled}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.published}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              {selectedDate && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">
                    Content for {format(selectedDate, "MMMM d, yyyy")}
                  </h4>
                  {getContentForDate(selectedDate).length > 0 ? (
                    <div className="space-y-2">
                      {getContentForDate(selectedDate).map((item: any) => (
                        <div key={item.id} className="p-2 border rounded text-sm">
                          <div className="flex items-center gap-2">
                            {getIcon(item.content_type)}
                            <span className="font-medium">{item.title}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(item.scheduled_date), "h:mm a")} - {item.platform}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No content scheduled</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Content</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading...</p>
              ) : upcomingContent && upcomingContent.length > 0 ? (
                <div className="space-y-3">
                  {upcomingContent.slice(0, 10).map((item: any) => (
                    <div key={item.id} className="border rounded-lg p-3">
                      <div className="flex items-start gap-3">
                        {getIcon(item.content_type)}
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {item.content_type} - {item.platform}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(item.scheduled_date), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {item.tags.map((tag: string, i: number) => (
                                <span key={i} className="px-2 py-0.5 bg-secondary text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === 'published' ? 'bg-green-100 text-green-800' :
                          item.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No upcoming content</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}