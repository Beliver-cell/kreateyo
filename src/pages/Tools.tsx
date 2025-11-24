import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  BarChart3, 
  Mail, 
  Share2, 
  FileText, 
  Zap, 
  Users,
  Globe,
  Target,
  LineChart,
  Bot,
  Image,
  Calendar,
  Star,
  MessageSquare,
  TrendingUp,
  Search,
  ArrowLeft,
  Download
} from 'lucide-react';

interface Tool {
  icon: any;
  title: string;
  description: string;
  category: string;
  isPremium: boolean;
  rating: number;
  downloads: string;
  gradient: string;
  screenshots: string[];
}

const allTools: Tool[] = [
  {
    icon: Globe,
    title: 'SEO Analyzer',
    description: 'Optimize your site for search engines with real-time suggestions and detailed analytics',
    category: 'Marketing',
    isPremium: false,
    rating: 4.5,
    downloads: '10K+',
    gradient: 'bg-gradient-primary',
    screenshots: []
  },
  {
    icon: Mail,
    title: 'Email Campaign Builder',
    description: 'Create and send beautiful email campaigns to your customers with drag-and-drop editor',
    category: 'Marketing',
    isPremium: true,
    rating: 4.8,
    downloads: '25K+',
    gradient: 'bg-gradient-accent',
    screenshots: []
  },
  {
    icon: Share2,
    title: 'Social Scheduler',
    description: 'Schedule and manage posts across all social platforms from one dashboard',
    category: 'Marketing',
    isPremium: true,
    rating: 4.6,
    downloads: '15K+',
    gradient: 'bg-gradient-primary',
    screenshots: []
  },
  {
    icon: Target,
    title: 'Ad Campaign Manager',
    description: 'Create and track advertising campaigns across multiple platforms',
    category: 'Marketing',
    isPremium: true,
    rating: 4.4,
    downloads: '8K+',
    gradient: 'bg-gradient-accent',
    screenshots: []
  },
  {
    icon: BarChart3,
    title: 'Advanced Reports',
    description: 'Generate comprehensive reports on sales, traffic, and performance metrics',
    category: 'Analytics',
    isPremium: false,
    rating: 4.7,
    downloads: '20K+',
    gradient: 'bg-gradient-primary',
    screenshots: []
  },
  {
    icon: Users,
    title: 'Customer Insights',
    description: 'Understand your audience with detailed behavioral analytics and segmentation',
    category: 'Analytics',
    isPremium: true,
    rating: 4.9,
    downloads: '12K+',
    gradient: 'bg-gradient-accent',
    screenshots: []
  },
  {
    icon: LineChart,
    title: 'Performance Metrics',
    description: 'Track KPIs and monitor business health in real-time dashboards',
    category: 'Analytics',
    isPremium: false,
    rating: 4.6,
    downloads: '18K+',
    gradient: 'bg-gradient-primary',
    screenshots: []
  },
  {
    icon: TrendingUp,
    title: 'Growth Forecaster',
    description: 'AI-powered predictions for revenue and customer growth patterns',
    category: 'Analytics',
    isPremium: true,
    rating: 4.8,
    downloads: '9K+',
    gradient: 'bg-gradient-accent',
    screenshots: []
  },
  {
    icon: Bot,
    title: 'AI Content Writer',
    description: 'Generate blog posts, product descriptions, and marketing copy instantly',
    category: 'Productivity',
    isPremium: true,
    rating: 4.9,
    downloads: '30K+',
    gradient: 'bg-gradient-primary',
    screenshots: []
  },
  {
    icon: Image,
    title: 'Image Optimizer',
    description: 'Automatically compress and optimize images for faster loading speeds',
    category: 'Productivity',
    isPremium: false,
    rating: 4.5,
    downloads: '22K+',
    gradient: 'bg-gradient-accent',
    screenshots: []
  },
  {
    icon: Zap,
    title: 'Task Automator',
    description: 'Set up automated workflows to save time on repetitive business tasks',
    category: 'Productivity',
    isPremium: true,
    rating: 4.7,
    downloads: '16K+',
    gradient: 'bg-gradient-primary',
    screenshots: []
  },
  {
    icon: Calendar,
    title: 'Content Scheduler',
    description: 'Plan and schedule content releases across all your channels',
    category: 'Productivity',
    isPremium: false,
    rating: 4.4,
    downloads: '14K+',
    gradient: 'bg-gradient-accent',
    screenshots: []
  },
  {
    icon: Star,
    title: 'Loyalty Program Builder',
    description: 'Create reward programs to increase customer retention and engagement',
    category: 'Growth',
    isPremium: true,
    rating: 4.6,
    downloads: '11K+',
    gradient: 'bg-gradient-primary',
    screenshots: []
  },
  {
    icon: MessageSquare,
    title: 'Review Collector',
    description: 'Automate review requests and showcase customer feedback beautifully',
    category: 'Growth',
    isPremium: false,
    rating: 4.8,
    downloads: '13K+',
    gradient: 'bg-gradient-accent',
    screenshots: []
  },
  {
    icon: Users,
    title: 'CRM Integrator',
    description: 'Connect with popular CRM tools for seamless customer management',
    category: 'Growth',
    isPremium: true,
    rating: 4.7,
    downloads: '19K+',
    gradient: 'bg-gradient-primary',
    screenshots: []
  },
  {
    icon: FileText,
    title: 'Invoice Generator',
    description: 'Create professional invoices and track payments effortlessly',
    category: 'Growth',
    isPremium: false,
    rating: 4.5,
    downloads: '17K+',
    gradient: 'bg-gradient-accent',
    screenshots: []
  }
];

export default function Tools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const filteredTools = allTools.filter(tool =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRecommendedTools = (currentTool: Tool) => {
    return allTools
      .filter(tool => tool.category === currentTool.category && tool.title !== currentTool.title)
      .slice(0, 4);
  };

  const handleInstall = (tool: Tool) => {
    toast({ 
      title: tool.isPremium ? "Subscribing..." : "Installing...", 
      description: `${tool.title} is being ${tool.isPremium ? 'activated' : 'installed'}.` 
    });
    setTimeout(() => {
      toast({ 
        title: "Success!", 
        description: `${tool.title} is now active and ready to use.` 
      });
    }, 1500);
  };

  const handlePreview = (tool: Tool) => {
    toast({ 
      title: "Preview mode", 
      description: `Exploring ${tool.title} features...` 
    });
  };

  if (selectedTool) {
    const Icon = selectedTool.icon;
    const recommendedTools = getRecommendedTools(selectedTool);

    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => setSelectedTool(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Tool Details</h1>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className={`w-16 h-16 rounded-xl ${selectedTool.gradient} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold mb-1">{selectedTool.title}</h2>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={selectedTool.isPremium ? "default" : "secondary"} className="text-xs">
                        {selectedTool.isPremium ? 'Premium' : 'Free'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{selectedTool.category}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span>{selectedTool.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        <span>{selectedTool.downloads}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">About this tool</h3>
                  <p className="text-sm text-muted-foreground">{selectedTool.description}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button 
                    className="flex-1"
                    onClick={() => handleInstall(selectedTool)}
                  >
                    {selectedTool.isPremium ? 'Subscribe' : 'Install'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handlePreview(selectedTool)}
                  >
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {recommendedTools.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3">Recommended Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  {recommendedTools.map((tool) => {
                    const ToolIcon = tool.icon;
                    return (
                      <Card
                        key={tool.title}
                        className="cursor-pointer hover:shadow-md transition-all"
                        onClick={() => setSelectedTool(tool)}
                      >
                        <CardContent className="p-3">
                          <div className={`w-10 h-10 rounded-lg ${tool.gradient} flex items-center justify-center mb-2`}>
                            <ToolIcon className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-xs font-semibold mb-1 line-clamp-1">{tool.title}</h4>
                          <div className="flex items-center justify-between">
                            <Badge variant={tool.isPremium ? "default" : "secondary"} className="text-[10px] px-1 py-0">
                              {tool.isPremium ? 'Premium' : 'Free'}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
                              <span className="text-[10px] text-muted-foreground">{tool.rating}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">App Marketplace</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.title}
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                onClick={() => setSelectedTool(tool)}
              >
                <CardContent className="p-3 md:p-4">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${tool.gradient} flex items-center justify-center mb-2 mx-auto`}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <h3 className="text-xs md:text-sm font-semibold text-center mb-1 line-clamp-2 min-h-[32px]">
                    {tool.title}
                  </h3>
                  <div className="flex flex-col items-center gap-1">
                    <Badge variant={tool.isPremium ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                      {tool.isPremium ? 'Premium' : 'Free'}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-[10px] text-muted-foreground">{tool.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
