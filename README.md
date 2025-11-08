# Kreateyo - All-in-One Business Platform

Build, manage, and grow your business with Kreateyo - the adaptive platform for e-commerce, services, and blogging.

## 🌟 Features

- **Multi-Business Support**: E-commerce, Services, and Blogging platforms
- **Visual Site Builder**: Professional templates and AI-powered building
- **Wildcard Subdomains**: Each business gets `{name}.kreateyo.com`
- **AI Chatbot**: Automated customer support
- **Email Campaigns**: Built-in marketing tools
- **Analytics**: Comprehensive business insights
- **Team Collaboration**: Multi-user support
- **Mobile Responsive**: Works perfectly on all devices

## Project info

**Lovable URL**: https://lovable.dev/projects/29cc4f0b-a576-497e-89d1-2ae0cfb36f47

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/29cc4f0b-a576-497e-89d1-2ae0cfb36f47) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>
cd kreateyo

# Step 2: Install frontend dependencies
npm i

# Step 3: Install backend dependencies
cd backend
npm i
cd ..

# Step 4: Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Step 5: Start development servers
npm run dev  # Frontend (port 8080)
cd backend && npm run dev  # Backend (port 5000)
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

### Frontend
- Vite
- TypeScript
- React 18
- Shadcn-ui components
- Tailwind CSS
- TanStack Query
- React Router

### Backend (for self-hosted deployment)
- Node.js + Express
- MongoDB
- Redis
- Socket.io
- JWT Authentication
- Docker & Docker Compose

## How can I deploy this project?

### Option 1: Deploy via Lovable (Easiest)
Simply open [Lovable](https://lovable.dev/projects/29cc4f0b-a576-497e-89d1-2ae0cfb36f47) and click on Share -> Publish.

### Option 2: Self-Hosted Deployment
For wildcard subdomain support and full backend control:

```bash
# 1. Configure production environment
cp .env.production.example .env.production
# Edit .env.production with your settings

# 2. Deploy with Docker
chmod +x deploy.sh
./deploy.sh
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete self-hosted deployment instructions including:
- Server setup
- DNS configuration
- SSL certificates
- Wildcard subdomain routing
- Database backups

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 🚀 Production Features

### Subdomain System
Each business automatically gets:
- Main platform: `kreateyo.com`
- API endpoint: `api.kreateyo.com`
- Business sites: `{businessname}.kreateyo.com`

### Architecture
- Frontend: React SPA with Vite
- Backend: Express.js REST API
- Database: MongoDB with Redis caching
- Proxy: Nginx with SSL termination
- Containerization: Docker Compose

### Security
- JWT authentication
- HTTPS/SSL encryption
- Rate limiting
- CORS protection
- XSS prevention
- Input validation

## 📊 API Routes

```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
GET    /api/businesses             # List businesses
POST   /api/businesses             # Create business
GET    /api/businesses/:id/products
POST   /api/businesses/:id/services
GET    /api/businesses/:id/blog-posts
```

## 🤝 Support

For deployment help or questions:
- 📧 Check DEPLOYMENT.md
- 🐛 Open an issue on GitHub
- 📖 Read the docs at docs.lovable.dev

---

**Kreateyo** - Create. Grow. Succeed. 🚀
