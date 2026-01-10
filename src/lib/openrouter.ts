import OpenAI from 'openai';

// OpenRouter client using OpenAI SDK (compatible API)
export const openrouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

// System prompt for the AI mediator
const MEDIATOR_SYSTEM_PROMPT = `You are Sudo, an AI contract negotiation mediator. Your role is to:

1. **Facilitate Discussion**: Help both parties communicate clearly and understand each other's positions.

2. **Explain Legal Terms**: When contract terms come up, explain them in plain, accessible language.

3. **Suggest Compromises**: When parties disagree, propose fair middle-ground solutions.

4. **Track Progress**: Keep track of what's been agreed upon and what's still being negotiated.

5. **Draft Language**: Help write clear, professional contract language for agreed terms.

Guidelines:
- Be neutral and fair to both parties
- Keep responses concise but helpful (2-4 sentences typically)
- Ask clarifying questions when needed
- Summarize agreements when terms are settled
- Flag any concerning or unclear terms
- Use a friendly but professional tone

Current contract context will be provided. Focus on helping reach a fair agreement efficiently.`;

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface ContractContext {
    templateName: string;
    agreedTerms: Record<string, string>;
    disputedTerms: Record<string, { partyA: string; partyB: string }>;
    participants: { name: string; role: string }[];
}

export async function getAIResponse(
    messages: ChatMessage[],
    contractContext: ContractContext,
    senderName: string
): Promise<string> {
    const contextMessage = `
Contract: ${contractContext.templateName}
Participants: ${contractContext.participants.map(p => `${p.name} (${p.role})`).join(', ')}
Agreed Terms: ${Object.keys(contractContext.agreedTerms).length > 0
            ? Object.entries(contractContext.agreedTerms).map(([k, v]) => `${k}: ${v}`).join('; ')
            : 'None yet'}
Open Items: ${Object.keys(contractContext.disputedTerms).length > 0
            ? Object.keys(contractContext.disputedTerms).join(', ')
            : 'None'}

Message from ${senderName}:`;

    const fullMessages: ChatMessage[] = [
        { role: 'system', content: MEDIATOR_SYSTEM_PROMPT },
        ...messages.slice(-10).map(m => ({
            ...m,
            content: m.role === 'user' ? `${contextMessage}\n${m.content}` : m.content
        })),
    ];

    try {
        const response = await openrouter.chat.completions.create({
            model: 'anthropic/claude-3.5-sonnet', // Using Claude 3.5 Sonnet via OpenRouter
            messages: fullMessages,
            max_tokens: 500,
            temperature: 0.7,
        });

        return response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
        console.error('OpenRouter API error:', error);
        throw new Error('Failed to get AI response');
    }
}

// Function to generate a contract summary
export async function generateContractSummary(
    contractContext: ContractContext
): Promise<string> {
    const prompt = `Based on the following negotiation context, generate a brief summary of the current contract state:

Contract Type: ${contractContext.templateName}
Participants: ${contractContext.participants.map(p => `${p.name} (${p.role})`).join(', ')}

Agreed Terms:
${Object.entries(contractContext.agreedTerms).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Items Still Under Discussion:
${Object.entries(contractContext.disputedTerms).map(([k, v]) => `- ${k}: Party A wants "${v.partyA}", Party B wants "${v.partyB}"`).join('\n')}

Provide a 2-3 sentence summary of the negotiation status.`;

    const response = await openrouter.chat.completions.create({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
            { role: 'system', content: 'You are a contract summarization assistant. Be concise and clear.' },
            { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.5,
    });

    return response.choices[0]?.message?.content || 'Summary unavailable.';
}
