import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ExampleViewerProps {
  example: string;
}

export function ExampleViewer({ example }: ExampleViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(example);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let formattedExample = example;
  try {
    const parsed = JSON.parse(example);
    formattedExample = JSON.stringify(parsed, null, 2);
  } catch (e) {
  }

  return (
    <div className="bg-slate-900 rounded-lg p-6 overflow-auto max-h-[600px] relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100">Example Data</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-sm text-slate-300 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="text-sm text-slate-300 overflow-auto">
        <code>{formattedExample}</code>
      </pre>
    </div>
  );
}
