import axios, { AxiosInstance } from 'axios';

interface GenerateCodeResponse {
    code: string;
    cached: boolean;
    prompt: string;
}

interface ImproveCodeResponse {
    original_code: string;
    suggestions: string;
    focus_areas: string[];
}

interface AutocompleteResponse {
    completions: string[];
    code_prefix: string;
}

export class DataOpsAPI {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async generateCode(prompt: string, context?: string): Promise<GenerateCodeResponse> {
        const response = await this.client.post('/code/generate', {
            prompt,
            context,
            use_cache: true
        });
        return response.data;
    }

    async improveCode(code: string, focusAreas?: string[]): Promise<ImproveCodeResponse> {
        const response = await this.client.post('/code/improve', {
            code,
            focus_areas: focusAreas
        });
        return response.data;
    }

    async autocomplete(codePrefix: string, context?: string): Promise<AutocompleteResponse> {
        const response = await this.client.post('/code/autocomplete', {
            code_prefix: codePrefix,
            context
        });
        return response.data;
    }
}