from pydantic import BaseModel, Field
from typing import Optional


class GenerateCodeRequest(BaseModel):
    """Request model for code generation."""
    
    prompt: str = Field(..., description="Natural language description of the ETL task")
    context: Optional[str] = Field(None, description="Additional context or existing code")
    use_cache: bool = Field(True, description="Whether to use cached results")
    
    class Config:
        json_schema_extra = {
            "example": {
                "prompt": "Write a script that extracts data from an S3 bucket, cleans null values, and loads into PostgreSQL",
                "context": "Database credentials are in environment variables",
                "use_cache": True
            }
        }


class ImproveCodeRequest(BaseModel):
    """Request model for code improvement."""
    
    code: str = Field(..., description="Existing code to improve")
    focus_areas: Optional[list[str]] = Field(
        None,
        description="Specific areas to focus on (performance, error_handling, etc.)"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "code": "import pandas as pd\ndf = pd.read_csv('data.csv')\ndf.to_sql('table', engine)",
                "focus_areas": ["error_handling", "performance"]
            }
        }


class AutocompleteRequest(BaseModel):
    """Request model for autocomplete."""
    
    code_prefix: str = Field(..., description="Code written so far")
    context: Optional[str] = Field(None, description="Surrounding code context")
    
    class Config:
        json_schema_extra = {
            "example": {
                "code_prefix": "df = pd.read_",
                "context": "import pandas as pd\nimport numpy as np"
            }
        }