# AWS Bedrock Knowledge Base MCP Server

This MCP server allows Claude Code to query your AWS Bedrock Knowledge Base for relevant information.

## Setup Instructions

### 1. Install Dependencies

First, activate your virtual environment and install the required packages:

```bash
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure AWS Credentials

Make sure you have AWS credentials configured. You can do this by:

- Setting up AWS CLI credentials: `aws configure`
- Or using environment variables
- Or using an AWS profile

### 3. Get Your Knowledge Base ID

Find your AWS Bedrock Knowledge Base ID from the AWS Console:
- Go to Amazon Bedrock → Knowledge bases
- Copy your Knowledge Base ID (it looks like: `ABCDEFGHIJ`)

### 4. Configure the MCP Server

Add the MCP server to your Claude Code configuration. The location depends on how you're running Claude Code:

**For Claude Code CLI:**
- Edit: `~/.claude/settings.json`

**For Claude Code Desktop App:**
- Edit: `~/Library/Application Support/Claude/settings.json` (macOS)

Add the following to your settings.json under the `mcpServers` key:

```json
{
  "mcpServers": {
    "aws-knowledge-base": {
      "command": "python",
      "args": [
        "/Users/avinashpatil/Documents/Python/MyProjects/aws_kb_mcp_server.py"
      ],
      "env": {
        "AWS_REGION": "us-east-1",
        "AWS_KNOWLEDGE_BASE_ID": "YOUR_KNOWLEDGE_BASE_ID_HERE",
        "AWS_PROFILE": "default"
      }
    }
  }
}
```

**Important:** Replace the following values:
- `YOUR_KNOWLEDGE_BASE_ID_HERE` - Your actual Knowledge Base ID
- `us-east-1` - Your AWS region if different
- `default` - Your AWS profile name if different

### 5. Restart Claude Code

After updating the configuration, restart Claude Code to load the MCP server.

### 6. Verify Setup

Run `/mcp` in Claude Code to verify the server is running. You should see `aws-knowledge-base` listed.

## Usage

Once configured, Claude Code can automatically query your knowledge base when relevant. You can also explicitly ask:

- "Query the knowledge base about X"
- "Search the AWS knowledge base for Y"
- "What does our knowledge base say about Z"

## Troubleshooting

### Error: AWS_KNOWLEDGE_BASE_ID not set

Make sure you've replaced `YOUR_KNOWLEDGE_BASE_ID_HERE` with your actual Knowledge Base ID in the configuration.

### Error: AWS credentials

Ensure your AWS credentials are configured:
```bash
aws configure list
aws bedrock-agent-runtime retrieve --knowledge-base-id YOUR_KB_ID --retrieval-query '{"text":"test"}' --region us-east-1
```

### Error: Permission denied

Ensure your AWS credentials have the following permissions:
- `bedrock:Retrieve`
- Access to the specific Knowledge Base

### MCP server not showing up

- Check that the Python path in the configuration is absolute and correct
- Verify the virtual environment has the required packages installed
- Check Claude Code logs for error messages

## Features

- **Query knowledge base**: Search your AWS Bedrock Knowledge Base with natural language queries
- **Source attribution**: Results include relevance scores and S3 source locations
- **Configurable results**: Control the number of results returned per query

## Architecture

This MCP server:
1. Connects to AWS Bedrock Agent Runtime API
2. Uses the `retrieve` API to query your knowledge base
3. Returns formatted results with relevance scores and source information
4. Handles errors gracefully with helpful debugging information
