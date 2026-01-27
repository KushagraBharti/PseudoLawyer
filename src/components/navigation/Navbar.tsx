'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import {
    FileText,
    MessageSquare,
    Home,
    LogOut,
    User,
    Sparkles,
    Menu,
    X,
    ChevronRight,
    Zap,
} from 'lucide-react';

// Animated Logo Component
function Logo({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
    const sizes = {
        small: 'w-8 h-8',
        default: 'w-10 h-10',
        large: 'w-12 h-12',
    };

    const iconSizes = {
        small: 'w-4 h-4',
        default: 'w-5 h-5',
        large: 'w-6 h-6',
    };

    return (
        <div className={`
            ${sizes[size]}
            rounded-xl
            bg-gradient-to-br from-cyan via-cyan-dim to-magenta
            flex items-center justify-center
            shadow-glow-cyan
            relative overflow-hidden
            group-hover:shadow-glow-cyan-lg
            transition-shadow duration-300
        `}>
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Sparkles className={`${iconSizes[size]} text-white relative z-10`} />
        </div>
    );
}

export function Navbar() {
    const pathname = usePathname();
    const { user, profile, loading, signOut } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => pathname?.startsWith(path);

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/negotiations', label: 'Negotiations', icon: MessageSquare },
        { href: '/contracts', label: 'Contracts', icon: FileText },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="sticky top-0 z-50 w-full"
            >
                {/* Glassmorphism background */}
                <div className="absolute inset-0 bg-void/80 backdrop-blur-xl border-b border-white/[0.06]" />

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <Logo />
                            <div className="flex flex-col">
                                <span className="text-lg font-bold font-display text-white group-hover:text-cyan transition-colors duration-200">
                                    PseudoLawyer
                                </span>
                                <span className="text-[10px] text-white/40 -mt-1 tracking-wider uppercase">
                                    AI Contract Platform
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        {user && (
                            <div className="hidden md:flex items-center gap-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`
                                                    relative flex items-center gap-2 px-4 py-2 rounded-xl
                                                    text-sm font-medium transition-all duration-200
                                                    ${active
                                                        ? 'text-cyan'
                                                        : 'text-white/60 hover:text-white'
                                                    }
                                                `}
                                            >
                                                {/* Active indicator */}
                                                {active && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute inset-0 bg-cyan/10 border border-cyan/20 rounded-xl"
                                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                                    />
                                                )}
                                                <Icon className="w-4 h-4 relative z-10" />
                                                <span className="relative z-10">{item.label}</span>
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                            {loading ? (
                                <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                            ) : user ? (
                                <>
                                    {/* User info - desktop */}
                                    <div className="hidden sm:flex items-center gap-3">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan/50 to-magenta/50 flex items-center justify-center">
                                                <User className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <span className="text-sm text-white/70 max-w-[120px] truncate">
                                                {profile?.full_name || user.email?.split('@')[0]}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={signOut}
                                            className="text-white/50 hover:text-white"
                                        >
                                            <LogOut className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    {/* Mobile menu button */}
                                    <button
                                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                        className="md:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        {mobileMenuOpen ? (
                                            <X className="w-5 h-5" />
                                        ) : (
                                            <Menu className="w-5 h-5" />
                                        )}
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">
                                            Sign in
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm">
                                            <Zap className="w-4 h-4" />
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && user && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-16 z-40 md:hidden"
                    >
                        <div className="bg-void/95 backdrop-blur-xl border-b border-white/[0.06] p-4 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`
                                            flex items-center justify-between p-3 rounded-xl
                                            transition-all duration-200
                                            ${active
                                                ? 'bg-cyan/10 text-cyan border border-cyan/20'
                                                : 'text-white/70 hover:bg-white/5 hover:text-white'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 opacity-50" />
                                    </Link>
                                );
                            })}

                            {/* Divider */}
                            <div className="h-px bg-white/10 my-3" />

                            {/* User info */}
                            <div className="flex items-center gap-3 p-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan/50 to-magenta/50 flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">
                                        {profile?.full_name || 'User'}
                                    </p>
                                    <p className="text-xs text-white/50 truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            {/* Sign out */}
                            <button
                                onClick={() => {
                                    signOut();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-between p-3 rounded-xl text-error/80 hover:bg-error/10 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Sign out</span>
                                </div>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// Export Logo for use in other places
export { Logo };
