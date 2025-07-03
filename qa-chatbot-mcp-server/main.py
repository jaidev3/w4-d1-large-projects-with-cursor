#!/usr/bin/env python3
"""
Main entry point for the MCP Q&A Chatbot
Simplified implementation with basic functionality.
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("⚠️  python-dotenv not installed. Environment variables from .env file won't be loaded.")
    print("Install with: uv add python-dotenv")

def check_environment():
    """Check if environment is properly configured."""
    required_vars = ["OPENAI_API_KEY"]
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"⚠️  Missing environment variables: {', '.join(missing_vars)}")
        print("Please create a .env file with your OpenAI API key.")
        print("Example:")
        print("OPENAI_API_KEY=your_api_key_here")
        return False
    
    return True

def run_api_server():
    """Run the FastAPI server."""
    print("🚀 Starting MCP Q&A Chatbot API server...")
    print("API will be available at: http://localhost:8000")
    print("API documentation at: http://localhost:8000/docs")
    print("Press Ctrl+C to stop the server")
    
    try:
        import uvicorn
        uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
    except ImportError:
        print("❌ uvicorn not installed. Running with uv run")
        subprocess.run(["uv", "run", "python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"])

def run_frontend():
    """Run the Streamlit frontend."""
    print("🌐 Starting MCP Q&A Chatbot frontend...")
    print("Frontend will be available at: http://localhost:8501")
    print("Make sure the API server is running on http://localhost:8000")
    print("Press Ctrl+C to stop the frontend")
    
    try:
        import streamlit.web.cli as stcli
        sys.argv = ["streamlit", "run", "streamlit_app.py"]
        stcli.main()
    except ImportError:
        print("❌ streamlit not installed. Running with uv run")
        subprocess.run(["uv", "run", "python", "-m", "streamlit", "run", "streamlit_app.py"])

def install_dependencies():
    """Install required dependencies."""
    print("📦 Installing dependencies...")
    subprocess.run(["uv", "sync"])

def main():
    """Main function."""
    parser = argparse.ArgumentParser(description="MCP Q&A Chatbot")
    parser.add_argument("command", choices=["api", "frontend", "install"], 
                       help="Command to run")
    parser.add_argument("--check-env", action="store_true", 
                       help="Check environment configuration")
    
    args = parser.parse_args()
    
    print("🤖 MCP Q&A Chatbot")
    print("=" * 40)
    
    if args.check_env or args.command != "install":
        if not check_environment():
            print("\n💡 To set up your environment:")
            print("1. Create a .env file in the project root")
            print("2. Add your OpenAI API key: OPENAI_API_KEY=your_key_here")
            print("3. Run the command again")
            return
    
    if args.command == "install":
        install_dependencies()
    elif args.command == "api":
        run_api_server()
    elif args.command == "frontend":
        run_frontend()

if __name__ == "__main__":
    main()

