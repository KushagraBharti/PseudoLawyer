'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
    MessageCircle,
    Users,
    Clock,
    Zap,
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
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Loading negotiation...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 py-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
                >
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/negotiations')}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                                {negotiation?.title}
                            </h1>
                            <div className="flex items-center gap-3 text-sm text-white/50">
                                <span className="flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5" />
                                    {(negotiation as any)?.template?.name || 'Custom Contract'}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-white/30" />
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {negotiation && formatDistanceToNow(new Date(negotiation.created_at), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                    </div>
                    {negotiation?.status === 'active' && (
                        <Button onClick={() => setShowFinalizeModal(true)}>
                            <CheckCircle2 className="w-4 h-4" />
                            Finalize Contract
                        </Button>
                    )}
                </motion.div>

                {/* Participants Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 mb-4 flex-wrap"
                >
                    {participants.map((p) => (
                        <div
                            key={p.id}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
                        >
                            <div className={`w-2 h-2 rounded-full ${p.status === 'joined' ? 'bg-success animate-pulse' : 'bg-warning'}`} />
                            <span className="text-sm text-white/80">
                                {(p as any).profile?.full_name || p.email}
                            </span>
                            <span className="text-xs text-white/40">({p.role})</span>
                        </div>
                    ))}
                    <div className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-full border
                        ${aiLoading
                            ? 'bg-gradient-to-r from-cyan/20 to-magenta/20 border-cyan/40'
                            : 'bg-gradient-to-r from-cyan/10 to-magenta/10 border-cyan/20'
                        }
                    `}>
                        <Sparkles className={`w-3.5 h-3.5 text-cyan ${aiLoading ? 'animate-spin' : ''}`} />
                        <span className="text-sm bg-gradient-to-r from-cyan to-magenta bg-clip-text text-transparent font-medium">
                            {aiLoading ? 'Sudo is thinking...' : 'Sudo (AI Mediator)'}
                        </span>
                    </div>
                </motion.div>

                {/* Tip Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4 p-4 rounded-xl bg-cyan/5 border border-cyan/20 flex items-start gap-3"
                >
                    <Zap className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-white/80">
                            <strong className="text-cyan">Pro Tip:</strong> Type{' '}
                            <code className="px-1.5 py-0.5 rounded bg-cyan/10 text-cyan font-mono text-xs">@Sudo</code>{' '}
                            in your message to get AI input, or click the sparkle button below.
                        </p>
                    </div>
                </motion.div>

                {/* Chat Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex-1 flex flex-col"
                >
                    <Card variant="elevated" className="flex-1 flex flex-col overflow-hidden">
                        {/* Messages */}
                        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                            {messagesLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="text-center py-12 text-white/40">
                                    <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                    <p>Starting conversation...</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => (
                                    <MessageBubble
                                        key={msg.id}
                                        message={msg}
                                        isOwn={msg.sender_id === user?.id}
                                        delay={index * 0.05}
                                    />
                                ))
                            )}

                            {/* AI Typing Indicator */}
                            <AnimatePresence>
                                {aiLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="flex gap-3"
                                    >
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan to-magenta shadow-glow-cyan shrink-0">
                                            <Sparkles className="w-5 h-5 text-white animate-pulse" />
                                        </div>
                                        <div className="message-ai rounded-2xl p-4">
                                            <div className="ai-typing">
                                                <span />
                                                <span />
                                                <span />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div ref={messagesEndRef} />
                        </CardContent>

                        {/* Input Area */}
                        {negotiation?.status === 'active' && (
                            <div className="p-4 border-t border-white/[0.06] bg-white/[0.02]">
                                <form onSubmit={handleSend} className="flex gap-3">
                                    <div className="flex-1">
                                        <input
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Type your message... (use @Sudo to ask AI)"
                                            disabled={sending}
                                            className="
                                                w-full px-4 py-3 rounded-xl
                                                bg-white/[0.03] border border-white/[0.08]
                                                text-white placeholder:text-white/30
                                                focus:outline-none focus:border-cyan/50 focus:bg-white/[0.05]
                                                transition-all duration-200
                                            "
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
                            <div className="p-4 border-t border-white/[0.06] bg-success/5">
                                <p className="text-success font-medium flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    This negotiation has been completed
                                </p>
                            </div>
                        )}
                    </Card>
                </motion.div>
            </div>

            {/* Finalize Modal */}
            <AnimatePresence>
                {showFinalizeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md"
                        >
                            <Card variant="elevated" className="overflow-hidden">
                                <CardHeader className="flex items-center justify-between border-b border-white/[0.06]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-magenta flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold font-display text-white">Finalize Contract</h2>
                                    </div>
                                    <button
                                        onClick={() => setShowFinalizeModal(false)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    <div className="p-5 rounded-xl bg-gradient-to-r from-cyan/10 to-magenta/10 border border-cyan/20">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Sparkles className="w-5 h-5 text-cyan" />
                                            <span className="font-semibold text-white">AI Contract Generation</span>
                                        </div>
                                        <p className="text-sm text-white/60 leading-relaxed">
                                            Sudo will analyze your negotiation and generate a professional legal
                                            contract based on all agreed terms and discussions.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-white/60">
                                            <CheckCircle2 className="w-4 h-4 text-success" />
                                            <span>Reviews entire conversation history</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-white/60">
                                            <CheckCircle2 className="w-4 h-4 text-success" />
                                            <span>Identifies agreed terms and conditions</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-white/60">
                                            <CheckCircle2 className="w-4 h-4 text-success" />
                                            <span>Generates professional legal language</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            variant="secondary"
                                            onClick={() => setShowFinalizeModal(false)}
                                            className="flex-1"
                                            disabled={finalizing}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleFinalize}
                                            className="flex-1"
                                            loading={finalizing}
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            Generate Contract
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MessageBubble({
    message,
    isOwn,
    delay = 0
}: {
    message: Message;
    isOwn: boolean;
    delay?: number
}) {
    const isAI = message.sender_type === 'ai';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
        >
            {/* Avatar */}
            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                ${isAI
                    ? 'bg-gradient-to-br from-cyan to-magenta shadow-glow-cyan'
                    : isOwn
                        ? 'bg-gradient-to-br from-cyan to-cyan-dim'
                        : 'bg-white/10'
                }
            `}>
                {isAI ? (
                    <Sparkles className="w-5 h-5 text-white" />
                ) : (
                    <User className="w-4 h-4 text-white" />
                )}
            </div>

            {/* Message Content */}
            <div className={`max-w-[75%] ${isOwn ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2 mb-1.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-xs font-medium ${isAI ? 'text-cyan' : 'text-white/60'}`}>
                        {isAI ? 'Sudo' : (message as any).sender?.full_name || 'User'}
                    </span>
                    <span className="text-xs text-white/30">
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                </div>
                <div className={`
                    inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed
                    ${isAI
                        ? 'message-ai'
                        : isOwn
                            ? 'bg-gradient-to-br from-cyan-dim to-cyan-muted text-white'
                            : 'bg-white/[0.06] text-white/90'
                    }
                `}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
            </div>
        </motion.div>
    );
}
