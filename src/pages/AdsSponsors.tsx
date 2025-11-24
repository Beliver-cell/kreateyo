import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  TrendingUp,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function AdsSponsors() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Ads & Sponsors</h1>
          <p className="text-muted-foreground text-sm md:text-base">Monetize your blog with ads and sponsorships</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button className="w-full sm:w-auto">
            <Sparkles className="mr-2 h-4 w-4" />
            Connect Ad Network
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">Find Sponsors</Button>
        </div>
      </div>

      {/* Monetization Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,150</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Pageviews</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,000</div>
            <p className="text-xs text-muted-foreground mt-1">Across all posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RPM (Revenue per 1k)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$25.56</div>
            <p className="text-xs text-muted-foreground mt-1">Industry average: $18</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Ad Networks */}
        <Card>
          <CardHeader>
            <CardTitle>Ad Networks</CardTitle>
            <CardDescription>Connect and manage your advertising platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-gradient-to-r from-green-500/10 to-transparent">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    Google AdSense
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </h3>
                  <Badge variant="secondary" className="mt-1">Connected</Badge>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">$650</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Manage Ads
                </Button>
                <Button size="sm" variant="outline">View Reports</Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">Mediavine</h3>
                  <Badge variant="outline" className="mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Available for 50k+ traffic
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Premium ad network with higher RPMs. Requires 50,000+ sessions/month.
              </p>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span>Progress to eligibility</span>
                  <span className="font-medium">45k / 50k sessions</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Learn More</Button>
                <Button size="sm" variant="outline">Apply</Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">AdThrive</h3>
                  <Badge variant="outline" className="mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Available for 100k+ traffic
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Top-tier ad management. Requires 100,000+ pageviews/month.
              </p>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span>Progress to eligibility</span>
                  <span className="font-medium">45k / 100k pageviews</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Learn More</Button>
                <Button size="sm" variant="outline">Apply</Button>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Ad Placements</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-2 text-primary" />
                  Header ads
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-2 text-primary" />
                  In-content ads
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-2 text-primary" />
                  Sidebar ads
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-3 w-3 mr-2 text-primary" />
                  Footer ads
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Sponsorships */}
        <Card>
          <CardHeader>
            <CardTitle>Sponsorship Opportunities</CardTitle>
            <CardDescription>Partner with brands for sponsored content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">Tech Company</h3>
                  <p className="text-sm text-muted-foreground mt-1">SaaS Product Review</p>
                </div>
                <Badge className="bg-green-600">$300</Badge>
              </div>
              <div className="space-y-2 mb-3">
                <p className="text-sm">
                  <Eye className="inline h-3 w-3 mr-1" />
                  12k monthly readers in target niche
                </p>
                <p className="text-xs text-muted-foreground">
                  Write a comprehensive review of their project management tool
                </p>
              </div>
              <Button size="sm" className="w-full">Accept Offer</Button>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-500/10 to-transparent">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">SaaS Tool</h3>
                  <p className="text-sm text-muted-foreground mt-1">Sponsored Tutorial</p>
                </div>
                <Badge className="bg-green-600">$450</Badge>
              </div>
              <div className="space-y-2 mb-3">
                <p className="text-sm">
                  <Eye className="inline h-3 w-3 mr-1" />
                  8k engaged audience
                </p>
                <p className="text-xs text-muted-foreground">
                  Create a tutorial showing how to use their automation platform
                </p>
              </div>
              <Button size="sm" className="w-full">Accept Offer</Button>
            </div>

            <Button variant="outline" className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              Find More Sponsors
            </Button>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-3">Your Sponsorship Packages</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sponsored Post</span>
                  <span className="font-medium">$250-$500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Product Review</span>
                  <span className="font-medium">$300-$600</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Newsletter Feature</span>
                  <span className="font-medium">$150-$300</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Social Media Shoutout</span>
                  <span className="font-medium">$100-$200</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Breakdown</CardTitle>
          <CardDescription>Your revenue sources and top performing content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-4">Revenue Sources</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Ad Revenue</span>
                    <span className="font-medium">$850 (74%)</span>
                  </div>
                  <Progress value={74} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Sponsorships</span>
                    <span className="font-medium">$300 (26%)</span>
                  </div>
                  <Progress value={26} className="h-2" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Top Earning Content</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">SEO Guide for Beginners</p>
                    <p className="text-xs text-muted-foreground">5,200 views</p>
                  </div>
                  <span className="text-sm font-bold">$120</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Blogging Tips & Tricks</p>
                    <p className="text-xs text-muted-foreground">4,100 views</p>
                  </div>
                  <span className="text-sm font-bold">$95</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Best Productivity Tools 2024</p>
                    <p className="text-xs text-muted-foreground">3,800 views</p>
                  </div>
                  <span className="text-sm font-bold">$80</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full">View Detailed Reports</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
