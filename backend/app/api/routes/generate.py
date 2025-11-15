from fastapi import APIRouter, HTTPException
from app.models.request import GenerateCodeRequest, AutocompleteRequest
from app.models.response import GenerateCodeResponse, AutocompleteResponse, ErrorResponse
from backend.app.services.gemini_service import LLMService
from app.core.cache import cache

router = APIRouter()


@router.post("/generate", response_model=GenerateCodeResponse)
async def generate_code(request: GenerateCodeRequest):
    """
    Generate Python code for ETL tasks from natural language prompt.
    
    Example prompts:
    - "Extract data from S3 bucket, clean null values, load into PostgreSQL"
    - "Create a pipeline to read CSV files, transform with pandas, write to Snowflake"
    - "Build an ETL script that pulls from REST API and loads into MongoDB"
    """
    try:
        # Check if cached
        cached = False
        if request.use_cache:
            cache_key = f"llm:{hash(request.prompt + (request.context or ''))}"
            cached_result = await cache.get(cache_key)
            if cached_result:
                cached = True
        
        # Generate code
        code = await LLMService.generate_code(
            prompt=request.prompt,
            context=request.context,
            use_cache=request.use_cache
        )
        
        return GenerateCodeResponse(
            code=code,
            cached=cached,
            prompt=request.prompt
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code generation failed: {str(e)}")


@router.post("/autocomplete", response_model=AutocompleteResponse)
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