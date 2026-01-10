'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

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

        // Redirect to dashboard after a short delay
        setTimeout(() => {
            router.push('/dashboard');
            router.refresh();
        }, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-background to-accent-900/20" />
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                            PseudoLawyer
                        </span>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <h1 className="text-2xl font-bold text-white text-center">Create your account</h1>
                        <p className="text-white/60 text-center mt-1">Start negotiating contracts with AI</p>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 text-green-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-2">Account created!</h2>
                                <p className="text-white/60">Redirecting to dashboard...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-4">
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <Input
                                    id="fullName"
                                    type="text"
                                    label="Full Name"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />

                                <Input
                                    id="email"
                                    type="email"
                                    label="Email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <Input
                                    id="password"
                                    type="password"
                                    label="Password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <p className="text-xs text-white/40">
                                    Password must be at least 6 characters
                                </p>

                                <Button type="submit" className="w-full" loading={loading}>
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </form>
                        )}

                        {!success && (
                            <div className="mt-6 text-center">
                                <p className="text-white/60 text-sm">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
