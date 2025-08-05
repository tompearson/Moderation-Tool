# Vercel Domain Setup Guide

This guide explains how to assign custom domains to your Vercel deployments, specifically for the Community Moderation Tool.

## Prerequisites

- Vercel CLI installed (`npm i -g vercel`)
- Vercel account with project access
- Project linked to Vercel

## Step-by-Step Process

### 1. Link Project to Vercel

First, ensure your project is linked to Vercel:

```bash
# Link project to Vercel (creates .vercel directory)
vercel link --yes

# Verify project is linked
vercel project inspect
```

### 2. Deploy to Production

Deploy your latest version to production:

```bash
# Deploy to production
vercel --prod

# Or deploy and promote to production
vercel --prod --promote
```

### 3. Check Current Domains

View existing domains for your project:

```bash
# List all domains
vercel domains ls

# List deployments with URLs
vercel ls
```

### 4. Add Custom Domain

#### Option A: Vercel Subdomain
```bash
# Add a custom Vercel subdomain
vercel domains add your-app-name.vercel.app

# Examples:
vercel domains add moderation-tool.vercel.app
vercel domains add community-moderation.vercel.app
vercel domains add moderation-assistant-app.vercel.app
```

#### Option B: Your Own Domain
```bash
# Add your own domain
vercel domains add yourdomain.com

# Add subdomain
vercel domains add app.yourdomain.com
```

### 5. Remove Domain (if needed)

```bash
# Remove a domain
vercel domains rm domain-name.vercel.app
```

## Common Issues and Solutions

### Issue: Domain Already Assigned
```
Error: Cannot add domain-name.vercel.app since it's already assigned to another project.
```

**Solution:**
- Try a different subdomain name
- Add a unique identifier to your domain name
- Use your own domain instead

### Issue: Domain Not Found
```
Error: Domain not found by "domain-name.vercel.app"
```

**Solution:**
- Check current domains: `vercel domains ls`
- The domain may have been automatically removed
- Add the domain again

### Issue: Project Not Linked
```
Error: Please specify a valid subcommand
```

**Solution:**
```bash
# Link project first
vercel link --yes
```

## Automation Commands

### For CI/CD Pipelines

```bash
# Authenticate with token (for automation)
vercel --token $VERCEL_TOKEN

# Deploy to production
vercel --prod --token $VERCEL_TOKEN

# Add domain (if not exists)
vercel domains add domain-name.vercel.app --token $VERCEL_TOKEN
```

### Environment Variables for Automation

```bash
# Set Vercel token
export VERCEL_TOKEN=your_vercel_token_here

# Deploy with token
vercel --prod --token $VERCEL_TOKEN
```

## Domain Management Commands

### List and Inspect
```bash
# List all domains
vercel domains ls

# List deployments
vercel ls

# Inspect project
vercel project inspect
```

### Add and Remove
```bash
# Add domain
vercel domains add domain-name.vercel.app

# Remove domain
vercel domains rm domain-name.vercel.app
```

### Deploy and Promote
```bash
# Deploy to production
vercel --prod

# Deploy and promote specific deployment
vercel promote deployment-url
```

## Current Project Status

### Project Information
- **Project Name:** moderation-tool
- **Project ID:** prj_sotOyZ4Moe488Tj9e7uohTuHjInh
- **Owner:** Tom Pearson's projects

### Current Domains
- `moderation-assistant-app.vercel.app`
- `moderation-assistant-tool-app.vercel.app`

### Latest Deployment
- **URL:** https://moderation-tool-63nso9dzw-tom-pearsons-projects-76b0a339.vercel.app
- **Status:** Ready
- **Environment:** Production

## Best Practices

### 1. Domain Naming
- Use descriptive, memorable names
- Include project identifier to avoid conflicts
- Consider using your own domain for branding

### 2. Deployment Workflow
```bash
# 1. Make code changes
git add .
git commit -m "Update feature"

# 2. Deploy to production
vercel --prod

# 3. Verify deployment
vercel ls

# 4. Test custom domain
curl https://your-domain.vercel.app
```

### 3. Environment Management
```bash
# Pull environment variables
vercel env pull .env

# Add environment variable
vercel env add VARIABLE_NAME

# Remove environment variable
vercel env rm VARIABLE_NAME
```

## Troubleshooting

### Deployment Issues
```bash
# Check deployment logs
vercel logs deployment-url

# Rollback to previous deployment
vercel rollback deployment-url

# Remove failed deployment
vercel remove deployment-url
```

### Domain Issues
```bash
# Check domain status
vercel domains ls

# Verify DNS settings (for custom domains)
nslookup yourdomain.com

# Test domain accessibility
curl -I https://yourdomain.com
```

## Security Considerations

### API Tokens
- Store Vercel tokens securely
- Use environment variables in CI/CD
- Rotate tokens regularly

### Domain Security
- Enable HTTPS (automatic with Vercel)
- Configure security headers
- Monitor domain for unauthorized changes

## Monitoring and Maintenance

### Regular Tasks
1. **Weekly:** Check deployment status
2. **Monthly:** Review domain configurations
3. **Quarterly:** Update dependencies and security

### Monitoring Commands
```bash
# Check deployment health
vercel ls --limit 10

# Monitor logs
vercel logs --follow

# Check project status
vercel project inspect
```

## Resources

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Domain Management Guide](https://vercel.com/docs/concepts/projects/domains)
- [Deployment Best Practices](https://vercel.com/docs/concepts/deployments)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Last Updated:** August 3, 2025  
**Version:** 1.0  
**Project:** Community Moderation Tool 