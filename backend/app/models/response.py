from pydantic import BaseModel, Field
from typing import Optional


class GenerateCodeResponse(BaseModel):
    """Response model for code generation."""
    
    code: str = Field(..., description="Generated Python code")
    cached: bool = Field(False, description="Whether result was from cache")
    prompt: str = Field(..., description="Original prompt")


class ImproveCodeResponse(BaseModel):
    """Response model for code improvement."""
    
    original_code: str = Field(..., description="Original code")
    suggestions: str = Field(..., description="Improvement suggestions")
    focus_areas: list[str] = Field(default_factory=list, description="Areas analyzed")


class AutocompleteResponse(BaseModel):
    """Response model for autocomplete."""
    
    completions: list[str] = Field(..., description="List of completion suggestions")
    code_prefix: str = Field(..., description="Original code prefix")


class ErrorResponse(BaseModel):
    """Error response model."""
    
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")