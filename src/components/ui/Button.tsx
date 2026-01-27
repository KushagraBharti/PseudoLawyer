'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    loading?: boolean;
    icon?: boolean;
}

const variants = {
    primary: `
        bg-white text-black
        hover:bg-gray-200
        border border-transparent
        shadow-sm
    `,
    secondary: `
        bg-white/5 text-white
        hover:bg-white/10
        border border-white/10
    `,
    ghost: `
        bg-transparent text-white/60
        hover:bg-white/5 hover:text-white
    `,
    danger: `
        bg-red-500/10 text-red-400
        hover:bg-red-500/20
        border border-red-500/20
    `,
    outline: `
        bg-transparent text-white
        border border-white/20
        hover:bg-white/5 hover:border-white/40
    `,
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2',
    xl: 'px-8 py-3.5 text-lg gap-3',
};

const iconSizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className = '',
        variant = 'primary',
        size = 'md',
        loading,
        disabled,
        icon = false,
        children,
        ...props
    }, ref) => {
        const isDisabled = disabled || loading;

        return (
            <motion.button
                ref={ref}
                whileHover={isDisabled ? {} : { scale: 1.01 }}
                whileTap={isDisabled ? {} : { scale: 0.98 }}
                transition={{ duration: 0.1 }}
                className={`
                    inline-flex items-center justify-center
                    font-medium rounded-lg
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${variants[variant]}
                    ${icon ? iconSizes[size] : sizes[size]}
                    ${className}
                `}
                disabled={isDisabled}
                {...(props as HTMLMotionProps<'button'>)}
            >
                {/* Loading spinner */}
                {loading && (
                    <svg
                        className="animate-spin h-4 w-4 shrink-0 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}

                {/* Button content */}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', ...props }, ref) => {
        return (
            <Button
                ref={ref}
                icon
                className={`aspect-square ${className}`}
                {...props}
            />
        );
    }
);

IconButton.displayName = 'IconButton';
