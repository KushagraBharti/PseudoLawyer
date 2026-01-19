import OpenAI from 'openai';

// OpenRouter client using OpenAI SDK (compatible API)
export const openrouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});

// Enhanced system prompt for group chat mediation
const MEDIATOR_SYSTEM_PROMPT = `You are **Sudo**, an AI contract negotiation mediator facilitating a real-time group chat between two parties. You are NOT chatting with one person - this is a **three-way conversation** between you and two human participants negotiating a contract together.

## Your Role
You are a neutral, professional mediator helping both parties reach a fair agreement. Think of yourself as a skilled negotiator who ensures both sides are heard and helps find common ground.

## Chat Format
Messages will be sent to you in a structured JSON format:
\`\`\`
{
  "conversation": [
    {"from": "Party Name", "role": "initiator|party", "message": "..."},
    {"from": "Sudo", "role": "mediator", "message": "..."},
    ...
  ],
  "latest_message": {"from": "Party Name", "role": "...", "message": "..."},
  "contract": {...}
}
\`\`\`

The "initiator" is the party who started the negotiation. The "party" is the invited counterparty.

## Your Responsibilities
1. **Address Both Parties**: When responding, consider both participants. Use their names when appropriate to make the conversation feel personal.

2. **Facilitate Discussion**: Help both parties express their needs clearly. When one party speaks, consider how it affects the other.

3. **Propose Solutions**: When there's disagreement, suggest compromises. Example: "I hear that Alex wants X and Jordan prefers Y. What if we considered Z as a middle ground?"

4. **Explain Terms**: If contract terms are mentioned, explain them in plain language so both parties understand.

5. **Track Agreements**: When parties agree on something, acknowledge it clearly: "Great, you've both agreed on [term]. Let me note that."

6. **Drive Progress**: Don't just respond - guide the negotiation forward. Ask relevant questions, suggest next topics to discuss.

7. **Stay Neutral**: Never favor one party over another. Be fair and balanced.

## Response Guidelines
- Keep responses conversational but professional (2-5 sentences typically)
- Address parties by name when it makes sense
- Use clear, accessible language (avoid legal jargon unless explaining it)
- Be warm and encouraging while remaining professional
- When parties seem to agree, confirm and move to the next topic
- If discussion stalls, suggest a new angle or topic

## Contract Context
You'll receive information about:
- The contract template being negotiated
- Both parties and their roles
- Terms already agreed upon
- Terms still under discussion

Use this context to give informed, relevant responses.

Remember: You're facilitating a LIVE group conversation. Both humans can see everything you say. Make them feel heard and guide them toward a successful agreement.`;

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface MessageWithSender {
    senderName: string;
    senderRole: string; // 'initiator' | 'party' | 'ai'
    content: string;
    timestamp?: string;
}

export interface ContractContext {
    templateName: string;
    title: string;
    agreedTerms: Record<string, string>;
    disputedTerms: Record<string, { partyA: string; partyB: string }>;
    participants: { name: string; email: string; role: string }[];
}

export async function getAIResponse(
    messages: MessageWithSender[],
    contractContext: ContractContext,
    latestMessage: MessageWithSender
): Promise<string> {
    // Build structured conversation history
    const conversationHistory = messages.map(m => ({
        from: m.senderRole === 'ai' ? 'Sudo' : m.senderName,
        role: m.senderRole === 'ai' ? 'mediator' : m.senderRole,
        message: m.content
    }));

    // Build the structured prompt
    const structuredPrompt = JSON.stringify({
        conversation: conversationHistory,
        latest_message: {
            from: latestMessage.senderName,
            role: latestMessage.senderRole,
            message: latestMessage.content
        },
        contract: {
            type: contractContext.templateName,
            title: contractContext.title,
            parties: contractContext.participants.map(p => ({
                name: p.name,
                email: p.email,
                role: p.role
            })),
            agreed_terms: Object.keys(contractContext.agreedTerms).length > 0
                ? contractContext.agreedTerms
                : null,
            open_items: Object.keys(contractContext.disputedTerms).length > 0
                ? contractContext.disputedTerms
                : null
        }
    }, null, 2);

    const userPrompt = `Here is the current conversation state and the latest message to respond to:

${structuredPrompt}

Respond as Sudo the mediator. Address the latest message while keeping the broader negotiation context in mind. Remember both parties can see your response.`;

    try {
        const response = await openrouter.chat.completions.create({
            model: 'anthropic/claude-3.5-sonnet',
            messages: [
                { role: 'system', content: MEDIATOR_SYSTEM_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            max_tokens: 600,
            temperature: 0.75,
        });

        return response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
        console.error('OpenRouter API error:', error);
        throw new Error('Failed to get AI response');
    }
}

// Generate welcome message for a new negotiation
export async function generateWelcomeMessage(contractContext: ContractContext): Promise<string> {
    const parties = contractContext.participants;
    const initiator = parties.find(p => p.role === 'initiator');
    const otherParty = parties.find(p => p.role === 'party');

    const prompt = `Generate a warm, professional welcome message for a new contract negotiation.

Contract Type: ${contractContext.templateName}
Title: ${contractContext.title}
Initiator: ${initiator?.name || 'Party 1'}
Other Party: ${otherParty?.name || otherParty?.email || 'Party 2'}

The message should:
1. Greet both parties by name (or email if name not available)
2. Briefly explain your role as Sudo the mediator
3. Mention the contract type being negotiated
4. Invite them to begin discussing their needs/expectations
5. Be warm, encouraging, and professional

Keep it to 3-4 sentences.`;

    try {
        const response = await openrouter.chat.completions.create({
            model: 'anthropic/claude-3.5-sonnet',
            messages: [
                { role: 'system', content: 'You are Sudo, a friendly AI contract negotiation mediator. Generate a welcoming first message for a negotiation chat.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 200,
            temperature: 0.8,
        });

        return response.choices[0]?.message?.content || getDefaultWelcomeMessage(contractContext);
    } catch {
        return getDefaultWelcomeMessage(contractContext);
    }
}

function getDefaultWelcomeMessage(ctx: ContractContext): string {
    const initiator = ctx.participants.find(p => p.role === 'initiator');
    const party = ctx.participants.find(p => p.role === 'party');
    return `Welcome to your ${ctx.templateName} negotiation! I'm Sudo, your AI mediator. I'll help ${initiator?.name || 'you'} and ${party?.name || party?.email || 'your counterparty'} discuss terms and reach a fair agreement. Let's start by having each of you share your main goals for this contract.`;
}

// Function to generate a contract summary
export async function generateContractSummary(contractContext: ContractContext): Promise<string> {
    const prompt = `Summarize the current state of this contract negotiation:

Contract: ${contractContext.templateName} - "${contractContext.title}"
Parties: ${contractContext.participants.map(p => `${p.name} (${p.role})`).join(', ')}

Agreed Terms:
${Object.entries(contractContext.agreedTerms).map(([k, v]) => `- ${k}: ${v}`).join('\n') || 'None yet'}

Items Under Discussion:
${Object.entries(contractContext.disputedTerms).map(([k, v]) => `- ${k}: One party wants "${v.partyA}", the other wants "${v.partyB}"`).join('\n') || 'None'}

Provide a 2-3 sentence summary of where the negotiation stands.`;

    const response = await openrouter.chat.completions.create({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
            { role: 'system', content: 'You are a contract summarization assistant. Be concise and neutral.' },
            { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.5,
    });

    return response.choices[0]?.message?.content || 'Summary unavailable.';
}
