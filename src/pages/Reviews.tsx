import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Star, StarHalf, MessageSquare, CheckCircle2, XCircle, 
  Clock, ThumbsUp, Flag, Search, Filter, MoreHorizontal,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500",
  approved: "bg-green-500/10 text-green-500",
  rejected: "bg-red-500/10 text-red-500",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [responseText, setResponseText] = useState("");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const response = await api.get<{ data: any[] }>("/data/reviews");
      return response.data;
    },
    enabled: !!user,
  });

  const updateReview = useMutation({
    mutationFn: async ({ id, status, response }: { id: string; status?: string; response?: string }) => {
      const updateData: any = {};
      if (status) updateData.status = status;
      if (response) {
        updateData.response = response;
        updateData.responded_at = new Date().toISOString();
      }
      
      await api.patch(`/data/reviews/${id}`, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setSelectedReview(null);
      setResponseText("");
      toast.success("Review updated successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to update review: " + error.message);
    },
  });

  const filteredReviews = reviews?.filter((r) => {
    if (activeTab !== "all" && r.status !== activeTab) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        r.customer_name?.toLowerCase().includes(query) ||
        r.content?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const stats = {
    total: reviews?.length || 0,
    pending: reviews?.filter(r => r.status === "pending").length || 0,
    approved: reviews?.filter(r => r.status === "approved").length || 0,
    avgRating: reviews?.length 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0",
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Reviews</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage customer reviews and feedback
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="text-2xl font-bold">{stats.avgRating}</span>
              </div>
              <p className="text-xs text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total Reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-500">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Published</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filteredReviews?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reviews found</p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews?.map((review) => (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {review.customer_name?.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{review.customer_name || "Anonymous"}</span>
                            {review.is_verified_purchase && (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={review.rating} />
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Badge className={statusColors[review.status as keyof typeof statusColors]}>
                          {review.status}
                        </Badge>
                      </div>

                      {review.title && (
                        <h4 className="font-medium">{review.title}</h4>
                      )}
                      <p className="text-sm text-muted-foreground">{review.content}</p>

                      {review.response && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Your Response:</p>
                          <p className="text-sm">{review.response}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        {review.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-500 hover:text-green-600"
                              onClick={() => updateReview.mutate({ id: review.id, status: "approved" })}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => updateReview.mutate({ id: review.id, status: "rejected" })}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {!review.response && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedReview(review)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Respond
                          </Button>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{review.helpful_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Response Dialog */}
        <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Respond to Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {selectedReview && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={selectedReview.rating} />
                    <span className="text-sm font-medium">{selectedReview.customer_name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedReview.content}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label>Your Response</Label>
                <Textarea
                  placeholder="Write your response..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  if (selectedReview && responseText) {
                    updateReview.mutate({ id: selectedReview.id, response: responseText });
                  }
                }}
                disabled={!responseText || updateReview.isPending}
              >
                {updateReview.isPending ? "Sending..." : "Send Response"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
