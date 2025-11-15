# DataOps Copilot 🚀

> "GitHub Copilot" for data engineers - AI-powered code generation for ETL tasks

## Features

✨ **Code Generation**: Generate Python scripts for ETL tasks from natural language prompts  
🔧 **Code Improvement**: Get intelligent suggestions to optimize existing data pipelines  
⚡ **Smart Autocomplete**: Context-aware code completion in VSCode  
💾 **Intelligent Caching**: Redis-powered caching for faster responses  
🎯 **Multiple Interfaces**: VSCode extension + Web dashboard

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/dataops-copilot.git
cd dataops-copilot
```

2. **Setup environment variables**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your OPENAI_API_KEY
```

3. **Start services with Docker**
```bash
docker-compose up -d
```

The backend API will be available at `http://localhost:8000`

4. **Access the API documentation**
Open `http://localhost:8000/docs` for interactive API docs

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
- **LLM**: OpenAI GPT-4
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
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `OPENAI_MODEL` | Model to use | `gpt-4` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `CACHE_TTL` | Cache TTL in seconds | `3600` |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Roadmap

- [ ] Support for more LLM providers (Claude, Llama)
- [ ] Fine-tuning on data engineering patterns
- [ ] Integration with dbt, Airflow
- [ ] Code version history
- [ ] Collaborative features
- [ ] Pre-built templates library

## Support

- 📧 Email: support@dataopscopilot.com
- 💬 Discord: [Join our community](https://discord.gg/dataops)
- 📖 Docs: [docs.dataopscopilot.com](https://docs.dataopscopilot.com)

---

Made with ❤️ for data engineers