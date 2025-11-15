from typing import Optional
from app.core.config import get_settings

settings = get_settings()


class LLMRouter:
    """Router that always uses Google Gemini."""

    _service = None

    @classmethod
    def get_service(cls):
        """Always return Gemini service."""
        if cls._service is None:
            from app.services.gemini_service import GeminiService
            cls._service = GeminiService
            print("✅ Using Google Gemini (forced)")
        
        return cls._service

    @staticmethod
    async def generate_code(prompt: str, context: Optional[str] = None, use_cache: bool = True) -> str:
        service = LLMRouter.get_service()
        return await service.generate_code(prompt, context, use_cache)

    @staticmethod
    async def improve_code(code: str, focus_areas: Optional[list[str]] = None) -> dict:
        service = LLMRouter.get_service()
        return await service.improve_code(code, focus_areas)

    @staticmethod
    async def autocomplete(code_prefix: str, context: Optional[str] = None) -> list[str]:
        service = LLMRouter.get_service()
        return await service.autocomplete(code_prefix, context)
