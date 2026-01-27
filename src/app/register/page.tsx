'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/navigation/Navbar';
import { ArrowRight, Mail, Lock, User, Check, Sparkles, Shield, Zap, Users } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const supabase = createClient();

        const { error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        setSuccess(true);
        setLoading(false);

        setTimeout(() => {
            router.push('/dashboard');
            router.refresh();
        }, 2000);
    };

    const benefits = [
        { icon: Sparkles, text: 'AI-powered contract mediation' },
        { icon: Shield, text: 'Secure & encrypted negotiations' },
        { icon: Zap, text: 'Close deals in minutes, not weeks' },
        { icon: Users, text: 'Real-time multi-party collaboration' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left side - Visual */}
            <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-magenta/10 via-void to-cyan/10" />
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-magenta/20 blur-[100px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-cyan/15 blur-[80px] animate-float-delayed" />
                <div className="absolute inset-0 grid-pattern opacity-30" />

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-lg p-8"
                >
                    {/* Icon */}
                    <div className="
                        w-20 h-20 rounded-2xl mb-8
                        bg-gradient-to-br from-magenta via-magenta-dim to-cyan
                        flex items-center justify-center
                        shadow-glow-magenta
                    ">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-4xl font-bold font-display text-white mb-4">
                        Join the Future of
                        <br />
                        <span className="gradient-text">Legal Agreements</span>
                    </h2>
                    <p className="text-white/60 text-lg leading-relaxed mb-10">
                        Create an account and start negotiating contracts with
                        the power of AI. No credit card required.
                    </p>

                    {/* Benefits */}
                    <div className="space-y-4">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="flex items-center gap-4"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <benefit.icon className="w-5 h-5 text-cyan" />
                                </div>
                                <span className="text-white/80">{benefit.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
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
                            Create your account
                        </h1>
                        <p className="text-white/60">
                            Start negotiating contracts with AI assistance
                        </p>
                    </div>

                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <div className="
                                w-20 h-20 rounded-full mx-auto mb-6
                                bg-gradient-to-br from-success to-success-dim
                                flex items-center justify-center
                                shadow-[0_0_40px_rgba(0,255,136,0.3)]
                            ">
                                <Check className="w-10 h-10 text-void" />
                            </div>
                            <h2 className="text-2xl font-bold font-display text-white mb-2">
                                Account created!
                            </h2>
                            <p className="text-white/60 mb-6">
                                Redirecting you to the dashboard...
                            </p>
                            <div className="flex justify-center">
                                <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
                            </div>
                        </motion.div>
                    ) : (
                        <>
                            {/* Form */}
                            <form onSubmit={handleRegister} className="space-y-5">
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
                                    id="fullName"
                                    type="text"
                                    label="Full name"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    icon={<User className="w-4 h-4" />}
                                    required
                                />

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
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    icon={<Lock className="w-4 h-4" />}
                                    hint="Must be at least 6 characters"
                                    required
                                />

                                <Button type="submit" className="w-full" size="lg" loading={loading}>
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </form>

                            {/* Terms */}
                            <p className="mt-6 text-xs text-white/40 text-center">
                                By creating an account, you agree to our Terms of Service
                                and Privacy Policy.
                            </p>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-4 text-sm text-white/40 bg-void">
                                        Already have an account?
                                    </span>
                                </div>
                            </div>

                            {/* Login link */}
                            <Link href="/login">
                                <Button variant="secondary" className="w-full" size="lg">
                                    Sign in instead
                                </Button>
                            </Link>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
