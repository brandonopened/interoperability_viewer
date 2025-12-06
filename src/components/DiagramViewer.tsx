import { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';

interface DiagramViewerProps {
  diagram: string;
}

export function DiagramViewer({ diagram }: DiagramViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMermaid = async () => {
      if (!containerRef.current) return;
      setIsLoading(true);
      setError(null);

      try {
        const mermaid = (await import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs')).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#3b82f6',
            primaryTextColor: '#fff',
            primaryBorderColor: '#1e40af',
            lineColor: '#64748b',
            secondaryColor: '#10b981',
            tertiaryColor: '#f59e0b',
            background: '#0f172a',
            mainBkg: '#1e293b',
            secondBkg: '#334155',
            textColor: '#e2e8f0',
            fontSize: '16px',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif'
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
            padding: 20
          }
        });

        const uniqueId = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, diagram);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;

          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error rendering mermaid diagram:', error);
        setError(error instanceof Error ? error.message : String(error));
        setIsLoading(false);
      }
    };

    loadMermaid();
  }, [diagram]);

  const handleDownloadSVG = () => {
    const svgElement = containerRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'specification-diagram.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  return (
    <div className="bg-slate-900 rounded-lg p-6 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100">Specification Diagram</h3>
        {!isLoading && !error && (
          <button
            onClick={handleDownloadSVG}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-sm text-slate-300 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download SVG
          </button>
        )}
      </div>
      {isLoading && (
        <div className="flex items-center justify-center p-8 min-h-[400px]">
          <div className="text-slate-400">Loading diagram...</div>
        </div>
      )}
      {error && (
        <div className="text-red-400 p-4 bg-red-950/30 rounded">
          <p className="font-semibold mb-2">Error rendering diagram</p>
          <pre className="text-xs overflow-auto">{error}</pre>
        </div>
      )}
      <div
        ref={containerRef}
        className={`flex items-center justify-center p-8 min-h-[400px] ${isLoading || error ? 'hidden' : ''}`}
      />
    </div>
  );
}
