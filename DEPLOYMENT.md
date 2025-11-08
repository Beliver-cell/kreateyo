# Kreateyo Production Deployment Guide

Complete guide for deploying Kreateyo to production with wildcard subdomain support.

## 🎯 Overview

Kreateyo is deployed as a multi-container Docker application with:
- **Frontend**: React SPA (Vite)
- **Backend**: Express.js API
- **Database**: MongoDB
- **Cache**: Redis
- **Proxy**: Nginx with SSL

## 📋 Prerequisites

### Server Requirements
- Ubuntu 20.04+ or similar Linux distribution
- Minimum 4GB RAM, 2 CPU cores
- 50GB+ disk space
- Docker 20.10+
- Docker Compose 2.0+

### Domain Requirements
- Registered domain (e.g., kreateyo.com)
- Access to DNS management
- Wildcard SSL certificate

## 🚀 Step-by-Step Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

### 2. Clone Repository

```bash
# Clone your repository
git clone https://github.com/yourusername/kreateyo.git
cd kreateyo
```

### 3. Configure Environment

```bash
# Copy environment template
cp .env.production.example .env.production

# Edit configuration
nano .env.production
```

**Required Configuration:**
```env
SERVER_IP=YOUR_SERVER_PUBLIC_IP
MONGODB_PASSWORD=generate_strong_password
JWT_SECRET=generate_strong_jwt_secret
JWT_CUSTOMER_SECRET=generate_strong_customer_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
OPENAI_API_KEY=your_openai_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4. DNS Configuration

Configure these DNS records with your domain registrar:

```
Type    Host                Value               TTL
----    ----                -----               ---
A       @                   YOUR_SERVER_IP      3600
A       *                   YOUR_SERVER_IP      3600
A       api                 YOUR_SERVER_IP      3600
CNAME   www                 kreateyo.com        3600
```

**Verification:**
```bash
# Check DNS propagation
nslookup kreateyo.com
nslookup test.kreateyo.com
nslookup api.kreateyo.com
```

### 5. SSL Certificate Setup

#### Option A: Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt install certbot

# Generate wildcard certificate
sudo certbot certonly --manual --preferred-challenges=dns \
  -d kreateyo.com -d *.kreateyo.com

# Follow instructions to add DNS TXT record
# Certificates will be in /etc/letsencrypt/live/kreateyo.com/

# Copy certificates
sudo cp /etc/letsencrypt/live/kreateyo.com/fullchain.pem ./ssl/kreateyo.com.crt
sudo cp /etc/letsencrypt/live/kreateyo.com/privkey.pem ./ssl/kreateyo.com.key

# Set correct permissions
sudo chmod 644 ./ssl/kreateyo.com.crt
sudo chmod 600 ./ssl/kreateyo.com.key
```

#### Option B: CloudFlare SSL

If using CloudFlare:
1. Enable "Full (strict)" SSL mode
2. Generate Origin Certificate in CloudFlare dashboard
3. Save certificate and key to `./ssl/` directory

### 6. Deploy Application

```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

The script will:
- Check prerequisites
- Build Docker images
- Start all services
- Run health checks
- Display deployment summary

### 7. Verify Deployment

```bash
# Check service status
docker-compose -f docker-compose.production.yml ps

# Check logs
docker-compose -f docker-compose.production.yml logs -f

# Test endpoints
curl https://kreateyo.com/health
curl https://api.kreateyo.com/health
curl https://test.kreateyo.com/
```

### 8. Create First Admin User

```bash
# Access backend container
docker-compose -f docker-compose.production.yml exec backend sh

# Run admin creation script (if you have one)
# Or register through the UI at https://kreateyo.com/signup
```

## 🔧 Configuration Details

### Subdomain System

User sites are served via wildcard subdomains:
- `mybusiness.kreateyo.com` - User's business site
- `shop.kreateyo.com` - Another user's site
- `blog.kreateyo.com` - Blog site

**Backend Subdomain Handler:**
```javascript
// Automatically extracts subdomain and serves appropriate site
// Located in: backend/middleware/subdomain.js
```

### Business Type Routing

Each business type has its own template:
- **Blogging**: Blog layout with posts and subscribers
- **E-commerce**: Product catalog with cart and checkout
- **Services**: Appointment booking with video calls

## 📊 Monitoring

### View Logs

```bash
# All services
docker-compose -f docker-compose.production.yml logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
```

### Database Backup

```bash
# Manual backup
docker-compose exec mongodb mongodump --out /backups/backup-$(date +%Y%m%d-%H%M%S)

# Automated backup (add to crontab)
0 2 * * * cd /path/to/kreateyo && docker-compose exec -T mongodb mongodump --out /backups/backup-$(date +\%Y\%m\%d)
```

### Restore Database

```bash
docker-compose exec mongodb mongorestore /backups/backup-YYYYMMDD-HHMMSS
```

## 🔒 Security Checklist

- ✅ SSL/TLS certificates installed
- ✅ Strong passwords in .env.production
- ✅ MongoDB authentication enabled
- ✅ Firewall configured (UFW)
- ✅ Rate limiting enabled in Nginx
- ✅ CORS properly configured
- ✅ Security headers set in Nginx
- ✅ Regular backups scheduled

### Firewall Setup

```bash
# Install UFW
sudo apt install ufw

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Verify
sudo ufw status
```

## 🔄 Updates and Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
./deploy.sh
```

### Scale Services

```bash
# Scale backend instances
docker-compose -f docker-compose.production.yml up -d --scale backend=3

# Update nginx load balancing configuration accordingly
```

## 🆘 Troubleshooting

### Service Won't Start

```bash
# Check service logs
docker-compose logs <service-name>

# Restart specific service
docker-compose restart <service-name>

# Full reset
docker-compose down -v
./deploy.sh
```

### Database Connection Issues

```bash
# Verify MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker-compose exec backend node -e "require('./config/database')();"
```

### SSL Certificate Issues

```bash
# Verify certificate files exist
ls -la ssl/

# Check certificate validity
openssl x509 -in ssl/kreateyo.com.crt -text -noout

# Renew Let's Encrypt certificate
sudo certbot renew
```

### Subdomain Not Working

```bash
# Verify DNS records
nslookup yourbusiness.kreateyo.com

# Check Nginx configuration
docker-compose exec nginx nginx -t

# Reload Nginx
docker-compose restart nginx
```

## 📈 Performance Optimization

### Enable Redis Caching

The application includes Redis for session management and caching. Configure in backend:

```javascript
// backend/config/redis.js
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL
});
```

### CDN Setup (Optional)

For better performance, use a CDN:
1. CloudFlare (free tier available)
2. AWS CloudFront
3. Fastly

## 📱 Testing

### Load Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test API endpoint
ab -n 1000 -c 10 https://api.kreateyo.com/health

# Test frontend
ab -n 1000 -c 10 https://kreateyo.com/
```

### Subdomain Testing

```bash
# Create test business via API or UI
# Then test subdomain
curl https://testbusiness.kreateyo.com/
```

## 🎉 Post-Deployment

After successful deployment:

1. **Test all features:**
   - User registration and login
   - Business creation
   - Site building
   - Subdomain access

2. **Set up monitoring:**
   - Install monitoring tools (Prometheus, Grafana)
   - Configure error tracking (Sentry)
   - Set up uptime monitoring

3. **Configure backups:**
   - Automated database backups
   - File storage backups
   - Configuration backups

4. **Documentation:**
   - Document any custom configurations
   - Create runbooks for common tasks
   - Share credentials securely with team

## 📞 Support

For deployment issues:
- Check logs: `docker-compose logs`
- Review configuration: `cat .env.production`
- Test connectivity: `curl` commands
- Verify DNS: `nslookup` commands

## 📝 Maintenance Schedule

**Daily:**
- Monitor logs for errors
- Check disk space
- Verify backups completed

**Weekly:**
- Review performance metrics
- Update dependencies (if needed)
- Check for security updates

**Monthly:**
- Review and rotate logs
- Update SSL certificates
- Performance optimization review

---

**Kreateyo is now production-ready!** 🚀

Main Platform: https://kreateyo.com
API Endpoint: https://api.kreateyo.com
User Sites: https://*.kreateyo.com
