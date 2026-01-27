'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Navbar } from '@/components/navigation/Navbar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Template } from '@/types/database';
import {
    FileText,
    ArrowRight,
    Check,
    Users,
    ArrowLeft,
    Sparkles,
    Mail,
    Tag,
} from 'lucide-react';

export default function NewNegotiationPage() {
    const router = useRouter();
    const { user, profile } = useAuth();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [counterpartyEmail, setCounterpartyEmail] = useState('');
    const [negotiationTitle, setNegotiationTitle] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTemplates = async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from('templates')
                .select('*')
                .order('name');

            if (error) {
                console.error('Error fetching templates:', error);
            } else {
                setTemplates(data || []);
            }
            setLoading(false);
        };

        fetchTemplates();
    }, []);

    const handleCreateNegotiation = async () => {
        if (!selectedTemplate || !user || !profile) return;

        setError('');
        setCreating(true);

        const supabase = createClient();

        // Create negotiation
        const { data: negotiation, error: negError } = await supabase
            .from('negotiations')
            .insert({
                template_id: selectedTemplate.id,
                title: negotiationTitle || `${selectedTemplate.name} - ${new Date().toLocaleDateString()}`,
                status: 'active',
                contract_data: {
                    templateName: selectedTemplate.name,
                    agreedTerms: {},
                    disputedTerms: {},
                    sections: {}
                },
                created_by: user.id,
            })
            .select()
            .single();

        if (negError) {
            setError(negError.message);
            setCreating(false);
            return;
        }

        // Add creator as participant (initiator)
        await supabase.from('participants').insert({
            negotiation_id: negotiation.id,
            user_id: user.id,
            email: profile.email,
            role: 'initiator',
            status: 'joined',
            joined_at: new Date().toISOString(),
        });

        // Add counterparty as participant
        if (counterpartyEmail) {
            // Check if counterparty exists
            const { data: counterpartyProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', counterpartyEmail)
                .single();

            await supabase.from('participants').insert({
                negotiation_id: negotiation.id,
                user_id: counterpartyProfile?.id || null,
                email: counterpartyEmail,
                role: 'party',
                status: counterpartyProfile ? 'joined' : 'pending',
                joined_at: counterpartyProfile ? new Date().toISOString() : null,
            });
        }

        // Add welcome message from AI
        await supabase.from('messages').insert({
            negotiation_id: negotiation.id,
            sender_id: null,
            sender_type: 'ai',
            content: `Welcome to your ${selectedTemplate.name} negotiation! I'm Sudo, your AI mediator. I'll help both parties discuss terms and reach a fair agreement. Let's start by introducing yourselves and outlining your main goals for this contract.`,
            metadata: {},
        });

        router.push(`/negotiations/${negotiation.id}`);
    };

    const templateIcons: Record<string, string> = {
        'NDA': 'cyan',
        'Freelance': 'magenta',
        'Rental': 'gold',
        'default': 'cyan'
    };

    const getTemplateColor = (name: string): 'cyan' | 'magenta' | 'gold' => {
        for (const key of Object.keys(templateIcons)) {
            if (name.toLowerCase().includes(key.toLowerCase())) {
                return templateIcons[key] as 'cyan' | 'magenta' | 'gold';
            }
        }
        return 'cyan';
    };

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => step === 1 ? router.back() : setStep(1)}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-2">
                        Start New Negotiation
                    </h1>
                    <p className="text-white/60">
                        {step === 1 ? 'Choose a contract template to begin' : 'Configure your negotiation details'}
                    </p>
                </motion.div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-4 mb-10">
                    <div className={`flex items-center gap-3 ${step >= 1 ? 'text-cyan' : 'text-white/40'}`}>
                        <div className={`
                            w-10 h-10 rounded-xl flex items-center justify-center font-semibold
                            ${step >= 1 ? 'bg-cyan text-void' : 'bg-white/10 text-white/40'}
                            ${step > 1 ? 'shadow-glow-cyan' : ''}
                        `}>
                            {step > 1 ? <Check className="w-5 h-5" /> : '1'}
                        </div>
                        <span className="text-sm font-medium hidden sm:inline">Select Template</span>
                    </div>

                    <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-gradient-to-r from-cyan to-magenta' : 'bg-white/10'}`} />

                    <div className={`flex items-center gap-3 ${step >= 2 ? 'text-magenta' : 'text-white/40'}`}>
                        <div className={`
                            w-10 h-10 rounded-xl flex items-center justify-center font-semibold
                            ${step >= 2 ? 'bg-magenta text-white' : 'bg-white/10 text-white/40'}
                        `}>
                            2
                        </div>
                        <span className="text-sm font-medium hidden sm:inline">Configure Details</span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-12 h-12 border-2 border-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-white/60">Loading templates...</p>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            /* Step 1: Select Template */
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid gap-4"
                            >
                                {templates.length === 0 ? (
                                    <Card variant="elevated">
                                        <CardContent className="p-12 text-center">
                                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                                <FileText className="w-8 h-8 text-white/20" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white mb-2">No templates available</h3>
                                            <p className="text-white/50">Please run the database migrations to add templates.</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    templates.map((template, index) => {
                                        const color = getTemplateColor(template.name);
                                        const colorClasses = {
                                            cyan: { bg: 'bg-cyan/10', text: 'text-cyan', hover: 'hover:border-cyan/30', glow: 'cyan' as const },
                                            magenta: { bg: 'bg-magenta/10', text: 'text-magenta', hover: 'hover:border-magenta/30', glow: 'magenta' as const },
                                            gold: { bg: 'bg-gold/10', text: 'text-gold', hover: 'hover:border-gold/30', glow: 'gold' as const },
                                        };
                                        const styles = colorClasses[color];

                                        return (
                                            <motion.div
                                                key={template.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.05 * index }}
                                            >
                                                <Card
                                                    hover
                                                    glow={styles.glow}
                                                    onClick={() => {
                                                        setSelectedTemplate(template);
                                                        setStep(2);
                                                    }}
                                                    className={`group cursor-pointer ${styles.hover}`}
                                                >
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center gap-5">
                                                            <div className={`w-14 h-14 rounded-xl ${styles.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                                                <FileText className={`w-7 h-7 ${styles.text}`} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-lg font-semibold font-display text-white mb-1">
                                                                    {template.name}
                                                                </h3>
                                                                <p className="text-white/50 text-sm line-clamp-2">
                                                                    {template.description}
                                                                </p>
                                                            </div>
                                                            <ArrowRight className={`w-5 h-5 text-white/20 group-hover:${styles.text} group-hover:translate-x-1 transition-all shrink-0`} />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </motion.div>
                        ) : (
                            /* Step 2: Configure */
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card variant="elevated">
                                    <CardContent className="p-8 space-y-8">
                                        {/* Selected Template Display */}
                                        <div className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-cyan/10 to-magenta/10 border border-cyan/20">
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan to-magenta flex items-center justify-center shadow-glow-cyan">
                                                <FileText className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/50 uppercase tracking-wider mb-0.5">Selected Template</p>
                                                <p className="text-xl font-semibold font-display text-white">{selectedTemplate?.name}</p>
                                            </div>
                                        </div>

                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm flex items-center gap-3"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-error/20 flex items-center justify-center shrink-0">
                                                    <span className="text-lg">!</span>
                                                </div>
                                                {error}
                                            </motion.div>
                                        )}

                                        {/* Form Fields */}
                                        <div className="space-y-6">
                                            <Input
                                                id="title"
                                                label="Negotiation Title"
                                                placeholder={`${selectedTemplate?.name} - ${new Date().toLocaleDateString()}`}
                                                value={negotiationTitle}
                                                onChange={(e) => setNegotiationTitle(e.target.value)}
                                                icon={<Tag className="w-4 h-4" />}
                                                hint="Optional - A descriptive name for this negotiation"
                                            />

                                            <Input
                                                id="counterparty"
                                                type="email"
                                                label="Counterparty Email"
                                                placeholder="other.party@example.com"
                                                value={counterpartyEmail}
                                                onChange={(e) => setCounterpartyEmail(e.target.value)}
                                                icon={<Mail className="w-4 h-4" />}
                                                hint="Enter the email of the other party. They must have an account to participate."
                                            />
                                        </div>

                                        {/* AI Info Box */}
                                        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-magenta flex items-center justify-center shrink-0">
                                                    <Sparkles className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-white mb-1">AI-Powered Mediation</h4>
                                                    <p className="text-sm text-white/50 leading-relaxed">
                                                        Sudo, our AI mediator, will help both parties find common ground,
                                                        suggest fair compromises, and generate a professional contract once
                                                        you reach an agreement.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-4 pt-4">
                                            <Button variant="secondary" onClick={() => setStep(1)} size="lg">
                                                <ArrowLeft className="w-4 h-4" />
                                                Back
                                            </Button>
                                            <Button
                                                onClick={handleCreateNegotiation}
                                                loading={creating}
                                                className="flex-1"
                                                size="lg"
                                            >
                                                Start Negotiation
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </main>
        </div>
    );
}
