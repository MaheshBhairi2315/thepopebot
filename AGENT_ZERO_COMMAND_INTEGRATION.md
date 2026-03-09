# agent-zero Command-Based ThePopbot Integration

This guide shows how to implement command-based task delegation from agent-zero to ThePopbot using a `/command` syntax.

---

## Overview

Instead of agent-zero automatically deciding when to use ThePopbot, you'll use a specific command format:

```
/popbot <task description>
```

or

```
/task <task description>
```

When agent-zero sees this command, it will send the task to ThePopbot and return the job ID.

---

## Implementation for agent-zero

### Command Handler Pattern

Here's how to implement the command handler in agent-zero:

```python
import requests
import re

class PopbotCommandHandler:
    def __init__(self):
        self.base_url = "https://06da-2a02-4780-12-5830-00-1.ngrok-free.app"
        self.api_key = "tpb_c38809c017822c1ff4458b79607d6b9cebc8480d93c98f09cfea8146ec18cf66"
        self.headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key
        }
        # Define command patterns
        self.command_patterns = [
            r'^/popbot\s+(.+)$',
            r'^/task\s+(.+)$',
            r'^/thepopebot\s+(.+)$'
        ]
    
    def is_popbot_command(self, message):
        """Check if message is a popbot command"""
        for pattern in self.command_patterns:
            if re.match(pattern, message.strip(), re.IGNORECASE):
                return True
        return False
    
    def extract_task(self, message):
        """Extract task description from command"""
        for pattern in self.command_patterns:
            match = re.match(pattern, message.strip(), re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return None
    
    def send_to_popbot(self, task_description):
        """Send task to ThePopbot"""
        url = f"{self.base_url}/api/create-job"
        payload = {
            "type": "agent",
            "job": task_description
        }
        
        try:
            response = requests.post(url, json=payload, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "job_id": data.get("jobId"),
                    "branch": data.get("branch"),
                    "message": f"✅ Task sent to ThePopbot! Job ID: {data.get('jobId')}"
                }
            else:
                return {
                    "success": False,
                    "error": f"Failed to create job: {response.status_code}",
                    "message": f"❌ Error: {response.text}"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"❌ Connection error: {str(e)}"
            }
    
    def handle_message(self, message):
        """Main handler for incoming messages"""
        if self.is_popbot_command(message):
            task = self.extract_task(message)
            if task:
                result = self.send_to_popbot(task)
                return result
            else:
                return {
                    "success": False,
                    "message": "❌ No task description provided"
                }
        return None  # Not a popbot command

# Initialize handler
popbot_handler = PopbotCommandHandler()

# Example usage in agent-zero's message processing
def process_user_message(user_message):
    # Check if it's a popbot command
    result = popbot_handler.handle_message(user_message)
    
    if result:
        # It was a popbot command
        return result["message"]
    else:
        # Normal agent-zero processing
        return handle_normal_conversation(user_message)
```

---

## Usage Examples

### Basic Command
```
User: /popbot Create a Python script that analyzes CSV files
Agent-zero: ✅ Task sent to ThePopbot! Job ID: abc-123-def-456
```

### Alternative Command
```
User: /task Build a REST API with Express.js and authentication
Agent-zero: ✅ Task sent to ThePopbot! Job ID: xyz-789-uvw-012
```

### Complex Task
```
User: /popbot Research the latest React best practices, create a summary document with code examples, and save it as react-guide.md
Agent-zero: ✅ Task sent to ThePopbot! Job ID: qrs-345-tuv-678
```

### Error Handling
```
User: /popbot
Agent-zero: ❌ No task description provided

User: /popbot    
Agent-zero: ❌ No task description provided
```

---

## Integration with agent-zero's Chat System

### Option 1: Pre-Processing Hook

Add this to agent-zero's message processing pipeline:

```python
def on_user_message(message):
    # Check for popbot command first
    popbot_result = popbot_handler.handle_message(message)
    
    if popbot_result:
        # It's a popbot command, return result immediately
        return {
            "response": popbot_result["message"],
            "type": "command",
            "data": popbot_result
        }
    
    # Not a popbot command, continue with normal processing
    return process_with_agent_zero(message)
```

### Option 2: Tool/Function Integration

If agent-zero uses a tool/function system:

```python
def register_popbot_tool():
    return {
        "name": "send_to_popbot",
        "description": "Send a task to ThePopbot autonomous agent for execution",
        "parameters": {
            "task": {
                "type": "string",
                "description": "The task description to send to ThePopbot"
            }
        },
        "handler": lambda task: popbot_handler.send_to_popbot(task)
    }
```

### Option 3: Command Registry

```python
COMMANDS = {
    "/popbot": {
        "handler": popbot_handler.send_to_popbot,
        "description": "Send task to ThePopbot",
        "usage": "/popbot <task description>",
        "examples": [
            "/popbot Create a Python web scraper",
            "/popbot Build a REST API with authentication"
        ]
    },
    "/task": {
        "handler": popbot_handler.send_to_popbot,
        "description": "Alias for /popbot",
        "usage": "/task <task description>"
    }
}

def process_command(message):
    for cmd, config in COMMANDS.items():
        if message.startswith(cmd):
            task = message[len(cmd):].strip()
            if task:
                return config["handler"](task)
            else:
                return f"Usage: {config['usage']}"
    return None
```

---

## Advanced Features

### 1. Job Status Tracking

Add status checking capability:

```python
class PopbotCommandHandler:
    # ... (previous code)
    
    def check_job_status(self, job_id):
        """Check status of a job"""
        url = f"{self.base_url}/api/jobs/status?jobId={job_id}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                status = data.get("status")
                
                status_emoji = {
                    "running": "⏳",
                    "completed": "✅",
                    "failed": "❌"
                }
                
                return {
                    "success": True,
                    "status": status,
                    "message": f"{status_emoji.get(status, '❓')} Job {job_id}: {status}",
                    "data": data
                }
            else:
                return {
                    "success": False,
                    "message": f"❌ Could not check status: {response.status_code}"
                }
        except Exception as e:
            return {
                "success": False,
                "message": f"❌ Error: {str(e)}"
            }
    
    def handle_message(self, message):
        """Enhanced handler with status checking"""
        # Check for status command
        status_match = re.match(r'^/popbot-status\s+(.+)$', message.strip(), re.IGNORECASE)
        if status_match:
            job_id = status_match.group(1).strip()
            return self.check_job_status(job_id)
        
        # Check for regular popbot command
        if self.is_popbot_command(message):
            task = self.extract_task(message)
            if task:
                return self.send_to_popbot(task)
            else:
                return {
                    "success": False,
                    "message": "❌ No task description provided"
                }
        
        return None
```

Usage:
```
User: /popbot-status abc-123-def-456
Agent-zero: ✅ Job abc-123-def-456: completed
```

### 2. Job History

Track sent jobs:

```python
class PopbotCommandHandler:
    def __init__(self):
        # ... (previous init code)
        self.job_history = []
    
    def send_to_popbot(self, task_description):
        result = # ... (previous send code)
        
        if result.get("success"):
            # Store in history
            self.job_history.append({
                "job_id": result["job_id"],
                "task": task_description,
                "timestamp": time.time(),
                "status": "sent"
            })
        
        return result
    
    def list_recent_jobs(self, limit=5):
        """List recent jobs"""
        recent = self.job_history[-limit:]
        
        if not recent:
            return "No recent jobs"
        
        lines = ["📋 Recent ThePopbot Jobs:"]
        for job in reversed(recent):
            lines.append(f"• {job['job_id']}: {job['task'][:50]}...")
        
        return "\n".join(lines)
```

Usage:
```
User: /popbot-list
Agent-zero: 📋 Recent ThePopbot Jobs:
• abc-123: Create a Python script that analyzes CSV...
• def-456: Build a REST API with Express.js and...
• ghi-789: Research React best practices and create...
```

### 3. Help Command

```python
def show_popbot_help():
    return """
🤖 ThePopbot Commands:

/popbot <task>          - Send task to ThePopbot
/task <task>            - Alias for /popbot
/popbot-status <id>     - Check job status
/popbot-list            - Show recent jobs
/popbot-help            - Show this help

Examples:
  /popbot Create a Python web scraper
  /task Build a REST API with authentication
  /popbot-status abc-123-def-456
  /popbot-list

ThePopbot will execute tasks autonomously in Docker containers
and create GitHub pull requests with the results.
"""
```

---

## Complete Implementation Example

Here's a complete, production-ready implementation:

```python
import requests
import re
import time
import json
from datetime import datetime

class PopbotIntegration:
    def __init__(self):
        self.base_url = "https://06da-2a02-4780-12-5830-00-1.ngrok-free.app"
        self.api_key = "tpb_c38809c017822c1ff4458b79607d6b9cebc8480d93c98f09cfea8146ec18cf66"
        self.headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key
        }
        self.job_history = []
        self.commands = {
            "send": [r'^/popbot\s+(.+)$', r'^/task\s+(.+)$'],
            "status": [r'^/popbot-status\s+(.+)$', r'^/status\s+(.+)$'],
            "list": [r'^/popbot-list$', r'^/jobs$'],
            "help": [r'^/popbot-help$', r'^/popbot\?$']
        }
    
    def process_message(self, message):
        """Main entry point for message processing"""
        message = message.strip()
        
        # Check help
        if self._matches_command(message, "help"):
            return self._show_help()
        
        # Check list
        if self._matches_command(message, "list"):
            return self._list_jobs()
        
        # Check status
        status_match = self._extract_match(message, "status")
        if status_match:
            job_id = status_match.group(1).strip()
            return self._check_status(job_id)
        
        # Check send task
        task_match = self._extract_match(message, "send")
        if task_match:
            task = task_match.group(1).strip()
            return self._send_task(task)
        
        # Not a popbot command
        return None
    
    def _matches_command(self, message, command_type):
        """Check if message matches command type"""
        for pattern in self.commands.get(command_type, []):
            if re.match(pattern, message, re.IGNORECASE):
                return True
        return False
    
    def _extract_match(self, message, command_type):
        """Extract regex match for command type"""
        for pattern in self.commands.get(command_type, []):
            match = re.match(pattern, message, re.IGNORECASE)
            if match:
                return match
        return None
    
    def _send_task(self, task):
        """Send task to ThePopbot"""
        url = f"{self.base_url}/api/create-job"
        payload = {"type": "agent", "job": task}
        
        try:
            response = requests.post(url, json=payload, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                job_id = data.get("jobId")
                
                # Store in history
                self.job_history.append({
                    "job_id": job_id,
                    "task": task,
                    "timestamp": datetime.now().isoformat(),
                    "status": "sent"
                })
                
                return f"✅ Task sent to ThePopbot!\n\n📋 Job ID: `{job_id}`\n📝 Task: {task}\n\nCheck status with: `/popbot-status {job_id}`"
            else:
                return f"❌ Failed to create job: {response.status_code}\n{response.text}"
        
        except requests.exceptions.Timeout:
            return "❌ Request timed out. ThePopbot may be unreachable."
        except requests.exceptions.ConnectionError:
            return "❌ Connection error. Check if ThePopbot is running."
        except Exception as e:
            return f"❌ Error: {str(e)}"
    
    def _check_status(self, job_id):
        """Check job status"""
        url = f"{self.base_url}/api/jobs/status?jobId={job_id}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                status = data.get("status", "unknown")
                
                status_icons = {
                    "running": "⏳",
                    "completed": "✅",
                    "failed": "❌",
                    "unknown": "❓"
                }
                
                icon = status_icons.get(status, "❓")
                message = f"{icon} Job Status: **{status}**\n\n📋 Job ID: `{job_id}`"
                
                if status == "completed" and data.get("pr"):
                    message += f"\n🔗 Pull Request: {data['pr']}"
                
                return message
            else:
                return f"❌ Could not check status: {response.status_code}"
        
        except Exception as e:
            return f"❌ Error checking status: {str(e)}"
    
    def _list_jobs(self, limit=5):
        """List recent jobs"""
        if not self.job_history:
            return "📋 No recent jobs"
        
        recent = self.job_history[-limit:]
        lines = ["📋 Recent ThePopbot Jobs:\n"]
        
        for i, job in enumerate(reversed(recent), 1):
            task_preview = job['task'][:60] + "..." if len(job['task']) > 60 else job['task']
            lines.append(f"{i}. `{job['job_id']}`")
            lines.append(f"   {task_preview}\n")
        
        return "\n".join(lines)
    
    def _show_help(self):
        """Show help message"""
        return """
🤖 **ThePopbot Integration Commands**

**Send Tasks:**
• `/popbot <task>` - Send task to ThePopbot
• `/task <task>` - Alias for /popbot

**Check Status:**
• `/popbot-status <job-id>` - Check job status
• `/status <job-id>` - Alias for status check

**Manage Jobs:**
• `/popbot-list` - Show recent jobs
• `/jobs` - Alias for list

**Help:**
• `/popbot-help` - Show this help
• `/popbot?` - Show this help

**Examples:**
```
/popbot Create a Python script that analyzes CSV files
/task Build a REST API with Express.js
/popbot-status abc-123-def-456
/popbot-list
```

**What ThePopbot Can Do:**
• Write code (Python, JavaScript, etc.)
• Process files and data
• Research and documentation
• Web scraping and automation
• API development
• And much more!

Tasks run in isolated Docker containers and results
are committed to GitHub as pull requests.
"""

# Initialize the integration
popbot = PopbotIntegration()

# Use in agent-zero's message handler
def handle_user_message(message):
    # Try popbot commands first
    result = popbot.process_message(message)
    
    if result:
        return result
    
    # Not a popbot command, handle normally
    return agent_zero_normal_processing(message)
```

---

## Configuration for agent-zero

Add this to agent-zero's configuration:

```python
# config.py or similar
POPBOT_CONFIG = {
    "enabled": True,
    "base_url": "https://06da-2a02-4780-12-5830-00-1.ngrok-free.app",
    "api_key": "tpb_c38809c017822c1ff4458b79607d6b9cebc8480d93c98f09cfea8146ec18cf66",
    "commands": {
        "primary": ["/popbot", "/task"],
        "status": ["/popbot-status", "/status"],
        "list": ["/popbot-list", "/jobs"],
        "help": ["/popbot-help", "/popbot?"]
    },
    "auto_check_status": False,  # Set to True to auto-check after sending
    "timeout": 10  # Request timeout in seconds
}
```

---

## Testing

Test the integration with these commands:

```bash
# Test 1: Simple task
/popbot Create a hello world Python script

# Test 2: Complex task
/popbot Build a REST API with Express.js that has three endpoints: GET /users, POST /users, and DELETE /users/:id. Include error handling and input validation.

# Test 3: Check status
/popbot-status <job-id-from-test-1>

# Test 4: List jobs
/popbot-list

# Test 5: Help
/popbot-help
```

---

## Summary

With this implementation:

1. **User types**: `/popbot Create a Python script...`
2. **agent-zero detects** the command pattern
3. **Sends to ThePopbot** via API
4. **Returns job ID** to user
5. **User can check status** with `/popbot-status <id>`

This keeps agent-zero and ThePopbot separate but integrated through explicit commands!

---

**Last Updated**: March 9, 2026  
**Status**: Ready for Integration
