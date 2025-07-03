# MCP Q&A Chatbot

A simple, intelligent Q&A chatbot specialized in Model Context Protocol (MCP) to help developers understand MCP concepts, implementation patterns, and best practices.

## ✨ Features

- **🤖 Smart Q&A**: Get accurate answers about MCP concepts and implementation
- **📚 Knowledge Search**: Search through comprehensive MCP documentation
- **💬 Interactive Chat**: Modern web interface with conversation history
- **🔍 Topic Browser**: Browse all available MCP topics
- **⚡ Fast & Simple**: Streamlined implementation without complex dependencies

## 🚀 Quick Start

### 0. Install uv (if not already installed)

`uv` is a fast Python package manager that provides faster dependency resolution and installation compared to pip.

```bash
# On Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# On macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 1. Install Dependencies

```bash
# Install using uv (recommended - uses uv.lock for reproducible builds)
uv sync

# Or install manually with uv
uv add fastapi uvicorn streamlit openai python-dotenv requests
```

### 2. Set Up Environment

```bash
# Copy environment template
cp env.example .env

# Edit .env and add your OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run the Application

**Start the API server:**
```bash
uv run python main.py api
```

**Start the frontend (in another terminal):**
```bash
uv run python main.py frontend
```

### 4. Use the Chatbot

- Open your browser to `http://localhost:8501`
- Ask questions about MCP!
- Try example questions like:
  - "What is Model Context Protocol?"
  - "How do I create an MCP server in Python?"
  - "What are the core components of MCP?"

## 🛠️ Architecture

This simplified implementation consists of:

- **`knowledge_base.py`**: Consolidated MCP knowledge with simple search
- **`app.py`**: FastAPI backend with chat and knowledge endpoints
- **`streamlit_app.py`**: Modern web interface
- **`main.py`**: Simple CLI to run components

## 📚 Knowledge Base

The chatbot includes comprehensive information about:

- **MCP Fundamentals**: Core concepts and specifications
- **Implementation Guides**: Server and client development
- **Code Examples**: Python and JavaScript templates
- **Best Practices**: Security, performance, and testing
- **Troubleshooting**: Common issues and solutions

## 🔧 API Endpoints

- `POST /chat` - Main chat endpoint
- `GET /knowledge/search?query=...` - Search knowledge base
- `GET /knowledge/topics` - List all topics
- `GET /knowledge/{topic_id}` - Get specific topic
- `GET /health` - Health check

## 💡 Example Usage

**Chat with the bot:**
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "What is MCP?"}'
```

**Search knowledge:**
```bash
curl "http://localhost:8000/knowledge/search?query=server"
```

## 🎯 Features

- **No Complex Dependencies**: No vector databases or embeddings
- **Simple Knowledge Base**: Easy-to-maintain Python dictionary
- **Fast Setup**: Get running in minutes with uv
- **Extensible**: Easy to add new knowledge topics
- **Modern UI**: Clean, responsive interface
- **Modern Package Management**: Uses uv for fast dependency resolution

## 🤝 Contributing

1. Fork the repository
2. Install dependencies with `uv sync`
3. Add new knowledge to `knowledge_base.py`
4. Test your changes with `uv run python main.py`
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [OpenAI](https://openai.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Streamlit](https://streamlit.io/)
- [uv](https://docs.astral.sh/uv/) - Ultra-fast Python package manager
