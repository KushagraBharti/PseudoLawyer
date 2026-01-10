'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Message } from '@/types/database';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseChatOptions {
    negotiationId: string;
}

export function useChat({ negotiationId }: UseChatOptions) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

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

                // Trigger AI response via API
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
                    throw new Error('Failed to get AI response');
                }
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setSending(false);
            }
        },
        [negotiationId]
    );

    return { messages, loading, sending, sendMessage };
}
