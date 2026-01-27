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
    Sparkles,
    TrendingUp,
    Clock,
    CheckCircle2,
    Zap,
} from 'lucide-react';

export default function DashboardPage() {
    const { profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const firstName = profile?.full_name?.split(' ')[0] || 'there';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

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
                    <p className="text-cyan text-sm font-medium uppercase tracking-widest mb-2">
                        {greeting}
                    </p>
                    <h1 className="text-4xl sm:text-5xl font-bold font-display text-white mb-3">
                        Welcome back, <span className="gradient-text">{firstName}</span>
                    </h1>
                    <p className="text-white/60 text-lg">
                        What would you like to negotiate today?
                    </p>
                </motion.div>

                {/* Quick Actions - Bento Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                >
                    {/* Start New Negotiation - Featured */}
                    <Link href="/negotiations/new" className="md:col-span-2 lg:col-span-2">
                        <Card hover glow="cyan" variant="gradient" className="h-full group">
                            <CardContent className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <div className="
                                    w-20 h-20 rounded-2xl shrink-0
                                    bg-gradient-to-br from-cyan via-cyan-dim to-magenta
                                    flex items-center justify-center
                                    shadow-glow-cyan
                                    group-hover:scale-110 transition-transform duration-300
                                ">
                                    <Plus className="w-10 h-10 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold font-display text-white mb-2">
                                        Start New Negotiation
                                    </h2>
                                    <p className="text-white/60 mb-4">
                                        Choose from templates like NDAs, freelance agreements, or create a custom contract with AI assistance.
                                    </p>
                                    <div className="flex items-center gap-2 text-cyan font-medium">
                                        <span>Get started</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Quick Stats */}
                    <div className="space-y-6">
                        <Card variant="elevated">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-success" />
                                    </div>
                                    <span className="tag tag-success">Active</span>
                                </div>
                                <p className="text-3xl font-bold font-display text-white mb-1">0</p>
                                <p className="text-sm text-white/50">Active Negotiations</p>
                            </CardContent>
                        </Card>

                        <Card variant="elevated">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-magenta/10 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-magenta" />
                                    </div>
                                    <span className="tag tag-magenta">Completed</span>
                                </div>
                                <p className="text-3xl font-bold font-display text-white mb-1">0</p>
                                <p className="text-sm text-white/50">Finalized Contracts</p>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                {/* Navigation Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid sm:grid-cols-2 gap-6 mb-12"
                >
                    <Link href="/negotiations">
                        <Card hover glow="cyan" className="group">
                            <CardContent className="p-6 flex items-center gap-5">
                                <div className="w-14 h-14 rounded-xl bg-cyan/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-7 h-7 text-cyan" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold font-display text-white mb-1">
                                        View Negotiations
                                    </h3>
                                    <p className="text-sm text-white/50">
                                        Manage active and past negotiations
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-cyan group-hover:translate-x-1 transition-all" />
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/contracts">
                        <Card hover glow="magenta" className="group">
                            <CardContent className="p-6 flex items-center gap-5">
                                <div className="w-14 h-14 rounded-xl bg-magenta/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FileText className="w-7 h-7 text-magenta" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold font-display text-white mb-1">
                                        View Contracts
                                    </h3>
                                    <p className="text-sm text-white/50">
                                        Access finalized documents
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-magenta group-hover:translate-x-1 transition-all" />
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>

                {/* Getting Started Guide */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card variant="gradient" className="overflow-hidden">
                        <div className="p-8 relative">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan to-magenta flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold font-display text-white">
                                                Getting Started with Sudo
                                            </h3>
                                            <p className="text-sm text-white/50">Your AI negotiation assistant</p>
                                        </div>
                                    </div>

                                    <p className="text-white/60 mb-6 leading-relaxed">
                                        To experience the full negotiation flow, you'll need two parties.
                                        Here's how to test everything:
                                    </p>

                                    <div className="space-y-3">
                                        {[
                                            'Create two user accounts in your system',
                                            'Start a negotiation as User A',
                                            'Open a different browser and log in as User B',
                                            'Both users can chat and the AI will mediate!',
                                        ].map((step, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-cyan/20 flex items-center justify-center text-xs text-cyan font-bold">
                                                    {index + 1}
                                                </div>
                                                <span className="text-white/70 text-sm">{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="lg:w-72">
                                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                                        <div className="flex items-center gap-2 text-cyan text-sm font-medium mb-4">
                                            <Zap className="w-4 h-4" />
                                            Pro Tip
                                        </div>
                                        <p className="text-white/60 text-sm leading-relaxed">
                                            Type <code className="code-block">@Sudo</code> in
                                            the chat to ask the AI mediator for help at any time
                                            during your negotiation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold font-display text-white">Recent Activity</h2>
                        <Link href="/negotiations">
                            <Button variant="ghost" size="sm">
                                View all
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <Card variant="elevated">
                        <CardContent className="py-16 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-8 h-8 text-white/20" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">No recent activity</h3>
                            <p className="text-white/50 mb-6 max-w-sm mx-auto">
                                Start your first negotiation to see your activity here
                            </p>
                            <Link href="/negotiations/new">
                                <Button>
                                    <Plus className="w-4 h-4" />
                                    Start Negotiation
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
