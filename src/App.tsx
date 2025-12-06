import { useState } from 'react';
import { FileText, Code, FileJson, Network, ExternalLink, BookOpen } from 'lucide-react';
import { specifications } from './data/specifications';
import { Specification, ViewMode } from './types/specification';
import { SchemaViewer } from './components/SchemaViewer';
import { ExampleViewer } from './components/ExampleViewer';
import { DiagramViewer } from './components/DiagramViewer';
import { TermsList } from './components/TermsList';

function App() {
  const [selectedSpec, setSelectedSpec] = useState<Specification>(specifications[0]);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  const organizationColors = {
    '1EdTech': 'bg-blue-100 text-blue-700 border-blue-200',
    'Credential Engine': 'bg-green-100 text-green-700 border-green-200',
    'IEEE': 'bg-purple-100 text-purple-700 border-purple-200',
    'HR Open': 'bg-orange-100 text-orange-700 border-orange-200'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Network className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Interoperability Specification Viewer
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Explore specifications from 1EdTech, Credential Engine, and IEEE
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-lg border border-slate-200 p-4 sticky top-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">
                Specifications
              </h2>
              <div className="space-y-2">
                {specifications.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => {
                      setSelectedSpec(spec);
                      setViewMode('overview');
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedSpec.id === spec.id
                        ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
                        : 'bg-slate-50 border-2 border-transparent hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 text-sm">
                        {spec.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-700 rounded shrink-0">
                        v{spec.version}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                      {spec.fullName}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded border ${
                        organizationColors[spec.organization]
                      }`}
                    >
                      {spec.organization}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-6">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {selectedSpec.fullName}
                    </h2>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedSpec.description}
                    </p>
                  </div>
                  <a
                    href={selectedSpec.specUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Spec
                  </a>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() => setViewMode('overview')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      viewMode === 'overview'
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-transparent'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Overview
                  </button>
                  <button
                    onClick={() => setViewMode('schema')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      viewMode === 'schema'
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-transparent'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    Schema
                  </button>
                  <button
                    onClick={() => setViewMode('example')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      viewMode === 'example'
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-transparent'
                    }`}
                  >
                    <FileJson className="w-4 h-4" />
                    Example
                  </button>
                  <button
                    onClick={() => setViewMode('diagram')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      viewMode === 'diagram'
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-transparent'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Diagram
                  </button>
                </div>
              </div>

              <div className="p-6">
                {viewMode === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        About {selectedSpec.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-sm text-blue-600 font-medium mb-1">
                            Organization
                          </div>
                          <div className="text-lg font-semibold text-blue-900">
                            {selectedSpec.organization}
                          </div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="text-sm text-green-600 font-medium mb-1">
                            Version
                          </div>
                          <div className="text-lg font-semibold text-green-900">
                            {selectedSpec.version}
                          </div>
                        </div>
                      </div>
                    </div>
                    <TermsList terms={selectedSpec.terms} />
                  </div>
                )}

                {viewMode === 'schema' && <SchemaViewer schema={selectedSpec.schema} />}

                {viewMode === 'example' && <ExampleViewer example={selectedSpec.example} />}

                {viewMode === 'diagram' && <DiagramViewer diagram={selectedSpec.diagram} />}
              </div>
            </div>
          </main>
        </div>
      </div>

      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-sm text-slate-600">
            Interoperability Specification Visualization Tool
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
