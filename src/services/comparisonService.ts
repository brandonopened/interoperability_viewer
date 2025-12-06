import OpenAI from 'openai';
import type { Specification } from '../types/specification';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ComparisonResult {
  structuralSimilarities: string[];
  structuralDifferences: string[];
  vocabularyOverlap: string[];
  vocabularyUnique: {
    spec1: string[];
    spec2: string[];
  };
  useCaseSimilarities: string[];
  interoperabilityNotes: string[];
  summary: string;
}

export async function compareSpecifications(
  spec1: Specification,
  spec2: Specification
): Promise<ComparisonResult> {
  const prompt = `You are an expert in educational and credentialing data standards. Compare these two specifications in detail:

SPECIFICATION 1: ${spec1.fullName} (${spec1.organization})
Description: ${spec1.description}
Terms: ${spec1.terms.map(t => `${t.name} (${t.type}): ${t.description}`).join('\n')}

SPECIFICATION 2: ${spec2.fullName} (${spec2.organization})
Description: ${spec2.description}
Terms: ${spec2.terms.map(t => `${t.name} (${t.type}): ${t.description}`).join('\n')}

Provide a comprehensive comparison in the following JSON format:
{
  "structuralSimilarities": ["array of structural similarities between the two specifications"],
  "structuralDifferences": ["array of key structural differences"],
  "vocabularyOverlap": ["array of shared terms/concepts between both specifications"],
  "vocabularyUnique": {
    "spec1": ["terms unique to ${spec1.name}"],
    "spec2": ["terms unique to ${spec2.name}"]
  },
  "useCaseSimilarities": ["array of similar use cases both specifications address"],
  "interoperabilityNotes": ["array of notes about how these specifications could work together or map to each other"],
  "summary": "A concise 2-3 sentence summary of the comparison highlighting the key relationship between these specifications"
}

Be specific and technical. Focus on data structures, entity types, relationships, and practical implementation considerations.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in educational technology standards, credentialing systems, and data interoperability. Provide detailed, technical comparisons in valid JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(content) as ComparisonResult;
  } catch (error) {
    console.error('Error comparing specifications:', error);
    throw new Error('Failed to compare specifications. Please check your API key and try again.');
  }
}
