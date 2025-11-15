import { useState } from 'react';
import { Send } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  loading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, loading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  const examples = [
    'Extract data from S3 bucket, clean null values, and load into PostgreSQL',
    'Create a pipeline to read CSV files, transform with pandas, write to Snowflake',
    'Build an ETL script that pulls from REST API and loads into MongoDB'
  ];

  return (
    <div className="prompt-input">
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the ETL task you want to generate..."
          rows={4}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !prompt.trim()}>
          <Send size={18} />
          {loading ? 'Generating...' : 'Generate Code'}
        </button>
      </form>

      <div className="examples">
        <p>Examples:</p>
        {examples.map((example, i) => (
          <button
            key={i}
            onClick={() => setPrompt(example)}
            className="example-btn"
            disabled={loading}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptInput;