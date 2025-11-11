# Service Category-Specific Tools

Advanced tools designed for specific service categories to help businesses manage their operations more effectively.

## 1. Campaign Performance Tracker (Marketing Services)

**Route**: `/marketing-campaigns`

### Features

- **Campaign Management**
  - Create and track multiple marketing campaigns
  - Support for multiple platforms (Google Ads, Facebook, Instagram, Email, etc.)
  - Campaign status management (active, paused, completed)

- **Performance Metrics**
  - Impressions tracking
  - Click-through rate (CTR) calculation
  - Conversion tracking
  - ROI calculation
  - Budget vs. Spend monitoring

- **Analytics Dashboard**
  - Total impressions across all campaigns
  - Total clicks with CTR percentage
  - Total spend vs. budget
  - Overall ROI percentage
  - Revenue tracking

### Database Schema

```sql
CREATE TABLE public.marketing_campaigns (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  platform TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  budget NUMERIC(10,2),
  spent NUMERIC(10,2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue NUMERIC(10,2) DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Use Cases
- Digital marketing agencies
- Social media managers
- PPC specialists
- Email marketing services

---

## 2. Project Milestone Tracker (Design Services)

**Route**: `/design-projects`

### Features

- **Project Management**
  - Create design projects with client information
  - Multiple project types (logo, website, branding, UI/UX, print, etc.)
  - Project status tracking (planning, in_progress, review, completed, on_hold)
  - Budget and deadline management

- **Milestone Tracking**
  - Add unlimited milestones per project
  - Due date tracking
  - Completion status with timestamps
  - Progress visualization

- **Progress Monitoring**
  - Completion percentage tracking
  - Visual progress bars
  - Overview of active, completed, and total projects

### Database Schema

**Projects Table**:
```sql
CREATE TABLE public.design_projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  client_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  description TEXT,
  project_type TEXT,
  status TEXT DEFAULT 'planning',
  budget NUMERIC(10,2),
  start_date TIMESTAMP WITH TIME ZONE,
  deadline TIMESTAMP WITH TIME ZONE,
  completion_percentage INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Milestones Table**:
```sql
CREATE TABLE public.design_milestones (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES design_projects(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Use Cases
- Graphic designers
- Web design agencies
- Branding consultants
- UI/UX designers
- Print design services

---

## 3. Content Calendar (Writing Services)

**Route**: `/content-calendar`

### Features

- **Content Planning**
  - Schedule content with date and time
  - Multiple content types (blog, social media, email, video, podcast)
  - Platform-specific content (website, Facebook, Instagram, Twitter, LinkedIn, YouTube)
  - Status management (draft, scheduled, published, archived)

- **Calendar View**
  - Visual calendar interface
  - See all content scheduled for specific dates
  - Quick overview of upcoming content

- **Content Management**
  - Word count tracking
  - Author assignment
  - Tag system for categorization
  - Detailed descriptions and notes

- **Analytics**
  - Total content count
  - Draft, scheduled, and published statistics
  - Upcoming content list view

### Database Schema

```sql
CREATE TABLE public.content_calendar (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  platform TEXT,
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'draft',
  word_count INTEGER,
  author TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Use Cases
- Content writers
- Copywriters
- Blog management services
- Social media content creators
- Content marketing agencies
- Technical writers

---

## Integration with Business Types

These tools are automatically shown in the sidebar navigation based on the business type:

### For E-commerce Businesses
- **Marketing Campaigns** tool is available for all e-commerce types
- Helps track advertising campaigns and ROI

### For Service Businesses
- **Projects** (Design Projects) - Available for all service types
- **Content Calendar** - Available for all service types
- **Marketing Campaigns** - Available for marketing service types

## Navigation Structure

Tools appear in the sidebar menu under business-specific sections:
- E-commerce → "Marketing"
- Services → "Projects" and "Content Calendar"

## Benefits

1. **Specialized Tools**: Purpose-built for specific service categories
2. **Improved Organization**: Keep projects, campaigns, and content organized
3. **Better Time Management**: Visual calendars and deadline tracking
4. **Performance Insights**: Track metrics that matter for each service type
5. **Client Communication**: Better project tracking leads to improved client updates
6. **Scalability**: Manage multiple projects/campaigns simultaneously

## Future Enhancements

- Client portal access to view project progress
- Automated reporting and analytics
- Integration with external tools (Google Analytics, social media APIs)
- Template system for recurring projects/campaigns
- Collaboration features for team members
- Time tracking integration
- Invoice generation based on project milestones
