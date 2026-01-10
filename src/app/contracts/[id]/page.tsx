'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/navigation/Navbar';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Contract } from '@/types/database';
import {
    FileText,
    Download,
    ArrowLeft,
    Calendar,
    Users,
    CheckCircle2,
    Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

export default function ContractDetailPage() {
    const params = useParams();
    const router = useRouter();
    const contractId = params.id as string;

    const [contract, setContract] = useState<Contract | null>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchContract = async () => {
            const supabase = createClient();

            const { data, error } = await supabase
                .from('contracts')
                .select('*')
                .eq('id', contractId)
                .single();

            if (error) {
                console.error('Error fetching contract:', error);
                router.push('/contracts');
                return;
            }

            setContract(data);
            setLoading(false);
        };

        if (contractId) {
            fetchContract();
        }
    }, [contractId, router]);

    const handleDownload = async () => {
        if (!contract) return;
        setDownloading(true);

        // Generate text content for the contract
        const content = generateContractText(contract);

        // Create blob and download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${contract.title.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setDownloading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!contract) {
        return null;
    }

    const parties = contract.final_content?.parties || [];
    const terms = contract.final_content?.terms || {};

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
                    <Button variant="ghost" size="sm" onClick={() => router.push('/contracts')} className="mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Contracts
                    </Button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">{contract.title}</h1>
                            <div className="flex items-center gap-4 mt-2 text-white/60">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Created {format(new Date(contract.created_at), 'MMMM d, yyyy')}
                                </div>
                            </div>
                        </div>
                        <Button onClick={handleDownload} loading={downloading}>
                            <Download className="w-4 h-4" />
                            Download
                        </Button>
                    </div>
                </motion.div>

                {/* Contract Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    {/* Template Info */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-primary-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">
                                        {contract.final_content?.templateName || 'Contract'}
                                    </h2>
                                    <p className="text-sm text-white/60">Contract Template</p>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Parties */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2 text-white">
                                <Users className="w-5 h-5" />
                                <h2 className="text-lg font-semibold">Parties</h2>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {parties.map((party: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-xl bg-white/5"
                                >
                                    <div>
                                        <p className="font-medium text-white">{party.name}</p>
                                        <p className="text-sm text-white/60">{party.email}</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400 capitalize">
                                        {party.role}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Terms */}
                    {Object.keys(terms).length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2 text-white">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <h2 className="text-lg font-semibold">Agreed Terms</h2>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {Object.entries(terms).map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="p-4 rounded-xl bg-white/5"
                                    >
                                        <p className="text-sm text-white/60 mb-1">{key}</p>
                                        <p className="text-white">{value as string}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* AI Notice */}
                    <Card className="border-primary-500/30 bg-primary-500/5">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-5 h-5 text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">AI-Assisted Negotiation</h3>
                                    <p className="text-sm text-white/60">
                                        This contract was negotiated with the assistance of Sudo, our AI mediator.
                                        Please review all terms carefully before using this document for legal purposes.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}

function generateContractText(contract: Contract): string {
    const content = contract.final_content;
    const parties = content?.parties || [];
    const terms = content?.terms || {};

    let text = `
================================================================================
                              ${contract.title.toUpperCase()}
================================================================================

Generated: ${format(new Date(contract.created_at), 'MMMM d, yyyy')}
Template: ${content?.templateName || 'Contract'}

--------------------------------------------------------------------------------
                                   PARTIES
--------------------------------------------------------------------------------

`;

    parties.forEach((party: any, index: number) => {
        text += `${index + 1}. ${party.name} (${party.role})
   Email: ${party.email}

`;
    });

    if (Object.keys(terms).length > 0) {
        text += `
--------------------------------------------------------------------------------
                                AGREED TERMS
--------------------------------------------------------------------------------

`;
        Object.entries(terms).forEach(([key, value]) => {
            text += `${key}:
${value}

`;
        });
    }

    text += `
--------------------------------------------------------------------------------
                                  NOTICE
--------------------------------------------------------------------------------

This contract was negotiated with AI assistance through PseudoLawyer.
Please review all terms carefully before using this document for legal purposes.

================================================================================
`;

    return text;
}
