# Agent-Zero to ThePopbot Integration Guide

This guide provides everything you need to connect your agent-zero instance to ThePopbot and assign tasks programmatically.

---

## Overview

**ThePopbot** is an autonomous AI agent system with a two-layer architecture:
1. **Event Handler** - A Next.js server that receives requests and creates jobs
2. **Docker Agent** - Executes tasks autonomously in isolated containers

**agent-zero** can interact with ThePopbot by sending HTTP requests to create jobs, check status, and receive notifications.

---

## Architecture Flow

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   agent-zero    │ ──1──►  │   ThePopbot     │ ──2──►  │     GitHub      │
│                 │  POST    │  Event Handler  │  push   │  (job branch)   │
│  (task sender)  │  /api    │                 │         │                 │
└─────────────────┘         └─────────────────┘         └────────┬────────┘
                                     ▲                            │
                                     │                            │ 3 (triggers)
                                     │                            ▼
                                     │                   ┌─────────────────┐
                                     │                   │  Docker Agent   │
                                     │                   │  (executes job) │
                                     │                   └────────┬────────┘
                                     │                            │
                                     │                            │ 4 (creates PR)
                                     │                            ▼
                                     │                   ┌─────────────────┐
                                     5 (notification)    │     GitHub      │
                                     └───────────────────│   (PR merged)   │
                                                         └─────────────────┘
```

**Flow:**
1. agent-zero sends task via POST to `/api/create-job`
2. ThePopbot creates a job branch in GitHub
3. GitHub Actions triggers Docker agent container
4. Agent executes task and creates Pull Request
5. Auto-merge completes, notification sent back

---

## Connection Details

### Base URL
```
https://06da-2a02-4780-12-5830-00-1.ngrok-free.app
```

**Note**: This is an ngrok URL that changes when the tunnel restarts. Check with your system administrator for the current URL.

### Authentication

ThePopbot uses API keys for authentication. You need to generate an API key from the web interface.

**API Key Format**: `tpb_` + 64 hexadecimal characters

**How to get an API key:**
1. Visit the web interface: `https://06da-2a02-4780-12-5830-00-1.ngrok-free.app`
2. Login (first visit creates admin account)
3. Go to Settings > Secrets
4. Click "Generate API Key"
5. Copy the key (starts with `tpb_`)

**Authentication Header:**
```
x-api-key: tpb_your_64_character_hex_key_here
```

---

## API Endpoints

### 1. Create Job (Primary Endpoint)

**Endpoint**: `POST /api/create-job`

**Purpose**: Create a new autonomous agent job

**Headers:**
```
Content-Type: application/json
x-api-key: tpb_your_api_key_here
```

**Request Body:**
```json
{
  "type": "agent",
  "job": "Your task description here"
}
```

**Fields:**
- `type`: Must be `"agent"` for autonomous execution
- `job`: Natural language description of the task (passed directly to the LLM)

**Example Request (curl):**
```bash
curl -X POST https://06da-2a02-4780-12-5830-00-1.ngrok-free.app/api/create-job \
  -H "Content-Type: application/json" \
  -H "x-api-key: tpb_your_api_key_here" \
  -d '{
    "type": "agent",
    "job": "Create a Python script that analyzes CSV files and generates a summary report"
  }'
```

**Example Request (Python):**
```python
import requests

url = "https://06da-2a02-4780-12-5830-00-1.ngrok-free.app/api/create-job"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "tpb_your_api_key_here"
}
payload = {
    "type": "agent",
    "job": "Create a Python script that analyzes CSV files and generates a summary report"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

**Example Request (JavaScript/Node.js):**
```javascript
const axios = require('axios');

const url = 'https://06da-2a02-4780-12-5830-00-1.ngrok-free.app/api/create-job';
const headers = {
  'Content-Type': 'application/json',
  'x-api-key': 'tpb_your_api_key_here'
};
const data = {
  type: 'agent',
  job: 'Create a Python script that analyzes CSV files and generates a summary report'
};

axios.post(url, data, { headers })
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

**Success Response:**
```json
{
  "success": true,
  "jobId": "uuid-of-created-job",
  "branch": "job/uuid-of-created-job",
  "message": "Job created successfully"
}
```

**Error Response:**
```json
{
  "error": "Invalid API key"
}
```

---

### 2. Check Job Status

**Endpoint**: `GET /api/jobs/status?jobId=<job-id>`

**Purpose**: Check if a job is running, completed, or failed

**Headers:**
```
x-api-key: tpb_your_api_key_here
```

**Query Parameters:**
- `jobId`: The UUID returned from create-job

**Example Request:**
```bash
curl -X GET "https://06da-2a02-4780-12-5830-00-1.ngrok-free.app/api/jobs/status?jobId=uuid-here" \
  -H "x-api-key: tpb_your_api_key_here"
```

**Response:**
```json
{
  "jobId": "uuid-here",
  "status": "completed",
  "branch": "job/uuid-here",
  "pr": "https://github.com/owner/repo/pull/123"
}
```

**Status Values:**
- `"running"` - Job is currently executing
- `"completed"` - Job finished successfully
- `"failed"` - Job encountered an error

---

### 3. Health Check

**Endpoint**: `GET /api/ping`

**Purpose**: Verify ThePopbot is accessible

**Authentication**: None required

**Example Request:**
```bash
curl https://06da-2a02-4780-12-5830-00-1.ngrok-free.app/api/ping
```

**Response:**
```json
{
  "message": "Pong!"
}
```

---

## Job Types and Capabilities

### Agent Job Type

When you create a job with `"type": "agent"`, ThePopbot:

1. **Creates a dedicated branch** (`job/<uuid>`)
2. **Spins up a Docker container** with full development environment
3. **Runs the Pi coding agent** with your task description
4. **Has access to:**
   - Full filesystem (working directory: `/job`)
   - Git operations (auto-commits results)
   - Web browsing and search
   - API calls and external services
   - File creation, editing, and manipulation
   - Code execution (Python, Node.js, bash, etc.)
   - Custom skills (see Skills section below)

5. **Commits all changes** to the job branch
6. **Opens a Pull Request** with the results
7. **Auto-merges** if changes are in allowed paths
8. **Sends notification** when complete

### What Can agent-zero Ask ThePopbot To Do?

**Code Development:**
- "Create a REST API with authentication using Express.js"
- "Build a Python script that scrapes data from a website"
- "Write unit tests for the authentication module"
- "Refactor the database connection code to use connection pooling"

**Data Processing:**
- "Analyze the CSV file in /data and generate a summary report"
- "Convert all JSON files in /input to YAML format"
- "Parse log files and extract error patterns"

**Research & Analysis:**
- "Research the latest best practices for React state management"
- "Find and summarize documentation for the Stripe API"
- "Compare different approaches to implementing OAuth2"

**File Operations:**
- "Organize files in /downloads by file type"
- "Create a backup of all configuration files"
- "Generate documentation from code comments"

**Web Automation:**
- "Visit the website and extract product pricing"
- "Download all PDFs from the documentation page"
- "Check if the API endpoint is responding correctly"

---

## Available Skills

ThePopbot has access to various skills that extend its capabilities:

### Active Skills
- **Browser Tools** - Web browsing, screenshots, page interaction
- **Brave Search** - Web search capabilities
- **YouTube Transcript** - Extract transcripts from YouTube videos
- **Google Drive** - Access and manipulate Google Drive files
- **Google Docs** - Create and edit Google Docs
- **Modify Self** - Update agent configuration and skills
- **LLM Secrets** - Securely access API keys for external services
- **Kie AI** - Additional AI capabilities

### How Skills Work
Skills are automatically available to the Docker agent. When you describe a task, the agent will use appropriate skills to accomplish it.

**Example:**
```json
{
  "type": "agent",
  "job": "Search the web for the latest Python best practices and create a summary document"
}
```

The agent will automatically use the Brave Search skill to perform web searches.

---

## Integration Patterns

### Pattern 1: Fire and Forget
Send a job and don't wait for completion.

```python
def send_task_to_thepopebot(task_description):
    url = "https://06da-2a02-4780-12-5830-00-1.ngrok-free.app/api/create-job"
    headers = {
        "Content-Type": "application/json",
        "x-api-key": "tpb_your_api_key_here"
    }
    payload = {
        "type": "agent",
        "job": task_description
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        job_data = response.json()
        print(f"Job created: {job_data['jobId']}")
        return job_data['jobId']
    else:
        print(f"Error: {response.text}")
        return None
```

### Pattern 2: Poll for Completion
Send a job and periodically check status.

```python
import time

def send_and_wait_for_job(task_description, poll_interval=30):
    # Create job
    job_id = send_task_to_thepopebot(task_description)
    
    if not job_id:
        return None
    
    # Poll for completion
    url = f"https://06da-2a02-4780-12-5830-00-1.ngrok-free.app/api/jobs/status?jobId={job_id}"
    headers = {"x-api-key": "tpb_your_api_key_here"}
    
    while True:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            status_data = response.json()
            status = status_data.get('status')
            
            if status == 'completed':
                print(f"Job completed! PR: {status_data.get('pr')}")
                return status_data
            elif status == 'failed':
                print("Job failed!")
                return status_data
            else:
                print(f"Job status: {status}")
        
        time.sleep(poll_interval)
```

### Pattern 3: Webhook Notification (Advanced)
Configure ThePopbot to send notifications to agent-zero's webhook endpoint when jobs complete.

**Setup:**
1. Create a webhook endpoint in agent-zero
2. Add trigger in ThePopbot's `config/TRIGGERS.json`:

```json
{
  "name": "notify-agent-zero",
  "event": "job-complete",
  "action": {
    "type": "webhook",
    "url": "https://your-agent-zero-url/webhook/thepopebot",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer your-webhook-secret"
    },
    "body": {
      "jobId": "{{jobId}}",
      "status": "{{status}}",
      "pr": "{{pr}}"
    }
  }
}
```

---

## Configuration

### Current ThePopbot Configuration

**LLM Provider**: OpenRouter (Custom)  
**Model**: moonshotai/kimi-k2.5  
**GitHub Repository**: https://github.com/MaheshBhairi2315/thepopebot  
**Deployment**: Docker containers with ngrok tunnel  

### Environment Variables (for reference)

These are configured in ThePopbot's `.env` file:

```bash
APP_URL=https://06da-2a02-4780-12-5830-00-1.ngrok-free.app
LLM_PROVIDER=custom
LLM_MODEL=moonshotai/kimi-k2.5
OPENAI_BASE_URL=https://openrouter.ai/api/v1
```

---

## Error Handling

### Common Errors

**401 Unauthorized**
```json
{"error": "Invalid API key"}
```
**Solution**: Verify your API key is correct and starts with `tpb_`

**400 Bad Request**
```json
{"error": "Missing required field: job"}
```
**Solution**: Ensure request body includes both `type` and `job` fields

**500 Internal Server Error**
```json
{"error": "Failed to create job"}
```
**Solution**: Check ThePopbot logs or contact administrator

### Retry Logic

Implement exponential backoff for failed requests:

```python
import time

def create_job_with_retry(task, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = requests.post(url, json=payload, headers=headers)
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code >= 500:
                # Server error, retry
                wait_time = 2 ** attempt
                print(f"Retry {attempt + 1}/{max_retries} after {wait_time}s")
                time.sleep(wait_time)
            else:
                # Client error, don't retry
                print(f"Error: {response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            time.sleep(2 ** attempt)
    
    return None
```

---

## Best Practices

### 1. Clear Task Descriptions
Be specific and detailed in your job descriptions:

**Good:**
```json
{
  "type": "agent",
  "job": "Create a Python script that reads data.csv, calculates the average of the 'sales' column, and writes the result to summary.txt"
}
```

**Bad:**
```json
{
  "type": "agent",
  "job": "Process the data"
}
```

### 2. Break Down Complex Tasks
For complex workflows, create multiple smaller jobs:

```python
# Instead of one huge task
tasks = [
    "Download the dataset from the API",
    "Clean the data and remove duplicates",
    "Perform statistical analysis",
    "Generate visualization charts",
    "Create a summary report"
]

for task in tasks:
    send_task_to_thepopebot(task)
```

### 3. Specify Output Format
Tell the agent exactly what you want:

```json
{
  "type": "agent",
  "job": "Research Python async/await best practices and create a markdown document with examples. Include code snippets and explanations."
}
```

### 4. Use Context from Previous Jobs
Reference previous work in new tasks:

```json
{
  "type": "agent",
  "job": "Review the data analysis script created in the previous job and add error handling for missing values"
}
```

---

## Example: Complete Integration

Here's a complete example of agent-zero sending tasks to ThePopbot:

```python
import requests
import time
import json

class ThePoPbotClient:
    def __init__(self, base_url, api_key):
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key
        }
    
    def create_job(self, task_description):
        """Create a new agent job"""
        url = f"{self.base_url}/api/create-job"
        payload = {
            "type": "agent",
            "job": task_description
        }
        
        try:
            response = requests.post(url, json=payload, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error creating job: {e}")
            return None
    
    def get_job_status(self, job_id):
        """Check job status"""
        url = f"{self.base_url}/api/jobs/status?jobId={job_id}"
        
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error checking status: {e}")
            return None
    
    def wait_for_job(self, job_id, poll_interval=30, timeout=3600):
        """Wait for job to complete"""
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            status_data = self.get_job_status(job_id)
            
            if status_data:
                status = status_data.get('status')
                
                if status == 'completed':
                    return status_data
                elif status == 'failed':
                    return status_data
            
            time.sleep(poll_interval)
        
        return {"status": "timeout"}
    
    def ping(self):
        """Health check"""
        url = f"{self.base_url}/api/ping"
        
        try:
            response = requests.get(url)
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error pinging: {e}")
            return None

# Usage
if __name__ == "__main__":
    # Initialize client
    client = ThePoPbotClient(
        base_url="https://06da-2a02-4780-12-5830-00-1.ngrok-free.app",
        api_key="tpb_your_api_key_here"
    )
    
    # Health check
    ping_response = client.ping()
    print(f"Health check: {ping_response}")
    
    # Create a job
    task = "Create a Python script that generates a random password with configurable length and complexity"
    job_data = client.create_job(task)
    
    if job_data:
        job_id = job_data.get('jobId')
        print(f"Job created: {job_id}")
        
        # Wait for completion
        result = client.wait_for_job(job_id)
        print(f"Job result: {json.dumps(result, indent=2)}")
```

---

## Troubleshooting

### Issue: Connection Refused
**Symptom**: Cannot connect to ThePopbot URL

**Solutions:**
1. Verify ngrok tunnel is running
2. Check current URL (it changes on restart)
3. Test with `curl https://06da-2a02-4780-12-5830-00-1.ngrok-free.app/api/ping`

### Issue: Invalid API Key
**Symptom**: 401 Unauthorized error

**Solutions:**
1. Generate new API key from web interface
2. Verify key format starts with `tpb_`
3. Check for extra spaces or newlines in key

### Issue: Job Not Starting
**Symptom**: Job created but never executes

**Solutions:**
1. Check GitHub Actions are enabled
2. Verify GitHub runners are active
3. Check repository secrets are configured
4. Review GitHub Actions logs

### Issue: Job Fails Immediately
**Symptom**: Job status shows "failed"

**Solutions:**
1. Check job logs in GitHub repository under `logs/<job-id>/`
2. Verify task description is clear and achievable
3. Check if required skills are available
4. Review Docker agent logs

---

## Security Considerations

### API Key Management
- **Never commit API keys** to version control
- **Rotate keys regularly** (generate new, delete old)
- **Use environment variables** to store keys
- **Limit key scope** if possible (future feature)

### Network Security
- ThePopbot uses **ngrok tunnel** for public access
- **HTTPS** is enforced for all API calls
- **Webhook secrets** validate incoming notifications
- **API keys** are SHA-256 hashed in database

### Data Privacy
- Job logs are stored in **GitHub repository**
- **Sensitive data** should not be included in job descriptions
- Use **LLM secrets** for API keys needed by jobs
- **Review PRs** before auto-merge if handling sensitive data

---

## Support and Resources

### Documentation
- **ThePopbot GitHub**: https://github.com/stephengpope/thepopebot
- **Your Instance**: https://github.com/MaheshBhairi2315/thepopebot
- **Web Interface**: https://06da-2a02-4780-12-5830-00-1.ngrok-free.app

### Getting Help
1. Check job logs in `logs/<job-id>/` directory
2. Review GitHub Actions workflow runs
3. Check Docker container logs
4. Consult ThePopbot documentation

### Updates
ThePopbot is actively developed. To update:
1. Run upgrade workflow in GitHub Actions
2. Review and merge the upgrade PR
3. Containers will automatically rebuild

---

## Quick Reference

### Essential URLs
```
Base URL:     https://06da-2a02-4780-12-5830-00-1.ngrok-free.app
Create Job:   POST /api/create-job
Job Status:   GET /api/jobs/status?jobId=<id>
Health Check: GET /api/ping
Web UI:       https://06da-2a02-4780-12-5830-00-1.ngrok-free.app
GitHub Repo:  https://github.com/MaheshBhairi2315/thepopebot
```

### Essential Headers
```
Content-Type: application/json
x-api-key: tpb_your_64_character_hex_key
```

### Minimal Job Request
```json
{
  "type": "agent",
  "job": "Your task description"
}
```

---

## Changelog

**Version 1.0** - Initial integration guide
- Basic API documentation
- Authentication setup
- Example code in Python and JavaScript
- Integration patterns
- Troubleshooting guide

---

**Last Updated**: March 9, 2026  
**ThePopbot Version**: 1.2.72  
**Current URL**: https://06da-2a02-4780-12-5830-00-1.ngrok-free.app
