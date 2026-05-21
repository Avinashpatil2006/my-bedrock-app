#!/usr/bin/env python3
"""
MCP Server for AWS Bedrock Knowledge Base

This server allows Claude Code to query an AWS Bedrock Knowledge Base
and retrieve relevant information.
"""

import asyncio
import json
import os
from typing import Any

import boto3
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent


# AWS Configuration - set these via environment variables
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
KNOWLEDGE_BASE_ID = os.getenv("AWS_KNOWLEDGE_BASE_ID", "")
AWS_PROFILE = os.getenv("AWS_PROFILE", "default")


# Initialize AWS Bedrock Agent Runtime client
def get_bedrock_client():
    """Initialize and return AWS Bedrock Agent Runtime client"""
    session = boto3.Session(profile_name=AWS_PROFILE, region_name=AWS_REGION)
    return session.client("bedrock-agent-runtime")


# Create MCP server instance
app = Server("aws-knowledge-base")


@app.list_tools()
async def list_tools() -> list[Tool]:
    """List available tools"""
    return [
        Tool(
            name="query_knowledge_base",
            description="Query the AWS Bedrock Knowledge Base for relevant information. "
            "Use this to search for documentation, code examples, or any information "
            "stored in the knowledge base.",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query or question to ask the knowledge base",
                    },
                    "max_results": {
                        "type": "integer",
                        "description": "Maximum number of results to return (default: 5)",
                        "default": 5,
                    },
                },
                "required": ["query"],
            },
        ),
    ]


@app.call_tool()
async def call_tool(name: str, arguments: Any) -> list[TextContent]:
    """Handle tool calls"""

    if name != "query_knowledge_base":
        raise ValueError(f"Unknown tool: {name}")

    if not KNOWLEDGE_BASE_ID:
        return [
            TextContent(
                type="text",
                text="Error: AWS_KNOWLEDGE_BASE_ID environment variable is not set. "
                "Please configure your knowledge base ID in the MCP server settings.",
            )
        ]

    query = arguments.get("query")
    max_results = arguments.get("max_results", 5)

    try:
        client = get_bedrock_client()

        # Query the knowledge base using retrieve API
        response = client.retrieve(
            knowledgeBaseId=KNOWLEDGE_BASE_ID,
            retrievalQuery={"text": query},
            retrievalConfiguration={
                "vectorSearchConfiguration": {
                    "numberOfResults": max_results
                }
            },
        )

        # Format the results
        results = []
        for idx, result in enumerate(response.get("retrievalResults", []), 1):
            content = result.get("content", {}).get("text", "")
            score = result.get("score", 0)
            location = result.get("location", {})

            # Extract source information
            source_info = ""
            if location.get("type") == "S3":
                s3_location = location.get("s3Location", {})
                source_info = f"Source: s3://{s3_location.get('uri', 'unknown')}"

            results.append(
                f"Result {idx} (relevance: {score:.2f}):\n"
                f"{content}\n"
                f"{source_info}\n"
            )

        if not results:
            return [
                TextContent(
                    type="text",
                    text=f"No results found for query: {query}",
                )
            ]

        return [
            TextContent(
                type="text",
                text=f"Knowledge Base Query: {query}\n\n" + "\n---\n".join(results),
            )
        ]

    except Exception as e:
        return [
            TextContent(
                type="text",
                text=f"Error querying knowledge base: {str(e)}\n\n"
                f"Please check:\n"
                f"- AWS credentials are configured (profile: {AWS_PROFILE})\n"
                f"- Knowledge Base ID is correct: {KNOWLEDGE_BASE_ID}\n"
                f"- You have permissions to access the knowledge base\n"
                f"- Region is correct: {AWS_REGION}",
            )
        ]


async def main():
    """Run the MCP server"""
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options(),
        )


if __name__ == "__main__":
    asyncio.run(main())
