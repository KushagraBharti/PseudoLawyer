'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Navbar } from '@/components/navigation/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Plus,
    MessageSquare,
    FileText,
    ArrowRight,
    Sparkles
} from 'lucide-react';

export default function DashboardPage() {
    const { profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
                    </h1>
                    <p className="text-white/60">
                        What would you like to negotiate today?
                    </p>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid md:grid-cols-2 gap-6 mb-12"
                >
                    {/* Start New Negotiation */}
                    <Link href="/negotiations/new">
                        <Card hover className="h-full">
                            <CardContent className="p-6 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                                    <Plus className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-white mb-1">
                                        Start New Negotiation
                                    </h2>
                                    <p className="text-white/60 text-sm">
                                        Choose a template and invite your counterpart
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-white/40" />
                            </CardContent>
                        </Card>
                    </Link>

                    {/* View Contracts */}
                    <Link href="/contracts">
                        <Card hover className="h-full">
                            <CardContent className="p-6 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-white mb-1">
                                        View Your Contracts
                                    </h2>
                                    <p className="text-white/60 text-sm">
                                        Access finalized and signed contracts
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-white/40" />
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>

                {/* Demo Hint */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-primary-500/30 bg-primary-500/5">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-5 h-5 text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Demo Mode Tips
                                    </h3>
                                    <p className="text-white/60 text-sm mb-4">
                                        To try out the full negotiation flow:
                                    </p>
                                    <ul className="text-white/60 text-sm space-y-1 list-disc list-inside">
                                        <li>Create two users in your Supabase dashboard</li>
                                        <li>Start a negotiation as User A</li>
                                        <li>Open a different browser and log in as User B</li>
                                        <li>Both users can chat and the AI will mediate!</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Activity (Placeholder) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12"
                >
                    <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
                    <Card>
                        <CardContent className="p-12 text-center">
                            <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
                            <p className="text-white/40 mb-4">No recent negotiations</p>
                            <Link href="/negotiations/new">
                                <Button variant="secondary" size="sm">
                                    Start Your First Negotiation
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
