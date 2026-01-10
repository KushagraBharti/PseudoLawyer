import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAIResponse, MessageWithSender, ContractContext } from '@/lib/openrouter';

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

        // Get participants with their profiles
        const { data: participants } = await supabase
            .from('participants')
            .select(`
                *,
                profile:profiles(id, full_name, email)
            `)
            .eq('negotiation_id', negotiationId);

        // Get sender info
        const { data: senderProfile } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .eq('id', senderId)
            .single();

        // Find sender's role in this negotiation
        const senderParticipant = participants?.find(
            (p: any) => p.user_id === senderId || p.profile?.id === senderId
        );
        const senderRole = senderParticipant?.role || 'party';

        // Get recent messages with sender info
        const { data: recentMessages } = await supabase
            .from('messages')
            .select(`
                *,
                sender:profiles(id, full_name, email)
            `)
            .eq('negotiation_id', negotiationId)
            .order('created_at', { ascending: true })
            .limit(20);

        // Build participant list for context
        const participantList = (participants || []).map((p: any) => ({
            name: p.profile?.full_name || p.email?.split('@')[0] || 'Unknown',
            email: p.profile?.email || p.email,
            role: p.role,
        }));

        // Prepare contract context
        const contractContext: ContractContext = {
            templateName: (negotiation as any).template?.name || 'Custom Contract',
            title: negotiation.title,
            agreedTerms: negotiation.contract_data?.agreedTerms || {},
            disputedTerms: negotiation.contract_data?.disputedTerms || {},
            participants: participantList,
        };

        // Convert messages to structured format with sender info
        const messageHistory: MessageWithSender[] = (recentMessages || []).map((msg: any) => {
            let senderName = 'Unknown';
            let msgSenderRole = 'party';

            if (msg.sender_type === 'ai') {
                senderName = 'Sudo';
                msgSenderRole = 'ai';
            } else if (msg.sender) {
                senderName = msg.sender.full_name || msg.sender.email?.split('@')[0] || 'Unknown';
                // Find this sender's role
                const msgParticipant = participants?.find(
                    (p: any) => p.user_id === msg.sender_id || p.profile?.id === msg.sender_id
                );
                msgSenderRole = msgParticipant?.role || 'party';
            }

            return {
                senderName,
                senderRole: msgSenderRole,
                content: msg.content,
                timestamp: msg.created_at,
            };
        });

        // Prepare latest message
        const latestMessage: MessageWithSender = {
            senderName: senderProfile?.full_name || senderProfile?.email?.split('@')[0] || 'User',
            senderRole: senderRole,
            content: message,
        };

        // Get AI response with full context
        const aiResponse = await getAIResponse(
            messageHistory,
            contractContext,
            latestMessage
        );

        // Save AI message to database
        const { error: insertError } = await supabase.from('messages').insert({
            negotiation_id: negotiationId,
            sender_id: null,
            sender_type: 'ai',
            content: aiResponse,
            metadata: {
                respondingTo: senderId,
                participantCount: participants?.length || 0,
            },
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
