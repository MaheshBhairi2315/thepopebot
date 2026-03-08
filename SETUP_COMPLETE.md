# ThePopbot Installation - Setup Complete! 🎉

## Installation Status: ✅ SUCCESSFUL

ThePopbot has been successfully installed and is running in Docker containers!

---

## 🚀 Current Status

### ✅ Completed Steps
- [x] Project initialized with thepopebot@1.2.72
- [x] GitHub repository created: `https://github.com/MaheshBhairi2315/thepopebot`
- [x] Docker containers running successfully
- [x] Next.js application built and running
- [x] OpenRouter configured with KimiK2.5 model
- [x] GitHub secrets and variables configured
- [x] Self-hosted GitHub runners deployed (2 replicas)
- [x] Telegram bot credentials configured

### 🔧 Running Services
```
✓ thepopebot-event-handler  - Running on port 3000
✓ thepopebot-agent-traefik-1 - Reverse proxy
✓ thepopebot-agent-runner-1  - GitHub Actions runner
✓ thepopebot-agent-runner-2  - GitHub Actions runner
```

---

## 🌐 Access Information

### Local Access (Current)
- **Application URL**: http://localhost:3000
- **API Ping Test**: http://localhost:3000/api/ping
- **Status**: ✅ Working

### Test Your Installation
```bash
curl http://localhost:3000/api/ping
# Should return: {"message":"Pong!"}
```

---

## ⚠️ REQUIRED: Complete ngrok Setup

To make ThePopbot accessible externally (for GitHub webhooks and Telegram), you need to set up ngrok:

### Step 1: Get ngrok Authtoken
1. Sign up at https://dashboard.ngrok.com/signup (if you haven't already)
2. Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken

### Step 2: Configure ngrok
```bash
cd /root/thepopebot-agent
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

### Step 3: Start ngrok Tunnel
```bash
ngrok http 3000
```

This will give you a public URL like: `https://abc123.ngrok-free.app`

### Step 4: Update Configuration with ngrok URL
```bash
# Replace YOUR_NGROK_URL with the URL from step 3
export NGROK_URL="https://your-url.ngrok-free.app"

# Update .env file
sed -i "s|APP_URL=.*|APP_URL=$NGROK_URL|" .env
sed -i "s|APP_HOSTNAME=.*|APP_HOSTNAME=$(echo $NGROK_URL | sed 's|https://||' | sed 's|http://||')|" .env

# Update GitHub variable
gh variable set APP_URL --body "$NGROK_URL" --repo MaheshBhairi2315/thepopebot

# Restart containers to pick up new URL
docker restart thepopebot-event-handler
```

### Step 5: Setup Telegram Webhook
```bash
cd /root/thepopebot-agent
npm run setup-telegram
```

---

## 📝 Configuration Details

### GitHub Repository
- **URL**: https://github.com/MaheshBhairi2315/thepopebot
- **Owner**: MaheshBhairi2315
- **Repo**: thepopebot

### LLM Configuration
- **Provider**: OpenRouter (custom)
- **Model**: moonshot/kimi-k2.5
- **API Key**: Configured ✓
- **Base URL**: https://openrouter.ai/api/v1

### Telegram Bot
- **Bot Token**: 8709054672:AAEVqiOzphtQLU97dZy8HLJZNoh3ATQ9eak
- **Chat ID**: 1126215002
- **Verification Code**: verify-09d7f5b2e73d
- **Status**: Configured, webhook pending ngrok URL

### GitHub Secrets (Configured)
- ✓ GH_WEBHOOK_SECRET
- ✓ AGENT_GH_TOKEN
- ✓ AGENT_CUSTOM_API_KEY

### GitHub Variables (Configured)
- ✓ LLM_PROVIDER: custom
- ✓ LLM_MODEL: moonshot/kimi-k2.5
- ✓ OPENAI_BASE_URL: https://openrouter.ai/api/v1
- ✓ RUNS_ON: self-hosted
- ⚠️ APP_URL: Needs ngrok URL update

---

## 🎯 Next Steps

### 1. Push Code to GitHub (After ngrok setup)
```bash
cd /root/thepopebot-agent
git add .
git commit -m "Complete thepopebot setup with OpenRouter and Telegram"
git push -u origin main
```

### 2. Access Web Interface
Once ngrok is running, visit your ngrok URL to access the web chat interface.

### 3. Test the Bot
- **Web Chat**: Visit your APP_URL
- **Telegram**: Message your bot with the verification code: `verify-09d7f5b2e73d`
- **API**: Create jobs via POST to `/api/create-job`

### 4. Create Your First Job
Through the web interface or Telegram, you can:
- Chat with the agent
- Create coding tasks
- Schedule cron jobs
- Set up triggers

---

## 📚 Important Files

### Configuration Files
- `.env` - Environment variables (API keys, URLs)
- `config/SOUL.md` - Agent personality
- `config/CRONS.json` - Scheduled jobs
- `config/TRIGGERS.json` - Webhook triggers
- `docker-compose.yml` - Container orchestration

### Data Storage
- `data/thepopebot.sqlite` - Database
- `logs/` - Application logs
- `.next/` - Next.js build output

---

## 🔧 Useful Commands

### Docker Management
```bash
# View logs
docker logs thepopebot-event-handler -f

# Restart containers
docker compose restart

# Stop all containers
docker compose down

# Start all containers
docker compose up -d

# Check container status
docker ps --filter name=thepopebot
```

### Application Management
```bash
# Build inside container
docker exec thepopebot-event-handler npm run build

# Check application health
curl http://localhost:3000/api/ping

# View GitHub runners status
docker logs thepopebot-agent-runner-1
```

### Update Configuration
```bash
# Set GitHub variable
npx thepopebot set-var KEY VALUE

# Set GitHub secret
npx thepopebot set-agent-secret KEY VALUE

# Update ngrok URL (when it changes)
npx thepopebot set-var APP_URL https://new-url.ngrok-free.app
```

---

## 🐛 Troubleshooting

### Container Won't Start
```bash
docker logs thepopebot-event-handler
docker compose down && docker compose up -d
```

### Build Errors
```bash
docker exec thepopebot-event-handler npm install
docker exec thepopebot-event-handler npm run build
docker restart thepopebot-event-handler
```

### Port Already in Use
```bash
# Check what's using the port
netstat -tlnp | grep :3000

# Stop nginx if needed
systemctl stop nginx
```

### ngrok URL Changed
```bash
# Update APP_URL everywhere
npx thepopebot set-var APP_URL https://new-url.ngrok-free.app
sed -i "s|APP_URL=.*|APP_URL=https://new-url.ngrok-free.app|" .env
docker restart thepopebot-event-handler
npm run setup-telegram
```

---

## 📖 Documentation

- **Main Docs**: Check the `/root/thepopebot-agent/` directory
- **GitHub Repo**: https://github.com/stephengpope/thepopebot
- **Configuration Guide**: `docs/CONFIGURATION.md`
- **Running Different Models**: `docs/RUNNING_DIFFERENT_MODELS.md`
- **Deployment Guide**: `docs/DEPLOYMENT.md`

---

## 🎉 You're Almost Done!

Just complete the ngrok setup steps above, and your ThePopbot will be fully operational!

### Quick Start Checklist:
- [ ] Configure ngrok authtoken
- [ ] Start ngrok tunnel on port 3000
- [ ] Update APP_URL with ngrok URL
- [ ] Restart containers
- [ ] Setup Telegram webhook
- [ ] Push code to GitHub
- [ ] Test web interface
- [ ] Test Telegram bot

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review container logs: `docker logs thepopebot-event-handler`
3. Check GitHub Actions for job execution
4. Verify all secrets and variables are set correctly

---

**Installation Date**: March 8, 2026
**Version**: thepopebot@1.2.72
**Location**: /root/thepopebot-agent
