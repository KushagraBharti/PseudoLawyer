'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
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
                        <h1 className="text-2xl font-bold text-white text-center">Welcome back</h1>
                        <p className="text-white/60 text-center mt-1">Sign in to continue</p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

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

                            <Button type="submit" className="w-full" loading={loading}>
                                Sign In
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-white/60 text-sm">
                                Don't have an account?{' '}
                                <Link href="/register" className="text-primary-400 hover:text-primary-300 font-medium">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
