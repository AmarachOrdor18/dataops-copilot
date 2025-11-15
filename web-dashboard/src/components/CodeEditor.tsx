import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
  return (
    <Editor
      height="100%"
      defaultLanguage="python"
      value={code}
      onChange={(value) => onChange(value || '')}
      theme="vs-dark" // dark theme
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        lineDecorationsWidth: 20,
        renderLineHighlight: 'all',
      }}
      className="monaco-editor" // optional, for CSS fix above
    />
  );
};

export default CodeEditor;
