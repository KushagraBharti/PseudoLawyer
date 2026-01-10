import Link from 'next/link';
import { Sparkles, MessageSquare, FileText, Shield, Zap, Users } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-background to-accent-900/20" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent" />

                {/* Animated orbs */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-2xl shadow-primary-500/25">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                            AI-Powered Contract
                            <span className="block gradient-text">Negotiation Made Simple</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto">
                            Negotiate contracts collaboratively with AI assistance. Create, discuss, and finalize
                            legal agreements without the complexity or expensive lawyers.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-200 hover:-translate-y-0.5"
                            >
                                Get Started Free
                                <Zap className="ml-2 w-5 h-5" />
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-200"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">
                            How It Works
                        </h2>
                        <p className="mt-4 text-lg text-white/60">
                            Three simple steps to negotiate any contract
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6 text-primary-400" />
                            </div>
                            <div className="absolute top-4 right-4 text-6xl font-bold text-white/5">1</div>
                            <h3 className="text-xl font-semibold text-white mb-3">Choose a Template</h3>
                            <p className="text-white/60">
                                Select from pre-built contract templates like freelance agreements, NDAs, or rental contracts.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-6 h-6 text-accent-400" />
                            </div>
                            <div className="absolute top-4 right-4 text-6xl font-bold text-white/5">2</div>
                            <h3 className="text-xl font-semibold text-white mb-3">Negotiate with AI</h3>
                            <p className="text-white/60">
                                Our AI mediator "Sudo" helps both parties discuss terms, suggest compromises, and reach agreement.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-6 h-6 text-green-400" />
                            </div>
                            <div className="absolute top-4 right-4 text-6xl font-bold text-white/5">3</div>
                            <h3 className="text-xl font-semibold text-white mb-3">Finalize & Download</h3>
                            <p className="text-white/60">
                                Once agreed, generate a professional PDF contract ready for signing and use.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 relative border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                                Why PseudoLawyer?
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                                        <Zap className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-1">Save Time & Money</h3>
                                        <p className="text-white/60">Skip expensive legal fees and lengthy back-and-forth emails.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                                        <Users className="w-5 h-5 text-accent-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-1">Real-time Collaboration</h3>
                                        <p className="text-white/60">Both parties negotiate together with instant messaging.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-1">AI-Powered Fairness</h3>
                                        <p className="text-white/60">Our neutral AI mediator ensures balanced, fair agreements.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative card */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-2xl" />
                            <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Sudo (AI Mediator)</p>
                                        <p className="text-sm text-white/40">Just now</p>
                                    </div>
                                </div>
                                <p className="text-white/80 leading-relaxed">
                                    "I've reviewed both proposals. The freelancer requests $5,000 while the client budgeted $4,000.
                                    May I suggest a compromise: $4,500 with a 10% bonus upon early completion? This rewards
                                    efficiency and meets both parties mid-way."
                                </p>
                                <div className="mt-6 flex gap-2">
                                    <div className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm">
                                        ✓ Client agrees
                                    </div>
                                    <div className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm">
                                        ✓ Freelancer agrees
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white font-semibold">PseudoLawyer</span>
                        </div>
                        <p className="text-white/40 text-sm">
                            © 2026 PseudoLawyer. AI-powered contract negotiation.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
