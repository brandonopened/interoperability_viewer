import { useState, useRef } from 'react';
import { Clock, Loader2, AlertCircle, X, Sparkles } from 'lucide-react';
import type { DomainType, TimelineElement, TimelineRecommendation } from '../services/timelineService';
import { getSpecificationRecommendations } from '../services/timelineService';
import { specifications } from '../data/specifications';

const DOMAIN_COLORS: Record<DomainType, string> = {
  'K12': 'bg-blue-100 border-blue-300 text-blue-900',
  'Higher Ed': 'bg-purple-100 border-purple-300 text-purple-900',
  'Other Learning': 'bg-green-100 border-green-300 text-green-900',
  'HR': 'bg-orange-100 border-orange-300 text-orange-900'
};

const DOMAIN_ICONS: Record<DomainType, string> = {
  'K12': '🏫',
  'Higher Ed': '🎓',
  'Other Learning': '📚',
  'HR': '💼'
};

const PREBUILT_ELEMENTS: Record<DomainType, TimelineElement[]> = {
  'K12': [
    { id: 'k12-1', label: 'High School Transcript', domain: 'K12', description: 'Student academic records and transcripts' },
    { id: 'k12-2', label: 'Course Completion', domain: 'K12', description: 'Completed courses and credits' },
    { id: 'k12-3', label: 'Assessment Results', domain: 'K12', description: 'Standardized test scores and assessments' },
    { id: 'k12-4', label: 'CLR - Comprehensive Learner Record', domain: 'K12', description: 'Complete learning history for advancement into college' }
  ],
  'Higher Ed': [
    { id: 'he-1', label: 'College Transcript', domain: 'Higher Ed', description: 'Post-secondary academic records' },
    { id: 'he-2', label: 'Degree Credential', domain: 'Higher Ed', description: 'Earned degrees and certifications' },
    { id: 'he-3', label: 'Course Enrollment', domain: 'Higher Ed', description: 'Current and past course enrollments' },
    { id: 'he-4', label: 'CLR - Trusted Career Profile', domain: 'Higher Ed', description: 'Complete learning record for advancement into life and career (LER-RS)' }
  ],
  'Other Learning': [
    { id: 'ol-1', label: 'Professional Training', domain: 'Other Learning', description: 'Workplace and professional development' },
    { id: 'ol-2', label: 'Online Course', domain: 'Other Learning', description: 'Digital learning achievements' },
    { id: 'ol-3', label: 'Certification', domain: 'Other Learning', description: 'Industry certifications' }
  ],
  'HR': [
    { id: 'hr-1', label: 'Job Application', domain: 'HR', description: 'Employment application data' },
    { id: 'hr-2', label: 'Skills Profile', domain: 'HR', description: 'Employee skills and competencies' },
    { id: 'hr-3', label: 'Employment History', domain: 'HR', description: 'Work experience and employment records' }
  ]
};

export function TimelineView() {
  const [sourceElement, setSourceElement] = useState<TimelineElement | null>(null);
  const [destinationElement, setDestinationElement] = useState<TimelineElement | null>(null);
  const [recommendations, setRecommendations] = useState<TimelineRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<TimelineElement | null>(null);
  const [dragOverDomain, setDragOverDomain] = useState<DomainType | null>(null);

  const sourceDropRef = useRef<HTMLDivElement>(null);
  const destDropRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, element: TimelineElement) => {
    setDraggedElement(element);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', element.id);
  };

  const handleDragOver = (e: React.DragEvent, domain: DomainType) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDomain(domain);
  };

  const handleDragLeave = () => {
    setDragOverDomain(null);
  };

  const handleDrop = (e: React.DragEvent, target: 'source' | 'destination') => {
    e.preventDefault();
    setDragOverDomain(null);

    if (!draggedElement) return;

    if (target === 'source') {
      setSourceElement(draggedElement);
    } else {
      setDestinationElement(draggedElement);
    }

    setDraggedElement(null);
  };

  const handleGetRecommendations = async () => {
    if (!sourceElement || !destinationElement) {
      setError('Please select both source and destination elements');
      return;
    }

    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const result = await getSpecificationRecommendations(sourceElement, destinationElement);
      setRecommendations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = (type: 'source' | 'destination') => {
    if (type === 'source') {
      setSourceElement(null);
    } else {
      setDestinationElement(null);
    }
    setRecommendations(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Usage Timeline</h2>
        </div>
        <p className="text-slate-600 mb-6">
          Drag and drop elements between domains to see recommended interoperability specifications for data transfer scenarios.
        </p>

        {/* Drop Zones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Source Drop Zone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Source
            </label>
            <div
              ref={sourceDropRef}
              onDragOver={(e) => handleDragOver(e, sourceElement?.domain || 'K12')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'source')}
              className={`min-h-[120px] p-4 rounded-lg border-2 border-dashed transition-all ${
                sourceElement
                  ? 'border-slate-300 bg-slate-50'
                  : dragOverDomain && !sourceElement
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {sourceElement ? (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{DOMAIN_ICONS[sourceElement.domain]}</span>
                      <span className="font-semibold text-slate-900">{sourceElement.label}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border ${DOMAIN_COLORS[sourceElement.domain]}`}>
                      {sourceElement.domain}
                    </span>
                    {sourceElement.description && (
                      <p className="text-sm text-slate-600 mt-2">{sourceElement.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => clearSelection('source')}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <p className="text-sm">Drop source element here</p>
                </div>
              )}
            </div>
          </div>

          {/* Destination Drop Zone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Destination
            </label>
            <div
              ref={destDropRef}
              onDragOver={(e) => handleDragOver(e, destinationElement?.domain || 'K12')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'destination')}
              className={`min-h-[120px] p-4 rounded-lg border-2 border-dashed transition-all ${
                destinationElement
                  ? 'border-slate-300 bg-slate-50'
                  : dragOverDomain && !destinationElement
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {destinationElement ? (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{DOMAIN_ICONS[destinationElement.domain]}</span>
                      <span className="font-semibold text-slate-900">{destinationElement.label}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border ${DOMAIN_COLORS[destinationElement.domain]}`}>
                      {destinationElement.domain}
                    </span>
                    {destinationElement.description && (
                      <p className="text-sm text-slate-600 mt-2">{destinationElement.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => clearSelection('destination')}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <p className="text-sm">Drop destination element here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Get Recommendations Button */}
        <button
          onClick={handleGetRecommendations}
          disabled={loading || !sourceElement || !destinationElement}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Getting Recommendations...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Get Specification Recommendations
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

      {/* Element Library */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Element Library</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(PREBUILT_ELEMENTS) as DomainType[]).map((domain) => (
            <div key={domain} className="space-y-2">
              <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <span>{DOMAIN_ICONS[domain]}</span>
                {domain}
              </h4>
              <div className="space-y-2">
                {PREBUILT_ELEMENTS[domain].map((element) => (
                  <div
                    key={element.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element)}
                    className={`p-3 rounded-lg border-2 cursor-move transition-all hover:shadow-md ${DOMAIN_COLORS[domain]}`}
                  >
                    <div className="font-medium text-sm">{element.label}</div>
                    {element.description && (
                      <div className="text-xs text-slate-600 mt-1">{element.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Display */}
      {recommendations && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Recommended Specifications
            </h3>
            <p className="text-slate-700 leading-relaxed mb-2">{recommendations.summary}</p>
            <p className="text-sm text-slate-600">{recommendations.explanation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.recommendations.map((rec, idx) => {
              const spec = specifications.find(s => s.id === rec.specId);
              return (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900">{rec.specName}</h4>
                      <span className="text-xs text-slate-600">{rec.organization}</span>
                    </div>
                    {spec && (
                      <a
                        href={spec.specUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        View Spec
                      </a>
                    )}
                  </div>
                  <div className="space-y-2 mt-3">
                    <div>
                      <p className="text-xs font-medium text-slate-700 mb-1">Reason:</p>
                      <p className="text-sm text-slate-600">{rec.reason}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-700 mb-1">Use Case:</p>
                      <p className="text-sm text-slate-600">{rec.useCase}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

