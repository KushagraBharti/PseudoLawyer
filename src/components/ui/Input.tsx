'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, id, ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={id} className="block text-sm font-medium text-white/80">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={`
            w-full px-4 py-2.5 rounded-xl
            bg-white/5 border border-white/10
            text-white placeholder:text-white/40
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
                    {...props}
                />
                {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = '', label, error, id, ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={id} className="block text-sm font-medium text-white/80">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={id}
                    className={`
            w-full px-4 py-2.5 rounded-xl resize-none
            bg-white/5 border border-white/10
            text-white placeholder:text-white/40
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
                    {...props}
                />
                {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
