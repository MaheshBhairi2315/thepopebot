# ThePopbot - Autonomous AI Agent

This is a ThePopbot installation - an autonomous AI agent system with a two-layer architecture.

## Quick Start

### Access Your Bot

**Local Access**: http://localhost:3000

**Public Access**: Check your `.env` file for the `APP_URL` value

### First Steps

1. Visit the web interface
2. Configure your bot settings
3. Create your first AI job

## Documentation

- Check the official documentation: https://github.com/stephengpope/thepopebot
- Configuration guide: `docs/CONFIGURATION.md`
- Running different models: `docs/RUNNING_DIFFERENT_MODELS.md`

## Management Commands

```bash
# View logs
docker logs thepopebot-event-handler -f

# Restart services
docker compose restart

# Stop services
docker compose down

# Start services
docker compose up -d
```

## Configuration

All configuration is stored in:
- `.env` - Environment variables (never commit this!)
- `config/` - Agent configuration files
- `docker-compose.yml` - Container orchestration

## Security

⚠️ **IMPORTANT**: Never commit sensitive information to git!

- API keys are stored in `.env` (gitignored)
- Secrets are configured in GitHub repository secrets
- Always verify `.gitignore` before committing

## Project Structure

```
/root/thepopebot-agent/
├── .env                    # Environment variables (gitignored)
├── config/                 # Agent configuration
├── docker-compose.yml      # Container setup
├── app/                    # Next.js application
└── skills/                 # Agent skills/tools
```

## Support

For issues and documentation:
- GitHub: https://github.com/stephengpope/thepopebot
- Check container logs for troubleshooting
- Review GitHub Actions for job execution

---

**Version**: thepopebot@1.2.72  
**Installation Date**: March 8, 2026
