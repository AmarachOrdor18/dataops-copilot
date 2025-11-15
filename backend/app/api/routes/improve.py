from fastapi import APIRouter, HTTPException
from app.models.request import ImproveCodeRequest
from app.models.response import ImproveCodeResponse
from backend.app.services.gemini_service import LLMService

router = APIRouter()


@router.post("/improve", response_model=ImproveCodeResponse)
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
        result = await LLMService.improve_code(
            code=request.code,
            focus_areas=request.focus_areas
        )
        
        return ImproveCodeResponse(**result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code improvement failed: {str(e)}")