from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import get_settings
from app.core.cache import cache
from app.models.request import GenerateCodeRequest, ImproveCodeRequest, AutocompleteRequest
from app.models.response import (
    GenerateCodeResponse, ImproveCodeResponse, 
    AutocompleteResponse, ErrorResponse
)
from app.services.gemini_service import GeminiService as LLMService

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan."""
    # Startup
    print("🚀 Starting DataOps Copilot API...")
    await cache.connect()
    print("✅ Redis connected")
    yield
    # Shutdown
    print("👋 Shutting down...")
    await cache.disconnect()


# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoints
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "DataOps Copilot API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    redis_status = "connected" if cache.redis_client else "disconnected"
    return {
        "status": "healthy",
        "redis": redis_status
    }


# Code generation endpoint
@app.post(f"{settings.API_V1_STR}/code/generate", response_model=GenerateCodeResponse)
async def generate_code(request: GenerateCodeRequest):
    """
    Generate Python code for ETL tasks from natural language prompt.
    
    Example prompts:
    - "Extract data from S3 bucket, clean null values, load into PostgreSQL"
    - "Create a pipeline to read CSV files, transform with pandas, write to Snowflake"
    - "Build an ETL script that pulls from REST API and loads into MongoDB"
    """
    try:
        print(f"📝 Generating code for: {request.prompt[:50]}...")
        
        # Check if cached
        cached = False
        if request.use_cache:
            cache_key = f"llm:{hash(request.prompt + (request.context or ''))}"
            cached_result = await cache.get(cache_key)
            if cached_result:
                cached = True
                print("✅ Using cached result")
        
        # Generate code
        code = await LLMService.generate_code(
            prompt=request.prompt,
            context=request.context,
            use_cache=request.use_cache
        )
        
        print(f"✅ Code generated successfully ({len(code)} chars)")
        
        return GenerateCodeResponse(
            code=code,
            cached=cached,
            prompt=request.prompt
        )
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Code generation failed: {str(e)}")


# Code improvement endpoint
@app.post(f"{settings.API_V1_STR}/code/improve", response_model=ImproveCodeResponse)
async def improve_code(request: ImproveCodeRequest):
    """
    Analyze existing code and suggest improvements.
    
    Focus areas can include:
    - performance: Optimize for speed and efficiency
    - error_handling: Add robust error handling
    - readability: Improve code structure and documentation
    - security: Address security concerns
    - scalability: Make code more scalable
    """
    try:
        print(f"🔍 Analyzing code ({len(request.code)} chars)...")
        
        result = await LLMService.improve_code(
            code=request.code,
            focus_areas=request.focus_areas
        )
        
        print("✅ Analysis complete")
        
        return ImproveCodeResponse(**result)
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Code improvement failed: {str(e)}")


# Autocomplete endpoint
@app.post(f"{settings.API_V1_STR}/code/autocomplete", response_model=AutocompleteResponse)
async def autocomplete(request: AutocompleteRequest):
    """
    Provide intelligent autocomplete suggestions for code.
    
    Returns up to 3 completion suggestions based on the code prefix and context.
    """
    try:
        completions = await LLMService.autocomplete(
            code_prefix=request.code_prefix,
            context=request.context
        )
        
        return AutocompleteResponse(
            completions=completions,
            code_prefix=request.code_prefix
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Autocomplete failed: {str(e)}")


# Print registered routes on startup
@app.on_event("startup")
async def print_routes():
    print("\n" + "="*50)
    print("📍 REGISTERED ROUTES:")
    print("="*50)
    for route in app.routes:
        methods = getattr(route, 'methods', None)
        if methods:
            print(f"  {', '.join(methods):8} {route.path}")
    print("="*50 + "\n")