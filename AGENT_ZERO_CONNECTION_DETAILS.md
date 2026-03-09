# agent-zero → ThePopbot Connection Details

## ✅ Ready to Connect

All credentials and endpoints are configured. Use these details to connect agent-zero to ThePopbot.

---

## Connection Information

### Base URL
```
https://06da-2a02-4780-12-5830-00-1.ngrok-free.app
```

### API Key
```
tpb_c38809c017822c1ff4458b79607d6b9cebc8480d93c98f09cfea8146ec18cf66
```

### Primary Endpoint
```
POST /api/create-job
```

---

## Quick Start for agent-zero

### Test Connection (Health Check)
```bash
curl https://06da-2a02-4780-12-5830-00-1.ngrok-free.app/api/ping
```

Expected response:
```json
{"message":"Pong!"}
```

### Create Your First Job
```bash
curl -X POST https://06da-2a02-4780-12-5830-00-1.ngrok-free.app/api/create-job \
  -H "Content-Type: application/json" \
  -H "x-api-key: tpb_c38809c017822c1ff4458b79607d6b9cebc8480d93c98f09cfea8146ec18cf66" \
  -d '{
    "type": "agent",
    "job": "Create a simple Python script that prints Hello World"
  }'
```

Expected response:
```json
{
  "success": true,
  "jobId": "uuid-here",
  "branch": "job/uuid-here",
  "message": "Job created successfully"
}
```

---

## Python Integration Code

### Simple Example
```python
import requests

# Configuration
BASE_URL = "https://06da-2a02-4780-12-5830-00-1.ngrok-free.app"
API_KEY = "tpb_c38809c017822c1ff4458b79607d6b9cebc8480d93c98f09cfea8146ec18cf66"

# Headers
headers = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY
}

# Create a job
def create_task(task_description):
    url = f"{BASE_URL}/api/create-job"
    payload = {
        "type": "agent",
        "job": task_description
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

# Example usage
if __name__ == "__main__":
    result = create_task("Create a Python script that analyzes CSV files")
    print(result)
```

### Complete Client Class
```python
import requests
import time

class ThePoPbotClient:
    def __init__(self):
        self.base_url = "https://06da-2a02-4780-12-5830-00-1.ngrok-free.app"
        self.api_key = "tpb_c38809c017822c1ff4458b79607d6b9cebc8480d93c98f09cfea8146ec18cf66"
        self.headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key
        }
    
    def ping(self):
        """Test connection"""
        url = f"{self.base_url}/api/ping"
        response = requests.get(url)
        return response.json()
    
    def create_job(self, task):
        """Create a new job"""
        url = f"{self.base_url}/api/create-job"
        payload = {"type": "agent", "job": task}
        response = requests.post(url, json=payload, headers=self.headers)
        return response.json() if response.status_code == 200 else None
    
    def get_status(self, job_id):
        """Check job status"""
        url = f"{self.base_url}/api/jobs/status?jobId={job_id}"
        response = requests.get(url, headers=self.headers)
        return response.json() if response.status_code == 200 else None
    
    def wait_for_completion(self, job_id, poll_interval=30):
        """Wait for job to complete"""
        while True:
            status = self.get_status(job_id)
            if status and status.get('status') in ['completed', 'failed']:
                return status
            time.sleep(poll_interval)

# Usage
client = ThePoPbotClient()

# Test connection
print(client.ping())

# Create job
job = client.create_job("Create a REST API with Express.js")
if job:
    print(f"Job created: {job['jobId']}")
    
    # Wait for completion
    result = client.wait_for_completion(job['jobId'])
    print(f"Job {result['status']}: {result.get('pr')}")
```

---

## JavaScript/Node.js Integration

```javascript
const axios = require('axios');

const BASE_URL = 'https://06da-2a02-4780-12-5830-00-1.ngrok-free.app';
const API_KEY = 'tpb_c38809c017822c1ff4458b79607d6b9cebc8480d93c98f09cfea8146ec18cf66';

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY
};

// Create a job
async function createTask(taskDescription) {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/create-job`,
      {
        type: 'agent',
        job: taskDescription
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

// Check status
async function getStatus(jobId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/jobs/status?jobId=${jobId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

// Example usage
(async () => {
  const job = await createTask('Create a Python web scraper');
  if (job) {
    console.log('Job created:', job.jobId);
  }
})();
```

---

## What agent-zero Can Ask ThePopbot to Do

### Code Development
- "Create a REST API with authentication using Express.js"
- "Build a Python script that processes JSON files"
- "Write unit tests for the user authentication module"
- "Refactor the database code to use async/await"

### Data Processing
- "Analyze the CSV file and generate a summary report"
- "Convert all JSON files to YAML format"
- "Parse log files and extract error patterns"

### Research & Documentation
- "Research best practices for React state management and create a guide"
- "Find and summarize the Stripe API documentation"
- "Compare different OAuth2 implementation approaches"

### Web Automation
- "Search the web for Python async/await tutorials"
- "Download documentation PDFs from a website"
- "Extract product information from a webpage"

### File Operations
- "Organize files by type and create a directory structure"
- "Generate documentation from code comments"
- "Create backup scripts for configuration files"

---

## Example Tasks to Try

### Simple Test
```json
{
  "type": "agent",
  "job": "Create a Python script that prints the current date and time"
}
```

### Practical Task
```json
{
  "type": "agent",
  "job": "Create a Python script that reads a CSV file, calculates statistics (mean, median, mode) for numeric columns, and saves the results to a JSON file"
}
```

### Complex Task
```json
{
  "type": "agent",
  "job": "Build a Node.js Express API with three endpoints: GET /users (list all), GET /users/:id (get one), POST /users (create new). Include input validation and error handling. Save to api.js"
}
```

---

## Important Notes

### URL Changes
The ngrok URL (`https://06da-2a02-4780-12-5830-00-1.ngrok-free.app`) may change if:
- The server restarts
- ngrok tunnel restarts
- Network issues occur

If the URL changes, you'll need to update agent-zero's configuration.

### API Key Security
- **Never commit** this API key to version control
- **Store securely** in environment variables
- **Rotate regularly** by generating a new key

### Job Execution
- Jobs run in **isolated Docker containers**
- Each job gets its own **GitHub branch**
- Results are committed and **PR is created**
- **Auto-merge** happens for allowed paths
- **Notifications** sent when complete

---

## Troubleshooting

### Connection Test
```bash
# Should return {"message":"Pong!"}
curl https://06da-2a02-4780-12-5830-00-1.ngrok-free.app/api/ping
```

### Authentication Test
```bash
curl -X GET https://06da-2a02-4780-12-5830-00-1.ngrok-free.app/api/jobs/status \
  -H "x-api-key: tpb_c38809c017822c1ff4458b79607d6b9cebc8480d93c98f09cfea8146ec18cf66"
```

### Common Errors

**401 Unauthorized**: Check API key is correct
**400 Bad Request**: Verify JSON format and required fields
**500 Server Error**: Check ThePopbot logs or retry

---

## Full Documentation

For complete documentation including:
- Detailed API reference
- Advanced integration patterns
- Error handling strategies
- Best practices
- Security considerations

See: `/root/thepopebot-agent/AGENT_ZERO_INTEGRATION.md`

---

## Summary

**You're ready to connect!** Use the code examples above to integrate agent-zero with ThePopbot. Start with a simple test job to verify everything works, then scale up to more complex tasks.

**Quick Start:**
1. Test connection: `curl .../api/ping`
2. Create test job with the curl command above
3. Use Python/JavaScript client code for production integration

---

**Last Updated**: March 9, 2026  
**Status**: ✅ Active and Ready
