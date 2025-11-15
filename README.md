# DataOps Copilot 🚀

![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-orange.svg)

> "GitHub Copilot" for data engineers - AI-powered code generation for ETL tasks using Google Gemini

## Features

✨ **Code Generation**: Generate Python scripts for ETL tasks from natural language prompts  
🔧 **Code Improvement**: Get intelligent suggestions to optimize existing data pipelines  
⚡ **Smart Autocomplete**: Context-aware code completion in VSCode  
💾 **Intelligent Caching**: Redis-powered caching for faster responses  
🎯 **Multiple Interfaces**: VSCode extension + Web dashboard  
🚀 **Powered by Google Gemini**: Fast, free, and powerful AI model

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (optional)
- **Google Gemini API key** (get it free at https://makersuite.google.com/app/apikey)
  - 60 requests per minute
  - 1,500 requests per day
  - **100% FREE!**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/dataops-copilot.git
cd dataops-copilot
```

2. **Setup Backend**
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
nano .env
```

3. **Start Redis**
```bash
docker run -d -p 6379:6379 --name redis-dataops redis:7-alpine
```

4. **Start Backend**
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

5. **Setup Web Dashboard**
```bash
cd web-dashboard

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start dev server
npm run dev
```

6. **Access the application**
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Web Dashboard: http://localhost:5173

## Usage

### Web Dashboard

1. Start the web dashboard:
```bash
cd web-dashboard
npm install
npm run dev
```

2. Open `http://localhost:5173`

3. Enter your ETL task description and generate code!

### VSCode Extension

1. Build the extension:
```bash
cd vscode-extension
npm install
npm run compile
```

2. Press F5 in VSCode to launch Extension Development Host

3. Use keyboard shortcut `Ctrl+Shift+G` (or `Cmd+Shift+G` on Mac) to generate code

### API Usage

**Generate Code:**
```bash
curl -X POST http://localhost:8000/api/v1/code/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Extract data from S3, clean nulls, load to PostgreSQL",
    "use_cache": true
  }'
```

**Improve Code:**
```bash
curl -X POST http://localhost:8000/api/v1/code/improve \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import pandas as pd\ndf = pd.read_csv(\"data.csv\")",
    "focus_areas": ["error_handling", "performance"]
  }'
```

## Architecture

```
┌─────────────────┐
│  VSCode Ext     │
└────────┬────────┘
         │
┌────────▼────────┐         ┌─────────────┐
│  Web Dashboard  │◄───────►│   FastAPI   │
└─────────────────┘         │   Backend   │
                            └──────┬──────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
               ┌────▼─────┐   ┌───▼────┐   ┌────▼─────┐
               │ OpenAI   │   │ Redis  │   │  Cache   │
               │   API    │   │        │   │  Layer   │
               └──────────┘   └────────┘   └──────────┘
```

## Tech Stack

- **Backend**: FastAPI, Python 3.11
- **LLM**: Google Gemini 2.5 Flash (Free Tier)
- **Cache**: Redis
- **Frontend**: React, TypeScript, Vite
- **Editor**: Monaco Editor
- **Extension**: VSCode Extension API

## Development

### Running Tests

```bash
# Backend tests
cd backend
pytest tests/ -v

# Extension tests
cd vscode-extension
npm test
```

### Code Quality

```bash
# Format Python code
black backend/app/

# Lint Python code
flake8 backend/app/

# Lint TypeScript
cd vscode-extension
npm run lint
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `CACHE_TTL` | Cache TTL in seconds | `3600` |

## Getting Your Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Click "Create API Key" or "Get API Key"
3. Copy the key and add it to your `.env` file
4. **It's FREE!** No credit card required

## Why Google Gemini?

✅ **Completely Free** - No credit card required, generous free tier  
✅ **Fast Performance** - Gemini 2.5 Flash is optimized for speed  
✅ **Great Code Quality** - Excellent at generating Python ETL code  
✅ **High Rate Limits** - 60 requests/minute, 1,500/day  
✅ **Easy Setup** - Get API key in seconds  

vs OpenAI ($5 credit that expires) or Claude (limited free tier)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Roadmap

- [x] Google Gemini integration
- [x] Redis caching
- [x] Web dashboard
- [x] VSCode extension
- [ ] Support for more LLM providers (Claude, Llama)
- [ ] Fine-tuning on data engineering patterns
- [ ] Integration with dbt, Airflow
- [ ] Code version history
- [ ] Collaborative features
- [ ] Pre-built templates library
- [ ] Multi-language support (SQL, Scala, etc.)

## Support

- 📧 Email: support@dataopscopilot.com
- 💬 Discord: [Join our community](https://discord.gg/dataops)
- 📖 Docs: [docs.dataopscopilot.com](https://docs.dataopscopilot.com)

---

Made with ❤️ for data engineers