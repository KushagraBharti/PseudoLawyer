'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useChat } from '@/hooks/use-chat';
import { Navbar } from '@/components/navigation/Navbar';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Negotiation, Participant, Message } from '@/types/database';
import {
    Send,
    ArrowLeft,
    Sparkles,
    User,
    CheckCircle2,
    FileText,
    X,
    MessageCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NegotiationChatPage() {
    const params = useParams();
    const router = useRouter();
    const { user, profile } = useAuth();
    const negotiationId = params.id as string;

    const { messages, loading: messagesLoading, sending, aiLoading, sendMessage, askSudo } = useChat({ negotiationId });

    const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [finalizing, setFinalizing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNegotiation = async () => {
            const supabase = createClient();

            const { data: neg, error } = await supabase
                .from('negotiations')
                .select(`
                    *,
                    template:templates(*)
                `)
                .eq('id', negotiationId)
                .single();

            if (error) {
                console.error('Error fetching negotiation:', error);
                router.push('/negotiations');
                return;
            }

            setNegotiation(neg);

            // Fetch participants
            const { data: parts } = await supabase
                .from('participants')
                .select(`
                    *,
                    profile:profiles(*)
                `)
                .eq('negotiation_id', negotiationId);

            setParticipants(parts || []);
            setLoading(false);
        };

        if (negotiationId) {
            fetchNegotiation();
        }
    }, [negotiationId, router]);

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !user) return;

        const text = message;
        setMessage('');
        await sendMessage(text, user.id);
    };

    const handleAskSudo = async () => {
        if (!user) return;
        await askSudo(user.id, 'What are your thoughts on our discussion so far? Any suggestions?');
    };

    const handleFinalize = async () => {
        if (!negotiation || !user) return;

        setFinalizing(true);
        const supabase = createClient();

        try {
            // Call API to generate LLM contract
            const response = await fetch('/api/contract/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ negotiationId }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate contract');
            }

            const { contractId } = await response.json();

            // Update negotiation status
            await supabase
                .from('negotiations')
                .update({ status: 'completed' })
                .eq('id', negotiationId);

            setShowFinalizeModal(false);
            router.push(`/contracts/${contractId}`);
        } catch (error) {
            console.error('Error finalizing:', error);
            setFinalizing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 flex">
                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => router.push('/negotiations')}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-white">{negotiation?.title}</h1>
                                <p className="text-white/60 text-sm">
                                    {(negotiation as any)?.template?.name || 'Custom Contract'}
                                </p>
                            </div>
                        </div>
                        {negotiation?.status === 'active' && (
                            <Button size="sm" onClick={() => setShowFinalizeModal(true)}>
                                <CheckCircle2 className="w-4 h-4" />
                                Finalize Contract
                            </Button>
                        )}
                    </div>

                    {/* Participants */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {participants.map((p) => (
                            <div
                                key={p.id}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
                            >
                                <div className={`w-2 h-2 rounded-full ${p.status === 'joined' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                                <span className="text-sm text-white/80">
                                    {(p as any).profile?.full_name || p.email}
                                </span>
                                <span className="text-xs text-white/40">({p.role})</span>
                            </div>
                        ))}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${aiLoading ? 'bg-primary-500/20 border-primary-500/40 animate-pulse' : 'bg-primary-500/10 border-primary-500/20'}`}>
                            <Sparkles className={`w-3 h-3 text-primary-400 ${aiLoading ? 'animate-spin' : ''}`} />
                            <span className="text-sm text-primary-400">
                                {aiLoading ? 'Sudo is thinking...' : 'Sudo (AI Mediator)'}
                            </span>
                        </div>
                    </div>

                    {/* Tip Banner */}
                    <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 flex-shrink-0" />
                        <span>
                            <strong>Tip:</strong> Type <code className="bg-blue-500/20 px-1 rounded">@Sudo</code> in your message to get AI input, or click "Ask Sudo" below.
                        </span>
                    </div>

                    {/* Messages */}
                    <Card className="flex-1 flex flex-col overflow-hidden">
                        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messagesLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center py-12 text-white/40">
                                    Starting conversation...
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <MessageBubble
                                        key={msg.id}
                                        message={msg}
                                        isOwn={msg.sender_id === user?.id}
                                    />
                                ))
                            )}
                            {aiLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500">
                                        <Sparkles className="w-4 h-4 text-white animate-pulse" />
                                    </div>
                                    <div className="px-4 py-2.5 rounded-2xl bg-primary-500/10 border border-primary-500/20">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </CardContent>

                        {/* Input */}
                        {negotiation?.status === 'active' && (
                            <div className="p-4 border-t border-white/10">
                                <form onSubmit={handleSend} className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Type your message... (use @Sudo to ask AI)"
                                            disabled={sending}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleAskSudo}
                                        disabled={aiLoading || sending}
                                        title="Ask Sudo for input"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                    </Button>
                                    <Button type="submit" loading={sending} disabled={!message.trim()}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        )}

                        {negotiation?.status === 'completed' && (
                            <div className="p-4 border-t border-white/10 text-center">
                                <p className="text-green-400 font-medium flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    This negotiation has been completed
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Finalize Modal */}
            {showFinalizeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md"
                    >
                        <Card>
                            <CardHeader className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Finalize Contract</h2>
                                <button onClick={() => setShowFinalizeModal(false)} className="text-white/40 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FileText className="w-5 h-5 text-primary-400" />
                                        <span className="font-semibold text-white">{negotiation?.title}</span>
                                    </div>
                                    <p className="text-sm text-white/60">
                                        Sudo will generate a complete legal contract based on your discussion.
                                    </p>
                                </div>
                                <p className="text-sm text-white/60">
                                    The AI will draft professional legal language using your negotiated terms. You can download the final document after generation.
                                </p>
                                <div className="flex gap-3">
                                    <Button variant="secondary" onClick={() => setShowFinalizeModal(false)} className="flex-1" disabled={finalizing}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleFinalize} className="flex-1" loading={finalizing}>
                                        <Sparkles className="w-4 h-4" />
                                        Generate Contract
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
    const isAI = message.sender_type === 'ai';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
        >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAI
                ? 'bg-gradient-to-br from-primary-500 to-accent-500'
                : isOwn
                    ? 'bg-primary-500'
                    : 'bg-white/10'
                }`}>
                {isAI ? (
                    <Sparkles className="w-4 h-4 text-white" />
                ) : (
                    <User className="w-4 h-4 text-white" />
                )}
            </div>

            {/* Message */}
            <div className={`max-w-[70%] ${isOwn ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${isAI ? 'text-primary-400' : 'text-white/60'}`}>
                        {isAI ? 'Sudo' : (message as any).sender?.full_name || 'User'}
                    </span>
                    <span className="text-xs text-white/40">
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                </div>
                <div className={`inline-block px-4 py-2.5 rounded-2xl ${isAI
                    ? 'bg-primary-500/10 border border-primary-500/20 text-white'
                    : isOwn
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/10 text-white'
                    }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
            </div>
        </motion.div>
    );
}
