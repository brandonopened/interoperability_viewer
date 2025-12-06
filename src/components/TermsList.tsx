import { SpecTerm } from '../types/specification';
import { Tag } from 'lucide-react';

interface TermsListProps {
  terms: SpecTerm[];
}

export function TermsList({ terms }: TermsListProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 max-h-[600px] overflow-auto">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5 text-blue-600" />
        Specification Terms
      </h3>
      <div className="space-y-4">
        {terms.map((term, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-baseline gap-3 mb-1">
              <h4 className="font-semibold text-slate-900">{term.name}</h4>
              {term.type && (
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                  {term.type}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mb-2">{term.description}</p>
            {term.relationships && term.relationships.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-slate-500">Related to:</span>
                {term.relationships.map((rel, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded"
                  >
                    {rel}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
