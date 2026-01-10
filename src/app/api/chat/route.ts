import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAIResponse, ChatMessage, ContractContext } from '@/lib/openrouter';

export async function POST(request: NextRequest) {
    try {
        const { negotiationId, message, senderId } = await request.json();

        if (!negotiationId || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Get negotiation details
        const { data: negotiation, error: negError } = await supabase
            .from('negotiations')
            .select(`
        *,
        template:templates(name)
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

        // Get sender info
        const { data: senderProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', senderId)
            .single();

        // Get recent messages for context
        const { data: recentMessages } = await supabase
            .from('messages')
            .select('*')
            .eq('negotiation_id', negotiationId)
            .order('created_at', { ascending: false })
            .limit(10);

        // Prepare context for AI
        const contractContext: ContractContext = {
            templateName: (negotiation as any).template?.name || 'Custom Contract',
            agreedTerms: negotiation.contract_data?.agreedTerms || {},
            disputedTerms: negotiation.contract_data?.disputedTerms || {},
            participants: (participants || []).map((p: any) => ({
                name: p.profile?.full_name || p.email,
                role: p.role,
            })),
        };

        // Convert messages to chat format
        const chatMessages: ChatMessage[] = (recentMessages || [])
            .reverse()
            .map((msg) => ({
                role: msg.sender_type === 'ai' ? 'assistant' as const : 'user' as const,
                content: msg.content,
            }));

        // Add the new message
        chatMessages.push({
            role: 'user',
            content: message,
        });

        // Get AI response
        const aiResponse = await getAIResponse(
            chatMessages,
            contractContext,
            senderProfile?.full_name || 'User'
        );

        // Save AI message to database
        const { error: insertError } = await supabase.from('messages').insert({
            negotiation_id: negotiationId,
            sender_id: null,
            sender_type: 'ai',
            content: aiResponse,
            metadata: {},
        });

        if (insertError) {
            console.error('Error saving AI message:', insertError);
        }

        return NextResponse.json({ response: aiResponse });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat message' },
            { status: 500 }
        );
    }
}
