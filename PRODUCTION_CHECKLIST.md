# Kreateyo Production Deployment Checklist

Use this checklist to ensure a smooth production deployment.

## Pre-Deployment

### Server Setup
- [ ] Linux server provisioned (Ubuntu 20.04+ recommended)
- [ ] Minimum 4GB RAM, 2 CPU cores
- [ ] 50GB+ disk space available
- [ ] Docker installed (version 20.10+)
- [ ] Docker Compose installed (version 2.0+)
- [ ] UFW firewall configured
- [ ] Server timezone set correctly

### Domain & DNS
- [ ] Domain registered (e.g., kreateyo.com)
- [ ] Access to DNS management
- [ ] A record created: `@ -> SERVER_IP`
- [ ] A record created: `* -> SERVER_IP` (wildcard)
- [ ] A record created: `api -> SERVER_IP`
- [ ] CNAME record created: `www -> kreateyo.com`
- [ ] DNS propagation verified (use nslookup)
- [ ] TTL set appropriately (3600 recommended)

### SSL Certificates
- [ ] Let's Encrypt certbot installed
- [ ] Wildcard certificate generated
- [ ] Certificate files copied to `./ssl/` directory
- [ ] Certificate files have correct permissions
- [ ] Auto-renewal configured
- [ ] Certificate expiry date noted (90 days)

### Environment Configuration
- [ ] `.env.production` file created
- [ ] Strong MongoDB password generated
- [ ] Strong JWT secrets generated (2 different ones)
- [ ] Server IP address configured
- [ ] Cloudinary credentials added
- [ ] OpenAI API key added (if using AI features)
- [ ] Email SMTP credentials configured
- [ ] All required secrets added
- [ ] No sensitive data committed to git

### External Services
- [ ] Cloudinary account created
- [ ] Cloudinary API keys obtained
- [ ] OpenAI API account setup (optional)
- [ ] OpenAI API key obtained (optional)
- [ ] Email service configured (SMTP)
- [ ] Zoom API credentials (optional for services)
- [ ] Stripe account setup (optional for payments)

## Deployment

### Build & Deploy
- [ ] Code repository cloned to server
- [ ] Dependencies installed
- [ ] Docker images built successfully
- [ ] Containers started without errors
- [ ] All 4 services running (frontend, backend, mongodb, redis)
- [ ] Health checks passing

### Service Verification
- [ ] Frontend accessible: `http://localhost:3000`
- [ ] Backend health: `http://localhost:5000/health`
- [ ] MongoDB connection successful
- [ ] Redis connection successful
- [ ] Nginx proxy working
- [ ] SSL certificates loaded

### Functionality Testing
- [ ] Main domain loads: `https://kreateyo.com`
- [ ] API responds: `https://api.kreateyo.com/health`
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard accessible after login
- [ ] Can create new business
- [ ] Business subdomain works: `https://test.kreateyo.com`
- [ ] Site builder functional
- [ ] File uploads working (Cloudinary)
- [ ] Email sending works
- [ ] AI features working (if enabled)

### Security Verification
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] SSL certificate valid
- [ ] Wildcard SSL working for subdomains
- [ ] Firewall rules active
- [ ] Only ports 22, 80, 443 open
- [ ] Rate limiting functional
- [ ] CORS configured correctly
- [ ] Security headers present
- [ ] JWT tokens working
- [ ] Password hashing verified

## Post-Deployment

### Monitoring Setup
- [ ] Log aggregation configured
- [ ] Error tracking setup (Sentry optional)
- [ ] Uptime monitoring configured
- [ ] Resource usage monitoring
- [ ] Disk space alerts
- [ ] SSL expiry alerts
- [ ] Database backup alerts

### Backup Configuration
- [ ] Automated database backups scheduled
- [ ] Backup retention policy defined
- [ ] Backup restoration tested
- [ ] File storage backups configured
- [ ] Configuration files backed up
- [ ] Backup location secure

### Performance
- [ ] Page load times acceptable (<3s)
- [ ] API response times good (<500ms)
- [ ] Database queries optimized
- [ ] Redis caching working
- [ ] Static assets cached properly
- [ ] Gzip compression enabled
- [ ] CDN configured (optional)

### Documentation
- [ ] Server access documented
- [ ] Credentials stored securely
- [ ] Deployment process documented
- [ ] Backup/restore procedures documented
- [ ] Troubleshooting guide created
- [ ] Team access configured
- [ ] On-call procedures defined

### Business Continuity
- [ ] Disaster recovery plan documented
- [ ] Backup restoration tested
- [ ] Failover procedures defined
- [ ] Contact list for emergencies
- [ ] SLA defined (if applicable)
- [ ] Maintenance windows scheduled

## Ongoing Maintenance

### Daily
- [ ] Check service status
- [ ] Review error logs
- [ ] Monitor disk space
- [ ] Verify backups completed

### Weekly
- [ ] Review performance metrics
- [ ] Check for security updates
- [ ] Review user feedback
- [ ] Test critical paths

### Monthly
- [ ] Update dependencies
- [ ] Review and rotate logs
- [ ] SSL certificate check
- [ ] Performance optimization review
- [ ] Security audit
- [ ] Backup restoration test

### Quarterly
- [ ] Disaster recovery drill
- [ ] Documentation review
- [ ] Capacity planning
- [ ] Technology stack review

## Emergency Contacts

```
Server Provider: _______________
Domain Registrar: _______________
SSL Provider: _______________
Database Admin: _______________
DevOps Lead: _______________
Emergency Hotline: _______________
```

## Deployment Sign-Off

```
Deployed By: _______________
Date: _______________
Time: _______________
Version: _______________

Verified By: _______________
Date: _______________

Issues Found: _______________
_______________
_______________

Status: [ ] Production Ready  [ ] Issues to Resolve
```

## Rollback Plan

If deployment fails:

1. **Immediate Actions**
   ```bash
   # Stop services
   docker-compose -f docker-compose.production.yml down
   
   # Restore previous version
   git checkout <previous-commit>
   
   # Rebuild and restart
   ./deploy.sh
   ```

2. **Restore Database**
   ```bash
   # Restore from backup
   docker-compose exec mongodb mongorestore /backups/backup-YYYYMMDD
   ```

3. **Verify Rollback**
   - Check all services running
   - Test critical functionality
   - Monitor error logs

4. **Communication**
   - Notify team of rollback
   - Document issues encountered
   - Schedule post-mortem

## Success Criteria

Deployment is successful when:

- ✅ All services running without errors
- ✅ Main domain and subdomains accessible
- ✅ User registration and login working
- ✅ Business creation functional
- ✅ SSL certificates valid
- ✅ No critical errors in logs
- ✅ Backups configured and tested
- ✅ Performance metrics acceptable
- ✅ Security scan passed

---

**Date Completed**: _______________
**Deployed Version**: _______________
**Next Review**: _______________
