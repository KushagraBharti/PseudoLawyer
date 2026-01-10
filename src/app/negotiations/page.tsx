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
    ArrowRight
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
          template:templates(name)
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="w-5 h-5 text-green-400" />;
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-400" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500/20 text-green-400';
            case 'cancelled':
                return 'bg-red-500/20 text-red-400';
            default:
                return 'bg-yellow-500/20 text-yellow-400';
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
                    className="flex items-center justify-between mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white">Negotiations</h1>
                        <p className="text-white/60 mt-1">Manage your active and past negotiations</p>
                    </div>
                    <Link href="/negotiations/new">
                        <Button>
                            <Plus className="w-4 h-4" />
                            New Negotiation
                        </Button>
                    </Link>
                </motion.div>

                {/* Negotiations List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : negotiations.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardContent className="p-12 text-center">
                                <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-white mb-2">No negotiations yet</h2>
                                <p className="text-white/60 mb-6">
                                    Start your first contract negotiation to see it here
                                </p>
                                <Link href="/negotiations/new">
                                    <Button>
                                        <Plus className="w-4 h-4" />
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
                        {negotiations.map((negotiation, index) => (
                            <motion.div
                                key={negotiation.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                            >
                                <Link href={`/negotiations/${negotiation.id}`}>
                                    <Card hover>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                                                        <MessageSquare className="w-6 h-6 text-primary-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white">
                                                            {negotiation.title}
                                                        </h3>
                                                        <p className="text-white/60 text-sm">
                                                            {(negotiation as any).template?.name || 'Custom Contract'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(negotiation.status)}`}>
                                                        {negotiation.status.charAt(0).toUpperCase() + negotiation.status.slice(1)}
                                                    </span>
                                                    <span className="text-white/40 text-sm">
                                                        {formatDistanceToNow(new Date(negotiation.updated_at), { addSuffix: true })}
                                                    </span>
                                                    <ArrowRight className="w-5 h-5 text-white/40" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>
        </div>
    );
}
