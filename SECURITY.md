# Security Guidelines for ThePopbot

## ⚠️ CRITICAL: Never Commit Secrets

This repository follows strict security practices to protect sensitive information.

## Protected Information

The following are **NEVER** committed to git:

### Environment Variables
- `.env` - Contains all API keys and secrets
- `.env.local` - Local environment overrides
- Any file with credentials or tokens

### API Keys & Tokens
- OpenRouter API keys
- Anthropic API keys
- OpenAI API keys
- GitHub Personal Access Tokens
- Telegram bot tokens
- ngrok authtokens
- Webhook secrets

### Configuration Files
- Private keys (`.pem`, `.key` files)
- Database files with sensitive data
- Installation reports with credentials

## What IS Safe to Commit

✅ Configuration templates (`.env.example`)
✅ Documentation without credentials
✅ Code and application logic
✅ Docker configurations
✅ GitHub Actions workflows (using secrets)
✅ Public configuration files

## .gitignore Protection

The `.gitignore` file protects:
```
.env
.env.local
*.pem
*.key
data/
*_INSTALLATION_*.md
*_SETUP_*.md
```

## GitHub Secrets

Sensitive values are stored as GitHub repository secrets:
- `GH_WEBHOOK_SECRET`
- `AGENT_GH_TOKEN`
- `AGENT_CUSTOM_API_KEY`
- `AGENT_ANTHROPIC_API_KEY` (if used)
- `AGENT_OPENAI_API_KEY` (if used)

## Best Practices

### Before Committing
1. ✅ Run `git status` to review changes
2. ✅ Check that `.env` is NOT in the list
3. ✅ Verify no API keys in code
4. ✅ Review diff: `git diff`
5. ✅ Ensure `.gitignore` is up to date

### If Secrets Are Exposed
1. 🚨 **IMMEDIATELY** remove from git history
2. 🔄 **ROTATE** all exposed credentials
3. 🔒 Update `.gitignore` to prevent recurrence
4. 📝 Document the incident

### Rotating Credentials

If credentials are exposed:

**OpenRouter API Key**:
- Generate new key at https://openrouter.ai/keys
- Update in `.env`
- Update GitHub secret: `gh secret set AGENT_CUSTOM_API_KEY`

**Telegram Bot Token**:
- Revoke old token via @BotFather
- Create new bot or regenerate token
- Update in `.env`

**GitHub PAT**:
- Revoke at https://github.com/settings/tokens
- Create new token with required scopes
- Update in `.env` and GitHub secrets

**ngrok Authtoken**:
- Regenerate at https://dashboard.ngrok.com/get-started/your-authtoken
- Run: `ngrok config add-authtoken NEW_TOKEN`

## Verification Checklist

Before pushing to GitHub:

- [ ] No API keys in code
- [ ] No tokens in documentation
- [ ] `.env` is gitignored
- [ ] No hardcoded credentials
- [ ] Secrets use environment variables
- [ ] Installation docs are gitignored
- [ ] Reviewed `git diff` output
- [ ] Checked `git status` for sensitive files

## Emergency Response

If you accidentally commit secrets:

```bash
# Remove file from git but keep locally
git rm --cached FILENAME

# Add to .gitignore
echo "FILENAME" >> .gitignore

# Commit the removal
git add .gitignore
git commit -m "Remove sensitive file and update .gitignore"

# Force push (if already pushed to GitHub)
git push --force

# ROTATE ALL EXPOSED CREDENTIALS IMMEDIATELY
```

## Documentation Guidelines

When creating documentation:
- ❌ Never include actual API keys
- ❌ Never include actual tokens
- ❌ Never include actual passwords
- ✅ Use placeholders: `YOUR_API_KEY_HERE`
- ✅ Use examples: `sk-...` or `ghp_...`
- ✅ Reference environment variables

## Monitoring

Regularly check:
- GitHub repository for exposed secrets
- `.gitignore` is comprehensive
- All team members follow guidelines
- Automated secret scanning (if available)

## Questions?

If unsure whether something is safe to commit:
1. Assume it's sensitive
2. Add to `.gitignore`
3. Use environment variables
4. Ask for review

---

**Remember**: It's better to be overly cautious than to expose credentials!
