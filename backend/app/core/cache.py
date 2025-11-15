import json
import redis.asyncio as redis
from typing import Optional, Any
from app.core.config import get_settings

settings = get_settings()


class RedisCache:
    """Redis cache manager for context and responses."""
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
    
    async def connect(self):
        """Connect to Redis."""
        self.redis_client = await redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            password=settings.REDIS_PASSWORD if settings.REDIS_PASSWORD else None,
            decode_responses=True
        )
    
    async def disconnect(self):
        """Disconnect from Redis."""
        if self.redis_client:
            await self.redis_client.close()
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        if not self.redis_client:
            return None
        
        value = await self.redis_client.get(key)
        if value:
            return json.loads(value)
        return None
    
    async def set(self, key: str, value: Any, ttl: int = settings.CACHE_TTL):
        """Set value in cache with TTL."""
        if not self.redis_client:
            return False
        
        serialized = json.dumps(value)
        await self.redis_client.setex(key, ttl, serialized)
        return True
    
    async def delete(self, key: str):
        """Delete key from cache."""
        if not self.redis_client:
            return False
        
        await self.redis_client.delete(key)
        return True
    
    async def exists(self, key: str) -> bool:
        """Check if key exists."""
        if not self.redis_client:
            return False
        
        return await self.redis_client.exists(key) > 0


# Global cache instance
cache = RedisCache()