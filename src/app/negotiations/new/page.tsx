'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
    ArrowLeft
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

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
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
                    <h1 className="text-3xl font-bold text-white">Start New Negotiation</h1>
                    <p className="text-white/60 mt-1">
                        {step === 1 ? 'Choose a contract template' : 'Set up your negotiation'}
                    </p>
                </motion.div>

                {/* Progress */}
                <div className="flex items-center gap-4 mb-8">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-400' : 'text-white/40'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-500' : 'bg-white/10'}`}>
                            {step > 1 ? <Check className="w-4 h-4 text-white" /> : <span className="text-white text-sm">1</span>}
                        </div>
                        <span className="text-sm font-medium">Template</span>
                    </div>
                    <div className="flex-1 h-px bg-white/10" />
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-400' : 'text-white/40'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-500' : 'bg-white/10'}`}>
                            <span className="text-white text-sm">2</span>
                        </div>
                        <span className="text-sm font-medium">Details</span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : step === 1 ? (
                    /* Step 1: Select Template */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid gap-4"
                    >
                        {templates.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/60">No templates available. Please run the database migrations.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            templates.map((template) => (
                                <Card
                                    key={template.id}
                                    hover
                                    onClick={() => {
                                        setSelectedTemplate(template);
                                        setStep(2);
                                    }}
                                    className={selectedTemplate?.id === template.id ? 'border-primary-500' : ''}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                                                    <FileText className="w-6 h-6 text-primary-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                                                    <p className="text-white/60 text-sm">{template.description}</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-white/40" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </motion.div>
                ) : (
                    /* Step 2: Configure */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardContent className="p-6 space-y-6">
                                {/* Selected Template */}
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                                    <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-primary-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/60">Selected Template</p>
                                        <p className="text-lg font-semibold text-white">{selectedTemplate?.name}</p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <Input
                                    id="title"
                                    label="Negotiation Title (Optional)"
                                    placeholder={`${selectedTemplate?.name} - ${new Date().toLocaleDateString()}`}
                                    value={negotiationTitle}
                                    onChange={(e) => setNegotiationTitle(e.target.value)}
                                />

                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                                        <Users className="w-4 h-4" />
                                        Counterparty Email
                                    </div>
                                    <Input
                                        id="counterparty"
                                        type="email"
                                        placeholder="other.party@example.com"
                                        value={counterpartyEmail}
                                        onChange={(e) => setCounterpartyEmail(e.target.value)}
                                    />
                                    <p className="text-xs text-white/40">
                                        Enter the email of the other party. They must have an account to participate.
                                    </p>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button variant="secondary" onClick={() => setStep(1)}>
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleCreateNegotiation}
                                        loading={creating}
                                        className="flex-1"
                                    >
                                        Start Negotiation
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
