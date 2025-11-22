# Deployment Guide

## Production Architecture

```
┌─────────────┐
│   Clients   │
└──────┬──────┘
       │
┌──────▼──────────┐
│  Load Balancer  │ (Nginx / AWS ALB / GCP LB)
│   + SSL/TLS     │
└──────┬──────────┘
       │
┌──────▼──────────┐
│  API Servers    │ (Multiple instances)
│  (Express.js)   │ - Auto-scaling
└──────┬──────────┘ - Health checks
       │
       ├────────────────────┬──────────────────┐
       │                    │                  │
┌──────▼──────────┐  ┌──────▼──────┐  ┌───────▼────────┐
│   MongoDB       │  │    Redis    │  │  File Storage  │
│   (Primary +    │  │  (Cache +   │  │  (S3/GCS/      │
│   Replicas)     │  │   Rate      │  │   Cloudinary)  │
└─────────────────┘  │   Limiter)  │  └────────────────┘
                     └─────────────┘
```

---

## Prerequisites

- Node.js 18+ (LTS)
- MongoDB 6+
- Redis 7+ (optional but recommended)
- SSL Certificate
- Domain/subdomain setup

---

## Environment Variables

Create `.env` file in backend directory:

```bash
# Server
NODE_ENV=production
PORT=5000
BACKEND_URL=https://api.kreateyo.com
FRONTEND_URL=https://kreateyo.com
MAIN_DOMAIN=kreateyo.com

# Database
MONGODB_URI=mongodb://username:password@host:27017/kreateyo?replicaSet=rs0&authSource=admin

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
JWT_REFRESH_EXPIRE=7d

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@kreateyo.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Flutterwave (YoPay)
FLUTTERWAVE_SECRET_KEY=FLWSECK-your_secret_key
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-your_public_key
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TEST-your_encryption_key

# Redis (optional)
REDIS_URL=redis://username:password@host:6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200

# Monitoring (optional)
SENTRY_DSN=your_sentry_dsn
```

---

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - mongodb
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  mongodb:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secure_password
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  mongo_data:
  redis_data:
```

**Build and run:**
```bash
docker-compose up -d
```

---

## Kubernetes Deployment

### Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kreateyo-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: kreateyo-api
  template:
    metadata:
      labels:
        app: kreateyo-api
    spec:
      containers:
      - name: api
        image: kreateyo/api:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        envFrom:
        - secretRef:
            name: kreateyo-secrets
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: kreateyo-api-service
spec:
  selector:
    app: kreateyo-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
  type: LoadBalancer
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: kreateyo-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: kreateyo-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

**Deploy:**
```bash
kubectl apply -f deployment.yaml
```

---

## Cloud Deployments

### AWS (ECS + Fargate)

1. **Build and push Docker image:**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker build -t kreateyo-api .
docker tag kreateyo-api:latest <account>.dkr.ecr.us-east-1.amazonaws.com/kreateyo-api:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/kreateyo-api:latest
```

2. **Create ECS task definition and service** (use AWS Console or IaC)

3. **Set up Application Load Balancer** with target group

4. **Configure auto-scaling** based on CPU/memory

### Google Cloud (Cloud Run)

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/kreateyo-api
gcloud run deploy kreateyo-api --image gcr.io/PROJECT_ID/kreateyo-api --platform managed --region us-central1 --allow-unauthenticated
```

### Heroku

```bash
heroku create kreateyo-api
heroku addons:create mongolab:sandbox
heroku addons:create heroku-redis:hobby-dev
git push heroku main
```

---

## Nginx Configuration

```nginx
upstream api_backend {
    least_conn;
    server api1.internal:5000;
    server api2.internal:5000;
    server api3.internal:5000;
}

server {
    listen 80;
    server_name api.kreateyo.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.kreateyo.com;

    ssl_certificate /etc/ssl/certs/kreateyo.crt;
    ssl_certificate_key /etc/ssl/private/kreateyo.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=20 nodelay;

    location / {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

---

## Database Setup

### MongoDB Replica Set

```bash
# Initialize replica set
mongosh --eval "rs.initiate({
  _id: 'rs0',
  members: [
    { _id: 0, host: 'mongo1:27017' },
    { _id: 1, host: 'mongo2:27017' },
    { _id: 2, host: 'mongo3:27017' }
  ]
})"

# Create database user
mongosh admin --eval "db.createUser({
  user: 'kreateyo',
  pwd: 'secure_password',
  roles: [{ role: 'readWrite', db: 'kreateyo' }]
})"
```

---

## Monitoring & Alerts

### Health Check Endpoints

- **Liveness**: `GET /health` - Basic health check
- **Readiness**: `GET /api/v1/health` - Detailed health with uptime

### Prometheus Metrics (optional)

Install `prom-client`:
```bash
npm install prom-client
```

Add to `server.js`:
```javascript
const prometheus = require('prom-client');
const register = new prometheus.Registry();
prometheus.collectDefaultMetrics({ register });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

---

## CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy API

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t kreateyo-api .
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push kreateyo-api:latest
      - name: Deploy to production
        run: |
          # Deploy command (kubectl, aws ecs, etc.)
```

---

## Rollback Procedure

### Docker

```bash
# List recent images
docker images kreateyo-api

# Rollback to previous version
docker-compose down
docker tag kreateyo-api:v1.2.3 kreateyo-api:latest
docker-compose up -d
```

### Kubernetes

```bash
# Rollback to previous deployment
kubectl rollout undo deployment/kreateyo-api

# Rollback to specific revision
kubectl rollout undo deployment/kreateyo-api --to-revision=2
```

---

## Security Checklist

- [ ] HTTPS enforced everywhere
- [ ] Secrets stored in vault (AWS Secrets Manager / GCP Secret Manager)
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Helmet security headers enabled
- [ ] MongoDB authentication enabled
- [ ] MongoDB network firewall rules
- [ ] Regular security audits (`npm audit`)
- [ ] Webhook signature verification
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection
- [ ] CSRF tokens for state-changing operations

---

## Performance Optimization

1. **Enable Redis caching** for hot reads
2. **Database indexing** for frequent queries
3. **CDN for static assets** (Cloudinary, S3 + CloudFront)
4. **Connection pooling** for MongoDB
5. **Gzip compression** enabled
6. **Lazy loading** for large payloads

---

## Support & Maintenance

- Monitor error rates in Sentry/CloudWatch
- Set up alerts for high latency (>300ms p95)
- Regular database backups (daily snapshots)
- Security patches (monthly updates)
- Load testing before major releases

---

For issues: devops@kreateyo.com
