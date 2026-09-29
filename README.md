# 3-Tier Azure Web Application Architecture

A secure multi-tier web application deployed on Microsoft Azure using Zero-Trust architecture.

## Architecture Highlights
- **Web Tier (Nginx):** Reverse proxy handling inbound requests.
- **Application Tier (Node.js & Express):** Backend app listening on `0.0.0.0:3000` with PM2.
- **Database Tier (MySQL 8.0):** Isolated database accessible only from the App subnet.
- **Security & Secrets:** Integrated with Azure Key Vault using Managed Identity.
