'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/Button';
import {
    FileText,
    MessageSquare,
    Home,
    LogOut,
    User,
    Sparkles,
} from 'lucide-react';

export function Navbar() {
    const pathname = usePathname();
    const { user, profile, loading, signOut } = useAuth();

    const isActive = (path: string) => pathname?.startsWith(path);

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/negotiations', label: 'Negotiations', icon: MessageSquare },
        { href: '/contracts', label: 'Contracts', icon: FileText },
    ];

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                            PseudoLawyer
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    {user && (
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                      transition-colors duration-200
                      ${active
                                                ? 'bg-white/10 text-white'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                            }
                    `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                        ) : user ? (
                            <>
                                <div className="hidden sm:flex items-center gap-2 text-sm text-white/60">
                                    <User className="w-4 h-4" />
                                    <span>{profile?.full_name || user.email}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={signOut}
                                    className="text-white/60 hover:text-white"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Sign out</span>
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Sign in
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="primary" size="sm">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
