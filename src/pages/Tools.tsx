import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Mail, 
  Share2, 
  FileText, 
  Zap, 
  Smartphone,
  Globe,
  Lock
} from 'lucide-react';

const tools = [
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track your business performance with detailed analytics and insights',
    action: 'View Analytics',
    gradient: 'bg-gradient-primary'
  },
  {
    icon: Mail,
    title: 'Email Marketing',
    description: 'Create and send email campaigns to your customers',
    action: 'Start Campaign',
    gradient: 'bg-gradient-accent'
  },
  {
    icon: Share2,
    title: 'Social Media',
    description: 'Connect and manage your social media accounts',
    action: 'Connect Accounts',
    gradient: 'bg-gradient-primary'
  },
  {
    icon: FileText,
    title: 'Reports',
    description: 'Generate custom reports for sales, inventory, and more',
    action: 'Create Report',
    gradient: 'bg-gradient-accent'
  },
  {
    icon: Zap,
    title: 'Automations',
    description: 'Set up automated workflows to save time',
    action: 'Setup Automation',
    gradient: 'bg-gradient-primary'
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Download and manage your business on the go',
    action: 'Get App',
    gradient: 'bg-gradient-accent'
  },
  {
    icon: Globe,
    title: 'SEO Tools',
    description: 'Optimize your site for search engines',
    action: 'Optimize SEO',
    gradient: 'bg-gradient-primary'
  },
  {
    icon: Lock,
    title: 'Security',
    description: 'Manage security settings and data protection',
    action: 'View Settings',
    gradient: 'bg-gradient-accent'
  },
];

export default function Tools() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Tools</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Powerful tools to grow and manage your business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card key={tool.title} className="hover:shadow-lg transition-all hover:scale-[1.02]">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${tool.gradient} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
                <CardDescription className="text-sm">{tool.description}</CardDescription>
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
  );
}
