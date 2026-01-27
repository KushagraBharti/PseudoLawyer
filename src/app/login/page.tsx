'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/navigation/Navbar';
import { ArrowRight, Mail, Lock, Sparkles } from 'lucide-react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/dashboard';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const supabase = createClient();

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        router.push(redirectTo);
        router.refresh();
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group mb-12">
                <Logo />
                <div className="flex flex-col">
                    <span className="text-xl font-bold font-display text-white group-hover:text-cyan transition-colors">
                        PseudoLawyer
                    </span>
                    <span className="text-[10px] text-white/40 -mt-0.5 tracking-wider uppercase">
                        AI Contract Platform
                    </span>
                </div>
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-display text-white mb-2">
                    Welcome back
                </h1>
                <p className="text-white/60">
                    Sign in to continue to your dashboard
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm flex items-center gap-3"
                    >
                        <div className="w-8 h-8 rounded-lg bg-error/20 flex items-center justify-center shrink-0">
                            <span className="text-lg">!</span>
                        </div>
                        {error}
                    </motion.div>
                )}

                <Input
                    id="email"
                    type="email"
                    label="Email address"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-4 h-4" />}
                    required
                />

                <Input
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                    required
                />

                <Button type="submit" className="w-full" size="lg" loading={loading}>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                    <span className="px-4 text-sm text-white/40 bg-void">
                        New to PseudoLawyer?
                    </span>
                </div>
            </div>

            {/* Register link */}
            <Link href="/register">
                <Button variant="secondary" className="w-full" size="lg">
                    Create an account
                </Button>
            </Link>
        </motion.div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            {/* Left side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <Suspense fallback={<div className="text-white">Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>

            {/* Right side - Visual */}
            <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-void to-magenta/10" />
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan/20 blur-[100px] animate-float" />
                <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-magenta/15 blur-[80px] animate-float-delayed" />
                <div className="absolute inset-0 grid-pattern opacity-30" />

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 max-w-md text-center p-8"
                >
                    {/* Icon */}
                    <div className="
                        w-24 h-24 rounded-3xl mx-auto mb-8
                        bg-gradient-to-br from-cyan via-cyan-dim to-magenta
                        flex items-center justify-center
                        shadow-glow-cyan-lg
                    ">
                        <Sparkles className="w-12 h-12 text-white" />
                    </div>

                    <h2 className="text-3xl font-bold font-display text-white mb-4">
                        AI-Powered
                        <br />
                        <span className="gradient-text">Contract Negotiation</span>
                    </h2>
                    <p className="text-white/60 leading-relaxed">
                        Join thousands of professionals who have streamlined their
                        contract process with intelligent AI mediation.
                    </p>

                    {/* Stats */}
                    <div className="mt-10 grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold font-display text-cyan">10k+</p>
                            <p className="text-xs text-white/40 mt-1">Users</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold font-display text-magenta">50k+</p>
                            <p className="text-xs text-white/40 mt-1">Contracts</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold font-display text-gold">99%</p>
                            <p className="text-xs text-white/40 mt-1">Success</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
