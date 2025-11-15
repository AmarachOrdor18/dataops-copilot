import google.generativeai as genai
from app.core.config import get_settings
from app.core.cache import cache
import hashlib
from typing import Optional

settings = get_settings()
genai.configure(api_key=settings.GEMINI_API_KEY)


class GeminiService:
    """Service for Google Gemini interactions."""
    
    SYSTEM_PROMPT = """You are a code generation assistant for data engineers. Generate Python ETL code based on the task description. Be concise and include only essential imports and error handling. Return raw Python code without markdown formatting."""

    IMPROVEMENT_PROMPT = """You are a DataOps Copilot reviewing data pipeline code.

Analyze the provided code and suggest improvements for:
1. Performance optimization
2. Error handling
3. Code structure and readability
4. Best practices
5. Security considerations
6. Scalability

Provide specific, actionable suggestions with code examples."""

    @staticmethod
    def _generate_cache_key(prompt: str, context: str = "") -> str:
        """Generate cache key from prompt and context."""
        content = f"{prompt}:{context}"
        return f"gemini:{hashlib.md5(content.encode()).hexdigest()}"
    
    @staticmethod
    async def generate_code(
        prompt: str,
        context: Optional[str] = None,
        use_cache: bool = True
    ) -> str:
        """Generate code based on prompt."""
        
        # Check cache
        if use_cache:
            cache_key = GeminiService._generate_cache_key(prompt, context or "")
            cached_result = await cache.get(cache_key)
            if cached_result:
                return cached_result
        
        # Prepare full prompt
        full_prompt = f"{GeminiService.SYSTEM_PROMPT}\n\n"
        if context:
            full_prompt += f"Context:\n{context}\n\n"
        full_prompt += f"Task: {prompt}"
        
        # Call Gemini
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(full_prompt)
        result = response.text
        
        # Cache result
        if use_cache:
            await cache.set(cache_key, result)
        
        return result
    
    @staticmethod
    async def improve_code(
        code: str,
        focus_areas: Optional[list[str]] = None
    ) -> dict:
        """Analyze and suggest improvements for code."""
        
        # Prepare prompt
        focus = ""
        if focus_areas:
            focus = f"\nFocus on: {', '.join(focus_areas)}"
        
        full_prompt = f"{GeminiService.IMPROVEMENT_PROMPT}\n\nReview this code:\n\n```python\n{code}\n```{focus}"
        
        # Call Gemini - Use gemini-1.5-flash for free tier
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(full_prompt)
        suggestions = response.text
        
        return {
            "original_code": code,
            "suggestions": suggestions,
            "focus_areas": focus_areas or []
        }
    
    @staticmethod
    async def autocomplete(
        code_prefix: str,
        context: Optional[str] = None
    ) -> list[str]:
        """Provide intelligent autocomplete suggestions."""
        
        full_prompt = f"""You are a code completion assistant. Provide 3 likely completions for the given code prefix. Return only the completion text, one per line.

Code context:
{context or 'N/A'}

Complete this:
{code_prefix}"""
        
        # Call Gemini - Use gemini-1.5-flash for free tier
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(full_prompt)
        
        completions = response.text.strip().split('\n')
        return [c.strip() for c in completions if c.strip()][:3]