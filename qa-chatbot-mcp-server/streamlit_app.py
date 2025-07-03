"""
Simple Streamlit Frontend for MCP Q&A Chatbot
"""

import streamlit as st
import requests
import json
from typing import List, Dict

# Configuration
API_BASE_URL = "http://localhost:8000"

# Page configuration
st.set_page_config(
    page_title="MCP Q&A Chatbot",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
.main-header {
    font-size: 2rem;
    font-weight: bold;
    color: #2E86AB;
    margin-bottom: 1rem;
}
.chat-message {
    padding: 1rem;
    margin: 0.5rem 0;
    border-radius: 10px;
    border-left: 4px solid #2E86AB;
}
.user-message {
    background-color: #E8F4FD;
    border-left-color: #2E86AB;
}
.bot-message {
    background-color: #F0F8FF;
    border-left-color: #00B4D8;
}
.source-box {
    background-color: #F8F9FA;
    padding: 0.5rem;
    margin: 0.5rem 0;
    border-radius: 5px;
    border: 1px solid #DEE2E6;
}
</style>
""", unsafe_allow_html=True)

def call_api(endpoint: str, method: str = "GET", data: dict = None):
    """Call the FastAPI backend."""
    try:
        url = f"{API_BASE_URL}/{endpoint}"
        
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"API Error: {str(e)}")
        return None

def display_message(message: str, is_user: bool = True):
    """Display a chat message."""
    css_class = "user-message" if is_user else "bot-message"
    role = "You" if is_user else "MCP Assistant"
    
    st.markdown(f"""
    <div class="chat-message {css_class}">
        <strong>{role}:</strong><br>
        {message}
    </div>
    """, unsafe_allow_html=True)

def display_sources(sources: List[Dict]):
    """Display knowledge sources."""
    if sources:
        st.markdown("**Sources:**")
        for source in sources:
            st.markdown(f"""
            <div class="source-box">
                <strong>Q:</strong> {source['question']}<br>
                <small>Relevance: {source['relevance']}</small>
            </div>
            """, unsafe_allow_html=True)

def main():
    """Main Streamlit application."""
    
    # Header
    st.markdown('<div class="main-header">🤖 MCP Q&A Chatbot</div>', unsafe_allow_html=True)
    st.markdown("Ask me anything about Model Context Protocol (MCP)!")
    
    # Sidebar
    with st.sidebar:
        st.header("📚 Knowledge Base")
        
        # Show available topics
        if st.button("🔍 Show All Topics"):
            topics_data = call_api("knowledge/topics")
            if topics_data:
                st.markdown("**Available Topics:**")
                for topic in topics_data.get("topics", []):
                    st.markdown(f"• {topic['question']}")
        
        st.markdown("---")
        
        # Search knowledge base
        st.subheader("🔍 Search Knowledge")
        search_query = st.text_input("Search for specific topics:", placeholder="e.g., authentication, server, tools")
        
        if search_query:
            search_results = call_api(f"knowledge/search?query={search_query}")
            if search_results:
                st.markdown("**Search Results:**")
                for result in search_results:
                    with st.expander(f"📖 {result['question']}"):
                        st.markdown(result['answer'])
                        st.markdown(f"*Relevance: {result['relevance']:.2f}*")
        
        st.markdown("---")
        
        # API Status
        st.subheader("🔧 API Status")
        if st.button("Check API Status"):
            status = call_api("health")
            if status:
                st.success(f"✅ {status['status'].title()}")
                st.info(f"Service: {status['service']}")
                st.info(f"Version: {status['version']}")
            else:
                st.error("❌ API not responding")
    
    # Initialize session state
    if 'messages' not in st.session_state:
        st.session_state.messages = []
    
    # Display chat history
    if st.session_state.messages:
        st.markdown("### 💬 Conversation History")
        for message in st.session_state.messages:
            display_message(message['content'], message['role'] == 'user')
            if message['role'] == 'assistant' and 'sources' in message:
                display_sources(message['sources'])
    
    # Chat input
    st.markdown("### 💭 Ask a Question")
    user_input = st.text_area(
        "Type your question about MCP:",
        placeholder="e.g., How do I create an MCP server in Python?",
        height=100
    )
    
    col1, col2 = st.columns([1, 4])
    
    with col1:
        if st.button("🚀 Send", type="primary"):
            if user_input.strip():
                # Add user message to history
                st.session_state.messages.append({
                    'role': 'user',
                    'content': user_input
                })
                
                # Prepare chat request
                chat_data = {
                    'message': user_input,
                    'history': [
                        {'role': msg['role'], 'content': msg['content']} 
                        for msg in st.session_state.messages[-6:]  # Last 6 messages
                    ]
                }
                
                # Call chat API
                with st.spinner("🤔 Thinking..."):
                    response = call_api("chat", method="POST", data=chat_data)
                
                if response:
                    # Add bot response to history
                    st.session_state.messages.append({
                        'role': 'assistant',
                        'content': response['response'],
                        'sources': response.get('sources', [])
                    })
                    
                    # Rerun to update display
                    st.rerun()
                else:
                    st.error("Failed to get response from the chatbot.")
            else:
                st.warning("Please enter a question.")
    
    with col2:
        if st.button("🗑️ Clear Chat"):
            st.session_state.messages = []
            st.rerun()
    
    # Example questions
    st.markdown("### 💡 Example Questions")
    example_questions = [
        "What is Model Context Protocol?",
        "How do I create an MCP server in Python?",
        "What are the core components of MCP?",
        "How does MCP differ from REST APIs?",
        "What are common MCP errors and solutions?",
        "What are MCP best practices?"
    ]
    
    cols = st.columns(2)
    for i, question in enumerate(example_questions):
        with cols[i % 2]:
            if st.button(f"💬 {question}", key=f"example_{i}"):
                st.session_state.messages.append({
                    'role': 'user',
                    'content': question
                })
                
                # Prepare chat request
                chat_data = {
                    'message': question,
                    'history': [
                        {'role': msg['role'], 'content': msg['content']} 
                        for msg in st.session_state.messages[-6:]
                    ]
                }
                
                # Call chat API
                with st.spinner("🤔 Thinking..."):
                    response = call_api("chat", method="POST", data=chat_data)
                
                if response:
                    # Add bot response to history
                    st.session_state.messages.append({
                        'role': 'assistant',
                        'content': response['response'],
                        'sources': response.get('sources', [])
                    })
                    
                    # Rerun to update display
                    st.rerun()
    
    # Footer
    st.markdown("---")
    st.markdown("*Built with ❤️ using Streamlit and FastAPI*")

if __name__ == "__main__":
    main() 