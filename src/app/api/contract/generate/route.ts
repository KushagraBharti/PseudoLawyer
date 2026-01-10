import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { openrouter } from '@/lib/openrouter';

const CONTRACT_GENERATION_PROMPT = `You are an expert legal contract drafter. Based on the negotiation details provided, generate a complete, professional legal contract.

Your contract should:
1. Use proper legal language and formatting
2. Include all standard contract sections (parties, recitals, definitions, terms, etc.)
3. Be comprehensive but clear
4. Include appropriate legal clauses for the contract type
5. Use the actual names and details of the parties involved
6. Incorporate any specific terms discussed in the negotiation

Format the contract as a formal legal document with proper sections, numbering, and professional language.`;

export async function POST(request: NextRequest) {
    try {
        const { negotiationId } = await request.json();

        if (!negotiationId) {
            return NextResponse.json(
                { error: 'Missing negotiation ID' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Get negotiation details
        const { data: negotiation, error: negError } = await supabase
            .from('negotiations')
            .select(`
                *,
                template:templates(name, content)
            `)
            .eq('id', negotiationId)
            .single();

        if (negError || !negotiation) {
            return NextResponse.json(
                { error: 'Negotiation not found' },
                { status: 404 }
            );
        }

        // Get participants
        const { data: participants } = await supabase
            .from('participants')
            .select(`
                *,
                profile:profiles(full_name, email)
            `)
            .eq('negotiation_id', negotiationId);

        // Get conversation history for context
        const { data: messages } = await supabase
            .from('messages')
            .select('content, sender_type, sender:profiles(full_name)')
            .eq('negotiation_id', negotiationId)
            .order('created_at', { ascending: true })
            .limit(50);

        // Build the prompt for contract generation
        const templateInfo = (negotiation as any).template;
        const partiesList = (participants || []).map((p: any) => ({
            name: p.profile?.full_name || p.email?.split('@')[0] || 'Unknown',
            email: p.profile?.email || p.email,
            role: p.role === 'initiator' ? 'First Party' : 'Second Party',
        }));

        // Summarize the conversation
        const conversationSummary = (messages || []).map((m: any) => {
            const sender = m.sender_type === 'ai' ? 'Mediator' : (m.sender?.full_name || 'Participant');
            return `${sender}: ${m.content}`;
        }).join('\n');

        const contractPrompt = `Generate a complete legal contract with the following details:

CONTRACT TYPE: ${templateInfo?.name || 'General Agreement'}
TITLE: ${negotiation.title}

PARTIES:
${partiesList.map((p, i) => `${i + 1}. ${p.name} (${p.email}) - ${p.role}`).join('\n')}

TEMPLATE STRUCTURE:
${templateInfo?.content ? JSON.stringify(templateInfo.content, null, 2) : 'Standard contract format'}

NEGOTIATION DISCUSSION SUMMARY:
${conversationSummary || 'No specific terms discussed yet.'}

AGREED TERMS (if any):
${JSON.stringify(negotiation.contract_data?.agreedTerms || {}, null, 2)}

Please generate a complete, professional legal contract that:
1. Has a proper title and date
2. Clearly identifies all parties with their full details
3. Includes recitals/background section
4. Has numbered sections with clear terms
5. Includes standard legal clauses (confidentiality, governing law, dispute resolution, etc.)
6. Has signature blocks for all parties
7. Uses the specific terms and agreements from the negotiation discussion

Generate the full contract text now:`;

        // Call OpenRouter to generate the contract
        const response = await openrouter.chat.completions.create({
            model: 'anthropic/claude-3.5-sonnet',
            messages: [
                { role: 'system', content: CONTRACT_GENERATION_PROMPT },
                { role: 'user', content: contractPrompt }
            ],
            max_tokens: 4000,
            temperature: 0.3, // Lower temperature for more consistent legal language
        });

        const generatedContract = response.choices[0]?.message?.content || 'Contract generation failed.';

        // Create the contract record
        const { data: contract, error: contractError } = await supabase
            .from('contracts')
            .insert({
                negotiation_id: negotiationId,
                title: negotiation.title,
                final_content: {
                    templateName: templateInfo?.name || 'Custom Contract',
                    parties: partiesList,
                    terms: negotiation.contract_data?.agreedTerms || {},
                    generatedText: generatedContract,
                    generatedAt: new Date().toISOString(),
                },
                pdf_path: null,
                signed_by: [],
            })
            .select()
            .single();

        if (contractError) {
            console.error('Error creating contract:', contractError);
            return NextResponse.json(
                { error: 'Failed to save contract' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            contractId: contract.id,
            success: true
        });

    } catch (error) {
        console.error('Contract generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate contract' },
            { status: 500 }
        );
    }
}
