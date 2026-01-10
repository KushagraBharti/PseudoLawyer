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
    Calendar
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
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-white">Your Contracts</h1>
                    <p className="text-white/60 mt-1">View and download your finalized contracts</p>
                </motion.div>

                {/* Contracts List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : contracts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardContent className="p-12 text-center">
                                <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-white mb-2">No contracts yet</h2>
                                <p className="text-white/60 mb-6">
                                    Finalize a negotiation to create your first contract
                                </p>
                                <Link href="/negotiations">
                                    <Button>
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
                        transition={{ delay: 0.1 }}
                        className="grid gap-4"
                    >
                        {contracts.map((contract, index) => (
                            <motion.div
                                key={contract.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                            >
                                <Link href={`/contracts/${contract.id}`}>
                                    <Card hover>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                                        <FileText className="w-6 h-6 text-green-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-white">
                                                            {contract.title}
                                                        </h3>
                                                        <p className="text-white/60 text-sm">
                                                            {contract.final_content?.templateName || 'Contract'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 text-white/40 text-sm">
                                                        <Calendar className="w-4 h-4" />
                                                        {format(new Date(contract.created_at), 'MMM d, yyyy')}
                                                    </div>
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
