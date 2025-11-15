import { useState } from 'react';
import { Sparkles, Code2, RefreshCw } from 'lucide-react';
import PromptInput from './components/PromptInput';
import CodeEditor from './components/CodeEditor';
import { generateCode, improveCode } from './services/api';
import './App.css';

function App() {
  const [code, setCode] = useState<string>('# Generated code will appear here\n');
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<'generate' | 'improve'>('generate');

  const handleGenerate = async (prompt: string) => {
    setLoading(true);
    try {
      console.log('Generating code for prompt:', prompt);
      const response = await generateCode(prompt);
      console.log('Response received:', response);
      
      // Clean markdown formatting if present
      let cleanCode = response.code;
      if (cleanCode.includes('```python')) {
        cleanCode = cleanCode.replace(/```python\n?/g, '').replace(/```/g, '');
      } else if (cleanCode.includes('```')) {
        cleanCode = cleanCode.replace(/```/g, '');
      }
      
      const finalCode = cleanCode.trim();
      console.log('Setting code (length):', finalCode.length);
      setCode(finalCode);
    } catch (error: any) {
      console.error('Generation error:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      alert(`Failed to generate code: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImprove = async (focusAreas: string[]) => {
    setLoading(true);
    try {
      console.log('Improving code with focus areas:', focusAreas);
      const response = await improveCode(code, focusAreas);
      console.log('Improvement response received');
      
      // Format the improvement display
      const improvedDisplay = `# Original Code\n\n${response.original_code}\n\n# Suggestions\n\n${response.suggestions}`;
      setCode(improvedDisplay);
    } catch (error: any) {
      console.error('Improvement error:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      alert(`Failed to improve code: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Code2 size={32} />
            <h1>DataOps Copilot</h1>
          </div>
          <p className="tagline">AI-powered code generation for data engineers</p>
        </div>
      </header>

      <main className="main">
        <div className="controls">
          <div className="mode-toggle">
            <button
              className={mode === 'generate' ? 'active' : ''}
              onClick={() => setMode('generate')}
            >
              <Sparkles size={18} />
              Generate
            </button>
            <button
              className={mode === 'improve' ? 'active' : ''}
              onClick={() => setMode('improve')}
            >
              <RefreshCw size={18} />
              Improve
            </button>
          </div>

          {mode === 'generate' ? (
            <PromptInput onSubmit={handleGenerate} loading={loading} />
          ) : (
            <div className="improve-controls">
              <p>Select focus areas (optional):</p>
              <div className="focus-areas">
                {['performance', 'error_handling', 'readability', 'security', 'scalability'].map(area => (
                  <label key={area}>
                    <input type="checkbox" value={area} />
                    {area.replace('_', ' ')}
                  </label>
                ))}
              </div>
              <button
                onClick={() => {
                  const checkboxes = document.querySelectorAll<HTMLInputElement>('.focus-areas input:checked');
                  const areas = Array.from(checkboxes).map(cb => cb.value);
                  handleImprove(areas);
                }}
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Analyze Code'}
              </button>
            </div>
          )}
        </div>

        <div className="editor-container">
          <CodeEditor code={code} onChange={setCode} />
        </div>
      </main>
    </div>
  );
}

export default App;