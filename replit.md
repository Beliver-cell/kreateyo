# Kreateyo - All-in-One Business Platform

## Overview

Kreateyo is a multi-tenant SaaS platform that enables users to build and manage three distinct types of businesses: E-commerce stores, Service-based businesses, and Blogging platforms. The system provides comprehensive tools including visual site builders, AI-powered chatbots, payment processing, appointment scheduling, and team collaboration features.

Each business receives a unique subdomain (e.g., `businessname.kreateyo.com`) with support for custom domains. The platform is designed to scale to millions of users with tiered pricing (Solo, Team, Enterprise) and integrated payment processing through Yopay (built on Flutterwave).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Multi-Tenant Architecture

**Business Isolation**: The platform implements a business-centric multi-tenant model where each business operates as an isolated entity with its own customers, products, services, and content. The `Business` model serves as the primary tenant identifier, referenced across all major collections.

**Subdomain Routing**: The subdomain middleware (`backend/middleware/subdomain.js`) intercepts requests and resolves them to the appropriate business based on the hostname. Custom domains are supported through the `Domain` model with DNS verification workflows.

**Account Tiers**: Three account types (Solo, Team, Enterprise) determine feature access and platform fees. Solo accounts are single-user, while Team accounts support multiple members with role-based permissions managed through the `Team` model.

### Frontend Architecture

**Technology Stack**: React-based SPA built with Vite, using shadcn/ui components and Tailwind CSS for styling. The application uses React Router for client-side routing and React Query for server state management.

**Context Providers**: Global state management through React contexts:
- `AuthContext`: User authentication state
- `BusinessContext`: Current business context and switching
- `CartProvider`: E-commerce shopping cart state with localStorage persistence

**Template System**: Pre-built templates for different business types (Coza Store, Male Fashion for e-commerce) that integrate with the backend API for product data, cart management, and checkout flows.

### Backend Architecture

**Framework**: Node.js with Express.js serving RESTful APIs. The backend follows a standard MVC pattern with controllers, models, and middleware separated into distinct directories.

**Authentication Strategy**: 
- JWT-based authentication for business owners/staff (`backend/middleware/auth.js`)
- Separate customer authentication system (`backend/middleware/customerAuth.js`) for end-user portal access
- OAuth 2.0 support for Google authentication via Passport.js
- API key authentication for programmatic access

**Business Logic Separation**: Each business type (blogging, ecommerce, services) has dedicated controllers and models. Type-specific customer profiles (`ServiceCustomer`, `EcommerceCustomer`) extend the base `Customer` model.

### Data Storage

**Database**: PostgreSQL with Drizzle ORM for type-safe database operations. The schema is defined in `shared/schema.ts` with migrations managed through Drizzle Kit.

**Schema Design**: The database uses UUID primary keys and includes comprehensive indexes on frequently queried fields (email lookups, business associations, status filters, time-based queries).

**Key Tables**:
- `users`: Platform user accounts (business owners/staff)
- `businesses`: Tenant records with branding and configuration
- `sessions`: Authentication token management
- Supporting tables for products, services, orders, appointments, customers, etc.

**Note**: While the application currently uses Drizzle ORM with PostgreSQL schema definitions, the existing backend implementation uses MongoDB with Mongoose. A migration path exists through the Drizzle configuration.

### Payment Processing

**Yopay Integration**: Custom payment gateway built on Flutterwave infrastructure. The system handles:
- Tiered platform fees (3.5% Solo, 2.0% Team, 0.5% Enterprise) calculated post-Flutterwave transaction fees
- Subaccount creation per business for automatic fund splitting
- Webhook handling with signature verification for payment confirmations
- Transaction idempotency using deterministic `txRef` generation

**Onboarding Flow**: Multi-step onboarding process (`YopayOnboarding` service) collects business information, bank details, and creates Flutterwave subaccounts. Progress tracked through `YopayOnboardingSession` model.

**Security**: Rate limiting on payment endpoints (100 req/15min), webhook signature validation, and duplicate transaction prevention.

### File Management

**Cloudinary Integration**: All file uploads (images, documents, media) are processed through Cloudinary for storage and optimization. The `File` model tracks metadata while actual binaries reside in Cloudinary.

**Upload Pipeline**: Multer middleware handles multipart uploads to memory, then streams to Cloudinary with automatic transformations and folder organization per business.

### AI & Automation

**Chatbot System**: Conversational AI for customer support using OpenAI API integration. The `Chatbot` model stores conversation history with sentiment analysis and automatic tagging.

**AI Services**: Centralized AI service (`backend/utils/aiService.js`) for various capabilities including:
- Customer support chatbot responses
- Marketing content generation
- Email campaign optimization
- Automated outreach personalization

### Communication Features

**Appointment Scheduling**: Service businesses can schedule appointments with Zoom integration support. The `Appointment` model tracks scheduling, reminders, and video meeting URLs.

**Email System**: Transactional email service (`backend/utils/emailService.js`) for:
- Order notifications and tracking updates
- Appointment reminders
- Digital product delivery
- Team invitations
- Verification emails

**Video Calls**: Agora RTC SDK integration for HD video calls within the platform, with minute tracking for billing purposes.

### Team Collaboration

**Role-Based Access**: Team accounts support multiple members with configurable permissions (read, write, delete, manage_team, manage_settings). The `Team` model manages membership with invitation workflows.

**Invitation System**: Email-based invitations with unique tokens, expiration tracking, and automatic user creation on acceptance.

### Dropshipping & Digital Products

**Supplier Integration**: Connectors for AliExpress, Oberlo, Spocket with automated order fulfillment. The `supplier_orders` table tracks auto-order processing and shipment syncing.

**Digital Products**: Complete delivery system with license key generation, time-limited download links, download tracking, and piracy prevention alerts. Files stored in Supabase storage with signed URL generation.

### Analytics & Monitoring

**Business Analytics**: Time-series metrics tracked in the `Analytics` model including page views, revenue, conversion rates, and customer acquisition.

**Logging**: Structured logging for payment operations (`yopayLogger`), error tracking, and audit trails for sensitive operations.

## External Dependencies

### Payment & Financial Services

- **Flutterwave**: Payment processing infrastructure powering the Yopay gateway. Requires API keys and webhook secret for production.

### Cloud Services

- **Cloudinary**: Media asset management and CDN. Requires cloud name, API key, and API secret for file uploads and transformations.

### Communication Services

- **Resend API**: Transactional email delivery for notifications and campaigns. API key required for email functionality.
- **Agora**: Real-time video/audio calling infrastructure. Requires app ID and credentials for HD call features.
- **Zoom API** (Optional): Video meeting integration for service appointments. OAuth credentials needed for meeting creation.

### AI Services

- **OpenAI API**: Powers chatbot conversations, content generation, and marketing automation. API key required for AI features.

### Development Tools

- **Drizzle ORM**: Database toolkit for PostgreSQL with type-safe queries and migrations
- **Vite**: Frontend build tool and dev server
- **React Query**: Server state management and caching
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework

### Authentication

- **Google OAuth 2.0** (Optional): Social login integration via Passport.js. Requires client ID and client secret.

### Database

- **PostgreSQL**: Primary database (via Drizzle schema definitions)
- **MongoDB**: Currently implemented backend database (via Mongoose models)

### Monitoring & DevOps

- **Docker**: Containerization for production deployment with multi-container architecture (frontend, backend, database, cache, proxy)
- **Nginx**: Reverse proxy with SSL termination and wildcard subdomain support
- **Let's Encrypt**: Automated SSL certificate provisioning for custom domains