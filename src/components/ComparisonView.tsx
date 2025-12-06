import { useState } from 'react';
import { ArrowLeftRight, Loader2, AlertCircle } from 'lucide-react';
import type { Specification } from '../types/specification';
import { compareSpecifications, type ComparisonResult } from '../services/comparisonService';

interface ComparisonViewProps {
  specifications: Specification[];
}

export function ComparisonView({ specifications }: ComparisonViewProps) {
  const [spec1Id, setSpec1Id] = useState<string>('');
  const [spec2Id, setSpec2Id] = useState<string>('');
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!spec1Id || !spec2Id) {
      setError('Please select two specifications to compare');
      return;
    }

    if (spec1Id === spec2Id) {
      setError('Please select two different specifications');
      return;
    }

    const spec1 = specifications.find(s => s.id === spec1Id);
    const spec2 = specifications.find(s => s.id === spec2Id);

    if (!spec1 || !spec2) {
      setError('Selected specifications not found');
      return;
    }

    setLoading(true);
    setError(null);
    setComparison(null);

    try {
      const result = await compareSpecifications(spec1, spec2);
      setComparison(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during comparison');
    } finally {
      setLoading(false);
    }
  };

  const spec1 = specifications.find(s => s.id === spec1Id);
  const spec2 = specifications.find(s => s.id === spec2Id);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeftRight className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Compare Specifications</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              First Specification
            </label>
            <select
              value={spec1Id}
              onChange={(e) => setSpec1Id(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
            >
              <option value="">Select a specification...</option>
              {specifications.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.fullName} ({spec.organization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Second Specification
            </label>
            <select
              value={spec2Id}
              onChange={(e) => setSpec2Id(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
            >
              <option value="">Select a specification...</option>
              {specifications.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.fullName} ({spec.organization})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={loading || !spec1Id || !spec2Id}
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <ArrowLeftRight className="w-5 h-5" />
              Compare Specifications
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>

      {comparison && spec1 && spec2 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Comparison: {spec1.name} vs {spec2.name}
            </h3>
            <p className="text-slate-700 leading-relaxed">{comparison.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Structural Similarities
                </h4>
                <ul className="space-y-2">
                  {comparison.structuralSimilarities.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-700 pl-4 border-l-2 border-green-200">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Vocabulary Overlap
                </h4>
                <div className="flex flex-wrap gap-2">
                  {comparison.vocabularyOverlap.map((term, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Use Case Similarities
                </h4>
                <ul className="space-y-2">
                  {comparison.useCaseSimilarities.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-700 pl-4 border-l-2 border-purple-200">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Structural Differences
                </h4>
                <ul className="space-y-2">
                  {comparison.structuralDifferences.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-700 pl-4 border-l-2 border-orange-200">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Unique Vocabulary</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">{spec1.name}:</p>
                    <div className="flex flex-wrap gap-2">
                      {comparison.vocabularyUnique.spec1.map((term, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm border border-slate-300"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">{spec2.name}:</p>
                    <div className="flex flex-wrap gap-2">
                      {comparison.vocabularyUnique.spec2.map((term, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm border border-slate-300"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  Interoperability Notes
                </h4>
                <ul className="space-y-2">
                  {comparison.interoperabilityNotes.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-700 pl-4 border-l-2 border-teal-200">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
