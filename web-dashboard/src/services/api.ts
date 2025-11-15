import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 150000, // 2 minutes
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GenerateCodeResponse {
  code: string;
  cached: boolean;
  prompt: string;
}

export interface ImproveCodeResponse {
  original_code: string;
  suggestions: string;
  focus_areas: string[];
}

export const generateCode = async (
  prompt: string,
  context?: string
): Promise<GenerateCodeResponse> => {
  const response = await client.post('/code/generate', {
    prompt,
    context,
    use_cache: true,
  });
  return response.data;
};

export const improveCode = async (
  code: string,
  focusAreas?: string[]
): Promise<ImproveCodeResponse> => {
  const response = await client.post('/code/improve', {
    code,
    focus_areas: focusAreas,
  });
  return response.data;
};