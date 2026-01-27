'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Navbar } from '@/components/navigation/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Contract } from '@/types/database';
import {
    FileText,
    Download,
    ArrowRight,
    Calendar,
    MessageSquare,
    Sparkles,
    CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';

export default function ContractsPage() {
    const { user } = useAuth();
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchContracts = async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from('contracts')
                .select(`
                    *,
                    negotiation:negotiations(title)
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching contracts:', error);
            } else {
                setContracts(data || []);
            }
            setLoading(false);
        };

        fetchContracts();
    }, [user]);

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-2">
                        Your Contracts
                    </h1>
                    <p className="text-white/60">
                        View and download your finalized legal documents
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
                >
                    <Card variant="elevated">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-magenta/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-magenta" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold font-display text-white">{contracts.length}</p>
                                    <p className="text-xs text-white/50">Total Contracts</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="elevated">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold font-display text-white">{contracts.length}</p>
                                    <p className="text-xs text-white/50">Completed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="elevated">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-cyan" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold font-display text-white">AI</p>
                                    <p className="text-xs text-white/50">Generated</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card variant="elevated">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                                    <Download className="w-5 h-5 text-gold" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold font-display text-white">.txt</p>
                                    <p className="text-xs text-white/50">Export Format</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Contracts List */}
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <div className="text-center">
                            <div className="w-12 h-12 border-2 border-magenta border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-white/60">Loading contracts...</p>
                        </div>
                    </div>
                ) : contracts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card variant="elevated">
                            <CardContent className="py-20 text-center">
                                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                                    <FileText className="w-10 h-10 text-white/20" />
                                </div>
                                <h2 className="text-2xl font-bold font-display text-white mb-3">
                                    No contracts yet
                                </h2>
                                <p className="text-white/50 mb-8 max-w-md mx-auto">
                                    Complete a negotiation and finalize it to generate your first
                                    AI-powered contract document.
                                </p>
                                <Link href="/negotiations">
                                    <Button size="lg">
                                        <MessageSquare className="w-5 h-5" />
                                        View Negotiations
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        {contracts.map((contract, index) => (
                            <motion.div
                                key={contract.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * index }}
                            >
                                <Link href={`/contracts/${contract.id}`}>
                                    <Card hover glow="magenta" className="group">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                {/* Icon */}
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-magenta/20 to-cyan/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                    <FileText className="w-7 h-7 text-magenta" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4 mb-2">
                                                        <h3 className="text-lg font-semibold font-display text-white truncate">
                                                            {contract.title}
                                                        </h3>
                                                        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-success/10 border border-success/20 text-success">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Finalized
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                                                        <div className="flex items-center gap-1.5">
                                                            <FileText className="w-4 h-4" />
                                                            {contract.final_content?.templateName || 'Contract'}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Sparkles className="w-4 h-4 text-cyan/50" />
                                                            AI Generated
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-4 h-4" />
                                                            {format(new Date(contract.created_at), 'MMM d, yyyy')}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Arrow */}
                                                <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-magenta group-hover:translate-x-1 transition-all shrink-0 hidden sm:block" />
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
