'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
    return (
        <motion.div
            whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
            whileTap={hover && onClick ? { scale: 0.98 } : undefined}
            onClick={onClick}
            className={`
        rounded-2xl bg-white/5 border border-white/10
        backdrop-blur-sm
        ${hover ? 'cursor-pointer transition-colors hover:bg-white/10 hover:border-white/20' : ''}
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
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
    return (
        <div className={`px-6 py-4 border-b border-white/10 ${className}`}>
            {children}
        </div>
    );
}

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
    return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
    return (
        <div className={`px-6 py-4 border-t border-white/10 ${className}`}>
            {children}
        </div>
    );
}
