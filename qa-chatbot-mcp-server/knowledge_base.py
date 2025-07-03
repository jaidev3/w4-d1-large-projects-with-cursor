"""
Simplified MCP Knowledge Base
All MCP-related knowledge consolidated in one place for easy access.
"""

# MCP Knowledge Base - Consolidated
MCP_KNOWLEDGE = {
    "what_is_mcp": {
        "question": "What is Model Context Protocol (MCP)?",
        "answer": "Model Context Protocol (MCP) is an open standard for AI assistants to connect to external data sources and tools. It enables AI assistants to access real-time information, perform actions, and integrate with various services through a standardized interface. MCP provides a secure, extensible way for AI models to interact with the external world beyond their training data.",
        "keywords": ["mcp", "model context protocol", "ai assistant", "standard", "protocol"]
    },
    
    "mcp_components": {
        "question": "What are the core components of MCP?",
        "answer": "MCP consists of four main components: 1) Servers - provide data sources and tools, 2) Clients - AI assistants that consume server capabilities, 3) Tools - executable functions that perform actions, 4) Resources - data sources that provide information. Servers expose tools and resources through a standardized interface, while clients discover and use these capabilities.",
        "keywords": ["servers", "clients", "tools", "resources", "components"]
    },
    
    "mcp_vs_rest": {
        "question": "How does MCP differ from REST APIs?",
        "answer": "MCP differs from REST APIs in several key ways: MCP is designed for AI-to-machine communication while REST is for human-to-machine communication. MCP provides a tool-based approach where AI assistants can discover and use available capabilities dynamically, unlike REST APIs that require specific endpoints for each operation. MCP also offers context-aware interactions optimized for AI assistant workflows.",
        "keywords": ["rest", "api", "comparison", "differences", "tools vs endpoints"]
    },
    
    "python_server_example": {
        "question": "How do I create a basic MCP server in Python?",
        "answer": """Here's a basic MCP server template in Python:

```python
import json
from typing import Any, Dict, List

class MCPServer:
    def __init__(self):
        self.tools = {}
        self.resources = {}
    
    def register_tool(self, name: str, handler: callable, schema: Dict):
        self.tools[name] = {
            'handler': handler,
            'schema': schema
        }
    
    def handle_message(self, message: Dict) -> Dict:
        msg_type = message.get('type')
        if msg_type == 'initialize':
            return self.handle_initialize(message)
        elif msg_type == 'tools/call':
            return self.handle_tool_call(message)
        else:
            return {'error': 'Unknown message type'}
    
    def handle_initialize(self, message: Dict) -> Dict:
        return {
            'type': 'initialize',
            'protocolVersion': '2024-11-05',
            'capabilities': {
                'tools': list(self.tools.keys()),
                'resources': list(self.resources.keys())
            }
        }
```""",
        "keywords": ["python", "server", "template", "example", "code"]
    },
    
    "javascript_server_example": {
        "question": "How do I create a basic MCP server in JavaScript?",
        "answer": """Here's a basic MCP server template in JavaScript:

```javascript
class MCPServer {
    constructor() {
        this.tools = new Map();
        this.resources = new Map();
    }
    
    registerTool(name, handler, schema) {
        this.tools.set(name, {
            handler,
            schema
        });
    }
    
    async handleMessage(message) {
        const { type } = message;
        
        switch (type) {
            case 'initialize':
                return this.handleInitialize(message);
            case 'tools/call':
                return await this.handleToolCall(message);
            default:
                return { error: 'Unknown message type' };
        }
    }
    
    handleInitialize(message) {
        return {
            type: 'initialize',
            protocolVersion: '2024-11-05',
            capabilities: {
                tools: Array.from(this.tools.keys()),
                resources: Array.from(this.resources.keys())
            }
        };
    }
}
```""",
        "keywords": ["javascript", "server", "template", "example", "code"]
    },
    
    "tool_example": {
        "question": "How do I create a tool for MCP?",
        "answer": """Here's an example of a file reading tool:

```python
def file_read_tool(params: Dict) -> Dict:
    try:
        file_path = params.get('path')
        if not file_path:
            return {'error': 'File path is required'}
        
        with open(file_path, 'r') as f:
            content = f.read()
        
        return {
            'content': content,
            'size': len(content),
            'path': file_path
        }
    except FileNotFoundError:
        return {'error': f'File not found: {file_path}'}
    except Exception as e:
        return {'error': f'Error reading file: {str(e)}'}

# Tool schema
tool_schema = {
    'name': 'file_read',
    'description': 'Read contents of a file',
    'inputSchema': {
        'type': 'object',
        'properties': {
            'path': {
                'type': 'string',
                'description': 'Path to the file to read'
            }
        },
        'required': ['path']
    }
}
```""",
        "keywords": ["tool", "example", "file", "read", "schema"]
    },
    
    "client_example": {
        "question": "How do I create an MCP client?",
        "answer": """Here's a basic MCP client template:

```python
import json
import asyncio
from typing import Dict, List, Any

class MCPClient:
    def __init__(self, server_url: str):
        self.server_url = server_url
        self.tools = {}
        self.resources = {}
        self.initialized = False
    
    async def initialize(self):
        message = {
            'type': 'initialize',
            'protocolVersion': '2024-11-05',
            'capabilities': {}
        }
        
        response = await self.send_message(message)
        if response.get('type') == 'initialize':
            self.tools = response.get('capabilities', {}).get('tools', {})
            self.resources = response.get('capabilities', {}).get('resources', {})
            self.initialized = True
            return True
        return False
    
    async def call_tool(self, tool_name: str, arguments: Dict) -> Dict:
        if not self.initialized:
            raise Exception('Client not initialized')
        
        message = {
            'type': 'tools/call',
            'name': tool_name,
            'arguments': arguments
        }
        
        return await self.send_message(message)
```""",
        "keywords": ["client", "example", "python", "initialize", "call tool"]
    },
    
    "authentication": {
        "question": "How does authentication work in MCP?",
        "answer": "MCP supports various authentication mechanisms including API keys, OAuth tokens, and certificate-based authentication. Authorization is handled at the server level, with fine-grained control over which tools and resources each client can access. The protocol includes built-in security features like request signing, token validation, and access control lists.",
        "keywords": ["authentication", "authorization", "security", "api keys", "oauth"]
    },
    
    "protocol_specs": {
        "question": "What are the MCP protocol specifications?",
        "answer": "MCP follows a JSON-RPC 2.0 based protocol with specific message formats for initialization, tool calls, resource requests, and error handling. The protocol supports bidirectional communication, streaming responses, and structured error reporting. Key specifications include the initialization handshake, tool invocation patterns, resource access methods, and error handling conventions.",
        "keywords": ["protocol", "json-rpc", "specifications", "message format", "bidirectional"]
    },
    
    "common_errors": {
        "question": "What are common MCP errors and how to fix them?",
        "answer": """Common MCP errors include:

1. **Connection Errors**: Check server URL and network connectivity
2. **Authentication Failures**: Verify API keys and credentials
3. **Tool Not Found**: Ensure tool is registered and name is correct
4. **Invalid Parameters**: Check parameter types and required fields
5. **Permission Denied**: Verify authorization settings
6. **Protocol Version Mismatch**: Ensure client and server use compatible versions

Debug by checking logs, validating message formats, and testing with simple tools first.""",
        "keywords": ["errors", "troubleshooting", "debug", "connection", "authentication"]
    },
    
    "best_practices": {
        "question": "What are MCP best practices?",
        "answer": """MCP best practices include:

1. **Security**: Use proper authentication, validate inputs, implement rate limiting
2. **Error Handling**: Provide clear error messages and graceful degradation
3. **Performance**: Use caching, optimize tool execution, handle timeouts
4. **Documentation**: Document tools and resources clearly
5. **Testing**: Test tools thoroughly, validate schemas, handle edge cases
6. **Monitoring**: Log activities, monitor performance, track usage

Follow these practices to build robust and secure MCP servers.""",
        "keywords": ["best practices", "security", "performance", "documentation", "testing"]
    }
}

def search_knowledge(query: str) -> list:
    """Simple keyword-based search through the knowledge base."""
    query_lower = query.lower()
    results = []
    
    for key, item in MCP_KNOWLEDGE.items():
        # Check if query matches keywords or appears in question/answer
        keywords_match = any(keyword in query_lower for keyword in item["keywords"])
        question_match = query_lower in item["question"].lower()
        answer_match = query_lower in item["answer"].lower()
        
        if keywords_match or question_match or answer_match:
            results.append({
                "id": key,
                "question": item["question"],
                "answer": item["answer"],
                "relevance": 1.0 if keywords_match else 0.5
            })
    
    # Sort by relevance
    results.sort(key=lambda x: x["relevance"], reverse=True)
    return results[:5]  # Return top 5 results

def get_all_topics() -> list:
    """Get all available topics in the knowledge base."""
    return [{"id": key, "question": item["question"]} for key, item in MCP_KNOWLEDGE.items()] 