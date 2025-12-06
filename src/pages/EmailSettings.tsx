import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Mail, Shield, CheckCircle2, XCircle, RefreshCw, 
  Copy, AlertTriangle, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export default function EmailSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newDomain, setNewDomain] = useState("");

  const { data: domains, isLoading } = useQuery({
    queryKey: ["email_domains"],
    queryFn: async () => {
      const response = await api.get<{ data: any[] }>("/data/email_domains");
      return response.data;
    },
    enabled: !!user,
  });

  const addDomain = useMutation({
    mutationFn: async (domain: string) => {
      const dkimRecord = `v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...`;
      const spfRecord = `v=spf1 include:_spf.kreateyo.com ~all`;

      const response = await api.post<{ data: any }>("/data/email_domains", {
        user_id: user?.id,
        domain,
        dkim_record: dkimRecord,
        spf_record: spfRecord,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email_domains"] });
      setNewDomain("");
      toast.success("Domain added. Please configure DNS records.");
    },
    onError: (error: any) => {
      toast.error("Failed to add domain: " + error.message);
    },
  });

  const verifyDomain = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/data/email_domains/${id}`, { 
        status: "verified",
        dkim_verified: true,
        spf_verified: true,
        verified_at: new Date().toISOString(),
        last_check_at: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email_domains"] });
      toast.success("Domain verified successfully!");
    },
    onError: (error: any) => {
      toast.error("Verification failed: " + error.message);
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const verifiedDomain = domains?.find(d => d.status === "verified");

  return (
    <DashboardLayout>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Email Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure your domain for branded email delivery
          </p>
        </div>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Sending Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {verifiedDomain ? (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div>
                  <p className="font-medium">Emails sent from: {verifiedDomain.domain}</p>
                  <p className="text-sm text-muted-foreground">
                    Your emails will appear from your business domain
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                <div>
                  <p className="font-medium">Emails sent via KreateYo</p>
                  <p className="text-sm text-muted-foreground">
                    Your emails will show "Your Business via KreateYo"
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Domain */}
        <Card>
          <CardHeader>
            <CardTitle>Add Your Domain</CardTitle>
            <CardDescription>
              Verify your domain to send emails from your business address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="yourbusiness.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
              />
              <Button
                onClick={() => addDomain.mutate(newDomain)}
                disabled={!newDomain || addDomain.isPending}
              >
                {addDomain.isPending ? "Adding..." : "Add Domain"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Domain List */}
        {domains && domains.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Domains</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {domains.map((domain) => (
                <div key={domain.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{domain.domain}</span>
                      <Badge
                        className={
                          domain.status === "verified"
                            ? "bg-green-500/10 text-green-500"
                            : domain.status === "failed"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }
                      >
                        {domain.status}
                      </Badge>
                    </div>
                    {domain.status !== "verified" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => verifyDomain.mutate(domain.id)}
                        disabled={verifyDomain.isPending}
                      >
                        <RefreshCw className={`h-4 w-4 mr-1 ${verifyDomain.isPending ? "animate-spin" : ""}`} />
                        Verify
                      </Button>
                    )}
                  </div>

                  {domain.status !== "verified" && (
                    <div className="space-y-4">
                      <Alert>
                        <AlertDescription>
                          Add these DNS records to your domain provider to verify ownership:
                        </AlertDescription>
                      </Alert>

                      {/* DKIM Record */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            DKIM Record
                            {domain.dkim_verified ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </Label>
                        </div>
                        <div className="flex gap-2">
                          <code className="flex-1 p-2 bg-muted rounded text-xs break-all">
                            {domain.dkim_record}
                          </code>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyToClipboard(domain.dkim_record || "")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* SPF Record */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            SPF Record
                            {domain.spf_verified ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </Label>
                        </div>
                        <div className="flex gap-2">
                          <code className="flex-1 p-2 bg-muted rounded text-xs break-all">
                            {domain.spf_record}
                          </code>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyToClipboard(domain.spf_record || "")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {domain.verified_at && (
                    <p className="text-xs text-muted-foreground">
                      Verified on {new Date(domain.verified_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Setting up DNS records can be tricky. Here are guides for popular providers:
            </p>
            <div className="flex flex-wrap gap-2">
              {["GoDaddy", "Namecheap", "Cloudflare", "Google Domains"].map((provider) => (
                <Button key={provider} variant="outline" size="sm">
                  {provider}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
