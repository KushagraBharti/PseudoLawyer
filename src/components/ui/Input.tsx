'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const baseInputStyles = `
    w-full px-4 py-3 rounded-xl
    bg-white/[0.03]
    border border-white/[0.08]
    text-white placeholder:text-white/30
    transition-all duration-200
    focus:outline-none focus:bg-white/[0.05]
    focus:border-cyan/50 focus:shadow-[0_0_0_3px_rgba(0,217,255,0.1)]
    hover:border-white/15 hover:bg-white/[0.04]
    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-white/[0.08]
`;

const errorStyles = `
    border-error/50
    focus:border-error focus:shadow-[0_0_0_3px_rgba(255,51,102,0.1)]
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({
        className = '',
        label,
        error,
        hint,
        icon,
        iconPosition = 'left',
        id,
        ...props
    }, ref) => {
        const hasIcon = !!icon;

        return (
            <div className="space-y-2">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium text-white/70"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {hasIcon && iconPosition === 'left' && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={id}
                        className={`
                            ${baseInputStyles}
                            ${error ? errorStyles : ''}
                            ${hasIcon && iconPosition === 'left' ? 'pl-11' : ''}
                            ${hasIcon && iconPosition === 'right' ? 'pr-11' : ''}
                            ${className}
                        `}
                        {...props}
                    />
                    {hasIcon && iconPosition === 'right' && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                            {icon}
                        </div>
                    )}
                </div>
                {hint && !error && (
                    <p className="text-xs text-white/40">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-error flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({
        className = '',
        label,
        error,
        hint,
        id,
        rows = 4,
        ...props
    }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium text-white/70"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={id}
                    rows={rows}
                    className={`
                        ${baseInputStyles}
                        ${error ? errorStyles : ''}
                        resize-none
                        ${className}
                    `}
                    {...props}
                />
                {hint && !error && (
                    <p className="text-xs text-white/40">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-error flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

// Search input with magnifying glass
interface SearchInputProps extends Omit<InputProps, 'icon' | 'iconPosition'> {
    onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className = '', onSearch, ...props }, ref) => {
        return (
            <Input
                ref={ref}
                type="search"
                icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                }
                iconPosition="left"
                className={className}
                {...props}
            />
        );
    }
);

SearchInput.displayName = 'SearchInput';

// Select component (styled dropdown)
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({
        className = '',
        label,
        error,
        options,
        id,
        ...props
    }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium text-white/70"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        id={id}
                        className={`
                            ${baseInputStyles}
                            ${error ? errorStyles : ''}
                            appearance-none cursor-pointer pr-10
                            ${className}
                        `}
                        {...props}
                    >
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                className="bg-obsidian text-white"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                {error && (
                    <p className="text-xs text-error flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
