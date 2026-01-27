'use client';

import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    glow?: 'cyan' | 'magenta' | 'gold' | 'none';
    onClick?: () => void;
    variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variants = {
    default: `
        bg-white/[0.02]
        border border-white/[0.06]
        backdrop-blur-xl
    `,
    elevated: `
        bg-gradient-to-br from-white/[0.05] to-white/[0.02]
        border border-white/[0.08]
        backdrop-blur-xl
        shadow-card
    `,
    outlined: `
        bg-transparent
        border border-white/10
    `,
    gradient: `
        bg-gradient-to-br from-cyan/5 via-transparent to-magenta/5
        border border-white/[0.08]
        backdrop-blur-xl
    `,
};

const glowStyles = {
    cyan: 'hover:shadow-glow-cyan hover:border-cyan/20',
    magenta: 'hover:shadow-glow-magenta hover:border-magenta/20',
    gold: 'hover:shadow-glow-gold hover:border-gold/20',
    none: '',
};

const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export function Card({
    children,
    className = '',
    hover = false,
    glow = 'none',
    onClick,
    variant = 'default',
    padding = 'none',
}: CardProps) {
    const isInteractive = hover || onClick;

    return (
        <motion.div
            whileHover={isInteractive ? { y: -4, scale: 1.01 } : undefined}
            whileTap={isInteractive && onClick ? { scale: 0.99 } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={onClick}
            className={`
                rounded-2xl
                transition-all duration-300 ease-out
                ${variants[variant]}
                ${isInteractive ? 'cursor-pointer' : ''}
                ${isInteractive ? glowStyles[glow] || glowStyles.cyan : ''}
                ${isInteractive ? 'hover:bg-white/[0.04] hover:border-white/[0.12]' : ''}
                ${paddingStyles[padding]}
                ${className}
            `}
        >
            {children}
        </motion.div>
    );
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
    action?: ReactNode;
}

export function CardHeader({ children, className = '', action }: CardHeaderProps) {
    return (
        <div className={`px-6 py-5 border-b border-white/[0.06] flex items-center justify-between ${className}`}>
            <div>{children}</div>
            {action && <div>{action}</div>}
        </div>
    );
}

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
    return (
        <div className={`px-6 py-5 ${className}`}>
            {children}
        </div>
    );
}

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
    return (
        <div className={`px-6 py-4 border-t border-white/[0.06] ${className}`}>
            {children}
        </div>
    );
}

// Feature card with icon and glow effect
interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    color?: 'cyan' | 'magenta' | 'gold';
    className?: string;
}

export function FeatureCard({
    icon,
    title,
    description,
    color = 'cyan',
    className = '',
}: FeatureCardProps) {
    const colorStyles = {
        cyan: {
            iconBg: 'bg-cyan/10',
            iconColor: 'text-cyan',
            hover: 'hover:border-cyan/30',
        },
        magenta: {
            iconBg: 'bg-magenta/10',
            iconColor: 'text-magenta',
            hover: 'hover:border-magenta/30',
        },
        gold: {
            iconBg: 'bg-gold/10',
            iconColor: 'text-gold',
            hover: 'hover:border-gold/30',
        },
    };

    const styles = colorStyles[color];

    return (
        <Card
            hover
            glow={color}
            variant="elevated"
            className={`group ${styles.hover} ${className}`}
        >
            <CardContent className="space-y-4">
                <div className={`
                    w-14 h-14 rounded-xl ${styles.iconBg}
                    flex items-center justify-center
                    transition-transform duration-300
                    group-hover:scale-110
                `}>
                    <div className={styles.iconColor}>
                        {icon}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white mb-2 font-display">
                        {title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                        {description}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

// Stats card for dashboard
interface StatCardProps {
    label: string;
    value: string | number;
    icon: ReactNode;
    trend?: {
        value: number;
        positive: boolean;
    };
    className?: string;
}

export function StatCard({
    label,
    value,
    icon,
    trend,
    className = '',
}: StatCardProps) {
    return (
        <Card variant="elevated" className={className}>
            <CardContent>
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-white/50 mb-1">{label}</p>
                        <p className="text-3xl font-bold font-display text-white">{value}</p>
                        {trend && (
                            <div className={`
                                flex items-center gap-1 mt-2 text-sm
                                ${trend.positive ? 'text-success' : 'text-error'}
                            `}>
                                <span>{trend.positive ? '↑' : '↓'}</span>
                                <span>{Math.abs(trend.value)}%</span>
                            </div>
                        )}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
