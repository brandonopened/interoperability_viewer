import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface SchemaViewerProps {
  schema: any;
}

export function SchemaViewer({ schema }: SchemaViewerProps) {
  return (
    <div className="bg-slate-900 rounded-lg p-6 overflow-auto max-h-[600px]">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Schema Definition</h3>
      {schema.content?.components?.schemas ? (
        <div className="space-y-4">
          {Object.entries(schema.content.components.schemas).map(([name, schemaDef]: [string, any]) => (
            <SchemaObject key={name} name={name} schema={schemaDef} level={0} />
          ))}
        </div>
      ) : (
        <pre className="text-sm text-slate-300 overflow-auto">
          {JSON.stringify(schema.content, null, 2)}
        </pre>
      )}
    </div>
  );
}

interface SchemaObjectProps {
  name: string;
  schema: any;
  level: number;
}

function SchemaObject({ name, schema, level }: SchemaObjectProps) {
  const [isExpanded, setIsExpanded] = useState(level < 1);
  const indent = level * 16;

  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop();
    return (
      <div style={{ marginLeft: `${indent}px` }} className="text-sm">
        <span className="text-blue-400">{name}</span>
        <span className="text-slate-500"> → </span>
        <span className="text-purple-400">{refName}</span>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: `${indent}px` }} className="text-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 hover:bg-slate-800 rounded px-1 transition-colors w-full text-left"
      >
        {schema.properties ? (
          isExpanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          )
        ) : (
          <span className="w-4" />
        )}
        <span className="text-emerald-400 font-medium">{name}</span>
        <span className="text-slate-500">:</span>
        <span className="text-amber-400 ml-1">{schema.type || 'object'}</span>
        {schema.format && <span className="text-slate-500 ml-1">({schema.format})</span>}
        {schema.required && <span className="text-red-400 ml-2 text-xs">required</span>}
      </button>

      {schema.description && (
        <div className="text-slate-400 text-xs mt-1 ml-5 italic">{schema.description}</div>
      )}

      {isExpanded && schema.properties && (
        <div className="mt-2 space-y-2">
          {Object.entries(schema.properties).map(([propName, propSchema]: [string, any]) => (
            <SchemaObject
              key={propName}
              name={propName}
              schema={{
                ...propSchema,
                required: schema.required?.includes(propName)
              }}
              level={level + 1}
            />
          ))}
        </div>
      )}

      {isExpanded && schema.items && (
        <div className="mt-2 ml-4">
          <span className="text-slate-500 text-xs">Array items:</span>
          <SchemaObject name="item" schema={schema.items} level={level + 1} />
        </div>
      )}
    </div>
  );
}
