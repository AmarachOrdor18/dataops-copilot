import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ResultDisplayProps {
  code: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="result-display">
      <div className="result-header">
        <h3>Generated Code</h3>
        <button onClick={handleCopy} className="copy-btn">
          {copied ? (
            <>
              <Check size={18} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={18} />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="result-code">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default ResultDisplay;