'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
    ghost: 'hover:bg-white/10 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
                whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
                className={`
          inline-flex items-center justify-center gap-2 font-medium rounded-xl
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
                disabled={disabled || loading}
                {...(props as HTMLMotionProps<'button'>)}
            >
                {loading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
