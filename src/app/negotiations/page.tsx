'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Navbar } from '@/components/navigation/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Negotiation } from '@/types/database';
import {
    Plus,
    MessageSquare,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Users,
    FileText,
    Sparkles,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NegotiationsPage() {
    const { user } = useAuth();
    const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchNegotiations = async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from('negotiations')
                .select(`
                    *,
                    template:templates(name),
                    participants(user_id, role, status)
                `)
                .order('updated_at', { ascending: false });

            if (error) {
                console.error('Error fetching negotiations:', error.message, error.code, error.details);
            } else {
                setNegotiations(data || []);
            }
            setLoading(false);
        };

        fetchNegotiations();
    }, [user]);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'active':
                return {
                    color: 'text-success',
                    bg: 'bg-success/10',
                    border: 'border-success/20',
                    label: 'Active',
                    icon: Clock,
                };
            case 'completed':
                return {
                    color: 'text-cyan',
                    bg: 'bg-cyan/10',
                    border: 'border-cyan/20',
                    label: 'Completed',
                    icon: CheckCircle2,
                };
            case 'cancelled':
                return {
                    color: 'text-error',
                    bg: 'bg-error/10',
                    border: 'border-error/20',
                    label: 'Cancelled',
                    icon: XCircle,
                };
            default:
                return {
                    color: 'text-white/50',
                    bg: 'bg-white/5',
                    border: 'border-white/10',
                    label: status,
                    icon: Clock,
                };
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10"
                >
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-2">
                            Negotiations
                        </h1>
                        <p className="text-white/60">
                            Manage your active and past contract negotiations
                        </p>
                    </div>
                    <Link href="/negotiations/new">
                        <Button size="lg">
                            <Plus className="w-5 h-5" />
                            New Negotiation
                        </Button>
                    </Link>
                </motion.div>

                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <div className="text-center">
                            <div className="w-12 h-12 border-2 border-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-white/60">Loading negotiations...</p>
                        </div>
                    </div>
                ) : negotiations.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card variant="elevated">
                            <CardContent className="py-20 text-center">
                                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                                    <MessageSquare className="w-10 h-10 text-white/20" />
                                </div>
                                <h2 className="text-2xl font-bold font-display text-white mb-3">
                                    No negotiations yet
                                </h2>
                                <p className="text-white/50 mb-8 max-w-md mx-auto">
                                    Start your first contract negotiation and let our AI mediator
                                    help you reach agreements faster.
                                </p>
                                <Link href="/negotiations/new">
                                    <Button size="lg">
                                        <Plus className="w-5 h-5" />
                                        Start Your First Negotiation
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        {negotiations.map((negotiation, index) => {
                            const status = getStatusConfig(negotiation.status);
                            const StatusIcon = status.icon;
                            const participantCount = (negotiation as any).participants?.length || 0;

                            return (
                                <motion.div
                                    key={negotiation.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                >
                                    <Link href={`/negotiations/${negotiation.id}`}>
                                        <Card hover glow="cyan" className="group">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                    {/* Icon */}
                                                    <div className="w-14 h-14 rounded-xl bg-cyan/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                        <MessageSquare className="w-7 h-7 text-cyan" />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4 mb-2">
                                                            <h3 className="text-lg font-semibold font-display text-white truncate">
                                                                {negotiation.title}
                                                            </h3>
                                                            <div className={`
                                                                shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                                                                ${status.bg} ${status.border} border ${status.color}
                                                            `}>
                                                                <StatusIcon className="w-3 h-3" />
                                                                {status.label}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                                                            {(negotiation as any).template && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <FileText className="w-4 h-4" />
                                                                    {(negotiation as any).template.name}
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-1.5">
                                                                <Users className="w-4 h-4" />
                                                                {participantCount} participant{participantCount !== 1 ? 's' : ''}
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Sparkles className="w-4 h-4 text-cyan/50" />
                                                                AI Mediated
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="w-4 h-4" />
                                                                {formatDistanceToNow(new Date(negotiation.updated_at), { addSuffix: true })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Arrow */}
                                                    <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-cyan group-hover:translate-x-1 transition-all shrink-0 hidden sm:block" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </main>
        </div>
    );
}
