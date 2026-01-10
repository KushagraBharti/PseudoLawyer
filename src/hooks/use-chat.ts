'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Message } from '@/types/database';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseChatOptions {
    negotiationId: string;
}

// Check if message should trigger AI response
function shouldTriggerAI(content: string): boolean {
    const lowerContent = content.toLowerCase();

    // Trigger on @sudo, @ai, or direct questions to Sudo
    const triggers = [
        '@sudo',
        '@ai',
        'sudo,',
        'hey sudo',
        'hi sudo',
        'sudo help',
        'sudo?',
    ];

    return triggers.some(trigger => lowerContent.includes(trigger));
}

export function useChat({ negotiationId }: UseChatOptions) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        let channel: RealtimeChannel;

        // Fetch initial messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    *,
                    sender:profiles(id, full_name, email)
                `)
                .eq('negotiation_id', negotiationId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching messages:', error);
            } else {
                setMessages(data || []);
            }
            setLoading(false);
        };

        fetchMessages();

        // Subscribe to new messages
        channel = supabase
            .channel(`messages:${negotiationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `negotiation_id=eq.${negotiationId}`,
                },
                async (payload) => {
                    // Fetch the full message with sender info
                    const { data } = await supabase
                        .from('messages')
                        .select(`
                            *,
                            sender:profiles(id, full_name, email)
                        `)
                        .eq('id', payload.new.id)
                        .single();

                    if (data) {
                        setMessages((prev) => [...prev, data]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [negotiationId]);

    // Send a regular message (no AI trigger)
    const sendMessage = useCallback(
        async (content: string, senderId: string) => {
            if (!content.trim()) return;

            setSending(true);
            const supabase = createClient();

            try {
                // Send user message
                const { error: msgError } = await supabase.from('messages').insert({
                    negotiation_id: negotiationId,
                    sender_id: senderId,
                    sender_type: 'user',
                    content: content.trim(),
                    metadata: {},
                });

                if (msgError) throw msgError;

                // Only trigger AI if message contains @sudo or similar
                if (shouldTriggerAI(content)) {
                    setAiLoading(true);
                    try {
                        const response = await fetch('/api/chat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                negotiationId,
                                message: content.trim(),
                                senderId,
                            }),
                        });

                        if (!response.ok) {
                            console.error('Failed to get AI response');
                        }
                    } finally {
                        setAiLoading(false);
                    }
                }
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setSending(false);
            }
        },
        [negotiationId]
    );

    // Explicitly ask Sudo for input (button click)
    const askSudo = useCallback(
        async (senderId: string, context?: string) => {
            setAiLoading(true);
            const supabase = createClient();

            try {
                // Optionally add a system message showing user asked for help
                if (context) {
                    await supabase.from('messages').insert({
                        negotiation_id: negotiationId,
                        sender_id: senderId,
                        sender_type: 'user',
                        content: `@Sudo ${context}`,
                        metadata: { isAskSudo: true },
                    });
                }

                // Trigger AI response
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        negotiationId,
                        message: context || 'Please provide your input on our discussion so far.',
                        senderId,
                        explicitAsk: true,
                    }),
                });

                if (!response.ok) {
                    console.error('Failed to get AI response');
                }
            } catch (error) {
                console.error('Error asking Sudo:', error);
            } finally {
                setAiLoading(false);
            }
        },
        [negotiationId]
    );

    return { messages, loading, sending, aiLoading, sendMessage, askSudo };
}
