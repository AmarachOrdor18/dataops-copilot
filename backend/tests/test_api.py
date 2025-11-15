import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_health_check():
    """Test health check endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/health")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_generate_code():
    """Test code generation endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/code/generate",
            json={
                "prompt": "Read CSV and print first 5 rows",
                "use_cache": False
            }
        )
    
    assert response.status_code == 200
    data = response.json()
    assert "code" in data
    assert "prompt" in data
    assert isinstance(data["code"], str)


@pytest.mark.asyncio
async def test_improve_code():
    """Test code improvement endpoint."""
    code = """
import pandas as pd
df = pd.read_csv('data.csv')
print(df.head())
"""
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/code/improve",
            json={
                "code": code,
                "focus_areas": ["error_handling"]
            }
        )
    
    assert response.status_code == 200
    data = response.json()
    assert "suggestions" in data
    assert "original_code" in data


@pytest.mark.asyncio
async def test_generate_code_missing_prompt():
    """Test code generation with missing prompt."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/code/generate",
            json={}
        )
    
    assert response.status_code == 422  # Validation error