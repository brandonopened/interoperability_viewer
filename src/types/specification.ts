export interface Specification {
  id: string;
  name: string;
  fullName: string;
  version: string;
  organization: '1EdTech' | 'Credential Engine' | 'IEEE' | 'HR Open';
  description: string;
  specUrl: string;
  schema: SchemaDefinition;
  example: string;
  diagram: string;
  terms: SpecTerm[];
}

export interface SchemaDefinition {
  type: 'openapi' | 'json-schema' | 'xml-schema';
  content: any;
}

export interface SpecTerm {
  name: string;
  description: string;
  type?: string;
  relationships?: string[];
}

export type ViewMode = 'overview' | 'schema' | 'example' | 'diagram';
