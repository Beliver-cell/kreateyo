import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  TrendingUp
} from 'lucide-react';

const toolCategories = [
  {
    category: 'Marketing Suite',
    description: 'Boost your reach and engagement',
    tools: [
      {
        icon: Globe,
        title: 'SEO Analyzer',
        description: 'Optimize your site for search engines with real-time suggestions',
        action: 'Launch Tool',
        badge: 'Popular',
        gradient: 'bg-gradient-primary'
      },
      {
        icon: Mail,
        title: 'Email Campaign Builder',
        description: 'Create and send beautiful email campaigns to your customers',
        action: 'Start Campaign',
        gradient: 'bg-gradient-accent'
      },
      {
        icon: Share2,
        title: 'Social Scheduler',
        description: 'Schedule and manage posts across all social platforms',
        action: 'Connect Accounts',
        gradient: 'bg-gradient-primary'
      },
      {
        icon: Target,
        title: 'Ad Campaign Manager',
        description: 'Create and track advertising campaigns across platforms',
        action: 'Create Campaign',
        gradient: 'bg-gradient-accent'
      }
    ]
  },
  {
    category: 'Analytics Hub',
    description: 'Data-driven insights for growth',
    tools: [
      {
        icon: BarChart3,
        title: 'Advanced Reports',
        description: 'Generate comprehensive reports on sales, traffic, and performance',
        action: 'View Reports',
        badge: 'New',
        gradient: 'bg-gradient-primary'
      },
      {
        icon: Users,
        title: 'Customer Insights',
        description: 'Understand your audience with detailed behavioral analytics',
        action: 'Explore Insights',
        gradient: 'bg-gradient-accent'
      },
      {
        icon: LineChart,
        title: 'Performance Metrics',
        description: 'Track KPIs and monitor business health in real-time',
        action: 'View Dashboard',
        gradient: 'bg-gradient-primary'
      },
      {
        icon: TrendingUp,
        title: 'Growth Forecaster',
        description: 'AI-powered predictions for revenue and customer growth',
        action: 'Get Forecast',
        badge: 'AI',
        gradient: 'bg-gradient-accent'
      }
    ]
  },
  {
    category: 'Productivity Tools',
    description: 'Work smarter, not harder',
    tools: [
      {
        icon: Bot,
        title: 'AI Content Writer',
        description: 'Generate blog posts, product descriptions, and marketing copy',
        action: 'Start Writing',
        badge: 'AI',
        gradient: 'bg-gradient-primary'
      },
      {
        icon: Image,
        title: 'Image Optimizer',
        description: 'Automatically compress and optimize images for faster loading',
        action: 'Optimize Images',
        gradient: 'bg-gradient-accent'
      },
      {
        icon: Zap,
        title: 'Task Automator',
        description: 'Set up automated workflows to save time on repetitive tasks',
        action: 'Create Automation',
        gradient: 'bg-gradient-primary'
      },
      {
        icon: Calendar,
        title: 'Content Scheduler',
        description: 'Plan and schedule content releases across all channels',
        action: 'Schedule Content',
        gradient: 'bg-gradient-accent'
      }
    ]
  },
  {
    category: 'Business Growth',
    description: 'Scale your business faster',
    tools: [
      {
        icon: Star,
        title: 'Loyalty Program Builder',
        description: 'Create reward programs to increase customer retention',
        action: 'Build Program',
        gradient: 'bg-gradient-primary'
      },
      {
        icon: MessageSquare,
        title: 'Review Collector',
        description: 'Automate review requests and showcase customer feedback',
        action: 'Collect Reviews',
        gradient: 'bg-gradient-accent'
      },
      {
        icon: Users,
        title: 'CRM Integrator',
        description: 'Connect with popular CRM tools for seamless customer management',
        action: 'Connect CRM',
        gradient: 'bg-gradient-primary'
      },
      {
        icon: FileText,
        title: 'Invoice Generator',
        description: 'Create professional invoices and track payments effortlessly',
        action: 'Generate Invoice',
        gradient: 'bg-gradient-accent'
      }
    ]
  }
];

export default function Tools() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Tools</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Powerful tools to grow and manage your business - One-click activation, no installation required
        </p>
      </div>

      <div className="space-y-8 md:space-y-12">
        {toolCategories.map((category) => (
          <div key={category.category} className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h2 className="text-xl md:text-2xl font-bold">{category.category}</h2>
              <p className="text-muted-foreground text-sm md:text-base mt-1">
                {category.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {category.tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Card key={tool.title} className="hover:shadow-lg transition-all hover:scale-[1.02] relative">
                    {tool.badge && (
                      <Badge 
                        className="absolute top-3 right-3" 
                        variant={tool.badge === 'AI' ? 'default' : 'secondary'}
                      >
                        {tool.badge}
                      </Badge>
                    )}
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${tool.gradient} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <CardDescription className="text-sm min-h-[40px]">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        {tool.action}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
