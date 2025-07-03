"""
Simple MCP Q&A Chatbot API
A streamlined implementation focusing on core functionality.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv
import openai

from knowledge_base import search_knowledge, get_all_topics, MCP_KNOWLEDGE

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="MCP Q&A Chatbot",
    description="Intelligent Q&A chatbot for Model Context Protocol",
    version="1.0.0"
)

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []

class ChatResponse(BaseModel):
    response: str
    sources: List[Dict[str, str]] = []

class KnowledgeItem(BaseModel):
    id: str
    question: str
    answer: str
    relevance: float

# System prompt for the chatbot
SYSTEM_PROMPT = """You are an expert assistant specialized in Model Context Protocol (MCP). 
Your job is to help developers understand MCP concepts, implementation patterns, and best practices.

You have access to a comprehensive knowledge base about MCP. When answering questions:
1. Use the provided knowledge base information as your primary source
2. If the knowledge base doesn't contain specific information, say so clearly
3. Always provide practical, actionable advice
4. Include code examples when relevant
5. Be concise but thorough

If a user asks about something not related to MCP, politely redirect them to MCP-related topics.
"""

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "MCP Q&A Chatbot API is running"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chat endpoint."""
    try:
        # Search knowledge base for relevant information
        knowledge_results = search_knowledge(request.message)
        
        # Build context from knowledge base
        context = ""
        sources = []
        
        if knowledge_results:
            context = "Here's relevant information from the MCP knowledge base:\n\n"
            for result in knowledge_results:
                context += f"Q: {result['question']}\nA: {result['answer']}\n\n"
                sources.append({
                    "question": result['question'],
                    "relevance": str(result['relevance'])
                })
        
        # Build conversation history
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # Add previous conversation history
        for msg in request.history[-5:]:  # Keep last 5 messages for context
            messages.append(msg)
        
        # Add knowledge context and user message
        user_content = f"Context from knowledge base:\n{context}\n\nUser question: {request.message}"
        messages.append({"role": "user", "content": user_content})
        
        # Call OpenAI API
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # Using more cost-effective model
            messages=messages,
            max_tokens=1000,
            temperature=0.7
        )
        
        bot_response = response.choices[0].message.content
        
        return ChatResponse(
            response=bot_response,
            sources=sources
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get("/knowledge/search")
async def search_knowledge_endpoint(query: str) -> List[KnowledgeItem]:
    """Search the knowledge base."""
    try:
        results = search_knowledge(query)
        return [KnowledgeItem(**result) for result in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching knowledge: {str(e)}")

@app.get("/knowledge/topics")
async def get_topics():
    """Get all available topics."""
    try:
        topics = get_all_topics()
        return {"topics": topics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting topics: {str(e)}")

@app.get("/knowledge/{topic_id}")
async def get_topic(topic_id: str):
    """Get specific topic information."""
    try:
        if topic_id not in MCP_KNOWLEDGE:
            raise HTTPException(status_code=404, detail="Topic not found")
        
        topic = MCP_KNOWLEDGE[topic_id]
        return {
            "id": topic_id,
            "question": topic["question"],
            "answer": topic["answer"],
            "keywords": topic["keywords"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting topic: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "MCP Q&A Chatbot",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True) 