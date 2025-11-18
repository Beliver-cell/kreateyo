import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Wand2, FileText, Image as ImageIcon, Mail, MessageSquare, TrendingUp, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

export default function AIAutomation() {
  const [loading, setLoading] = useState(false);
  const [productInput, setProductInput] = useState('');
  const [productResult, setProductResult] = useState('');
  const [seoInput, setSeoInput] = useState('');
  const [seoResult, setSeoResult] = useState({ title: '', description: '', keywords: '' });

  const generateProductDescription = async () => {
    setLoading(true);
    // Simulate AI generation
    setTimeout(() => {
      setProductResult(`Premium quality ${productInput} crafted with attention to detail. Features include:\n\n• High-grade materials for durability\n• Modern design that complements any style\n• Easy to use and maintain\n• Perfect for everyday use\n• Backed by our quality guarantee\n\nThis ${productInput} combines functionality with aesthetics, making it an essential addition to your collection. Order now and experience the difference!`);
      setLoading(false);
      toast({ title: 'Description generated!', description: 'Your product description is ready.' });
    }, 2000);
  };

  const generateSEO = async () => {
    setLoading(true);
    // Simulate AI generation
    setTimeout(() => {
      setSeoResult({
        title: `${seoInput} - Premium Quality | Shop Now`,
        description: `Discover our ${seoInput} collection. High-quality products, competitive prices, and fast delivery across Africa. Order online today!`,
        keywords: `${seoInput}, buy ${seoInput} online, ${seoInput} Africa, premium ${seoInput}, affordable ${seoInput}`
      });
      setLoading(false);
      toast({ title: 'SEO generated!', description: 'Your SEO metadata is ready.' });
    }, 2000);
  };

  const enhanceImage = async () => {
    toast({ 
      title: 'Image Enhancement', 
      description: 'AI image enhancement will process your images and improve quality, remove backgrounds, and optimize for web.' 
    });
  };

  const generateEmailTemplate = async () => {
    toast({ 
      title: 'Email Template Generated', 
      description: 'A professional email template has been created based on your business type.' 
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-premium bg-clip-text text-transparent">AI Automation</h1>
        <p className="text-muted-foreground mt-1">Let AI handle the heavy lifting</p>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" />
                <CardTitle>Product Description Generator</CardTitle>
              </div>
              <CardDescription>Create compelling product descriptions instantly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  placeholder="e.g., Premium Leather Wallet"
                  value={productInput}
                  onChange={(e) => setProductInput(e.target.value)}
                />
              </div>
              <Button onClick={generateProductDescription} disabled={loading || !productInput} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Description
                  </>
                )}
              </Button>
              {productResult && (
                <div className="space-y-2">
                  <Label>Generated Description</Label>
                  <Textarea
                    value={productResult}
                    readOnly
                    className="min-h-[200px] bg-muted/50"
                  />
                  <Button variant="outline" className="w-full" onClick={() => {
                    navigator.clipboard.writeText(productResult);
                    toast({ title: 'Copied!', description: 'Description copied to clipboard.' });
                  }}>
                    Copy to Clipboard
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                <CardTitle>AI Image Enhancement</CardTitle>
              </div>
              <CardDescription>Improve image quality and remove backgrounds automatically</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop images here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports JPG, PNG, WebP up to 10MB
                </p>
              </div>
              <Button onClick={enhanceImage} className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance Images
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <CardTitle>SEO Metadata Generator</CardTitle>
              </div>
              <CardDescription>Generate optimized titles, descriptions, and keywords</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Page/Product Name</Label>
                <Input
                  placeholder="e.g., Handcrafted African Jewelry"
                  value={seoInput}
                  onChange={(e) => setSeoInput(e.target.value)}
                />
              </div>
              <Button onClick={generateSEO} disabled={loading || !seoInput} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate SEO
                  </>
                )}
              </Button>
              {seoResult.title && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Label>Meta Title</Label>
                    <Input value={seoResult.title} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea value={seoResult.description} readOnly rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Keywords</Label>
                    <Input value={seoResult.keywords} readOnly />
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => {
                    navigator.clipboard.writeText(`Title: ${seoResult.title}\nDescription: ${seoResult.description}\nKeywords: ${seoResult.keywords}`);
                    toast({ title: 'Copied!', description: 'SEO metadata copied to clipboard.' });
                  }}>
                    Copy All
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <CardTitle>Email Template Generator</CardTitle>
              </div>
              <CardDescription>Create professional email templates for your campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={generateEmailTemplate} className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Email Template
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <CardTitle>Auto-Response Assistant</CardTitle>
              </div>
              <CardDescription>Set up intelligent auto-responses for common queries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Common Question</Label>
                <Input placeholder="e.g., What are your shipping times?" />
              </div>
              <Button className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Response
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <CardTitle>Onboarding Guide Generator</CardTitle>
              </div>
              <CardDescription>Create personalized onboarding flows for new users</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Onboarding Guide
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
