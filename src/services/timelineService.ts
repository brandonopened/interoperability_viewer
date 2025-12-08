import OpenAI from 'openai';
import { specifications } from '../data/specifications';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export type DomainType = 'K12' | 'Higher Ed' | 'Other Learning' | 'HR';

export interface TimelineElement {
  id: string;
  label: string;
  domain: DomainType;
  description?: string;
}

export interface SpecificationRecommendation {
  specId: string;
  specName: string;
  organization: string;
  reason: string;
  useCase: string;
}

export interface TimelineRecommendation {
  recommendations: SpecificationRecommendation[];
  summary: string;
  explanation: string;
}

export async function getSpecificationRecommendations(
  source: TimelineElement,
  destination: TimelineElement
): Promise<TimelineRecommendation> {
  const availableSpecs = specifications.map(spec => ({
    id: spec.id,
    name: spec.name,
    fullName: spec.fullName,
    organization: spec.organization,
    description: spec.description,
    terms: spec.terms.map(t => t.name).join(', ')
  }));

  const prompt = `You are an expert in educational and credentialing data standards interoperability. 

A user wants to transfer data from "${source.label}" in the ${source.domain} domain to "${destination.label}" in the ${destination.domain} domain.

Available specifications:
${availableSpecs.map(s => `- ${s.fullName} (${s.organization}): ${s.description}`).join('\n')}

Based on this data transfer scenario, recommend which interoperability specifications should be used and explain how they would be applied. Consider:
1. Which specifications are most appropriate for this data transfer
2. How the specifications would work together
3. What specific use cases they address
4. Any mapping or transformation considerations

Provide your response in the following JSON format:
{
  "recommendations": [
    {
      "specId": "spec-id-from-list",
      "specName": "Short name",
      "organization": "Organization name",
      "reason": "Why this spec is recommended",
      "useCase": "Specific use case for this scenario"
    }
  ],
  "summary": "A 2-3 sentence summary of the recommended approach",
  "explanation": "A detailed explanation of how these specifications work together for this specific data transfer scenario"
}

Example scenario: "High School Transcript to College" would recommend CLR, Open Badges, CTDL, and CASE for course-skills mapping.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in educational technology standards, credentialing systems, and data interoperability. Provide detailed, technical recommendations in valid JSON format.'
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

    return JSON.parse(content) as TimelineRecommendation;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw new Error('Failed to get recommendations. Please check your API key and try again.');
  }
}

