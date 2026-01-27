'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
    motion, 
    useScroll, 
    useTransform, 
    useMotionTemplate, 
    useMotionValue,
    AnimatePresence,
    useSpring
} from 'framer-motion';
import { 
    ArrowRight, 
    Check, 
    ChevronRight, 
    Command, 
    FileText, 
    GitBranch, 
    MessageSquare, 
    MoreHorizontal, 
    Plus, 
    Search, 
    Settings, 
    Shield, 
    Sparkles, 
    User, 
    Users, 
    Zap,
    X,
    Maximize2,
    Minimize2,
    Bot,
    Activity,
    Hash,
    BarChart3,
    Clock,
    Code2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/navigation/Navbar';

// --- UTILITY COMPONENTS ---

const NoiseOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.04] mix-blend-overlay"
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
    />
);

const Magnetic = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null);
    const position = { x: useMotionValue(0), y: useMotionValue(0) };

    const handleMouse = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current?.getBoundingClientRect() || { height: 0, width: 0, left: 0, top: 0 };
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        position.x.set(middleX * 0.1);
        position.y.set(middleY * 0.1);
    };

    const reset = () => {
        position.x.set(0);
        position.y.set(0);
    };

    const { x, y } = position;
    return (
        <motion.div
            style={{ x, y }}
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    );
};

// --- HERO SECTION ---

const Hero = () => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const rotateX = useTransform(scrollY, [0, 500], [0, 15]);

    return (
        <section className="relative min-h-screen flex flex-col items-center pt-32 pb-20 px-4 overflow-hidden bg-[#020202] perspective-1000">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            
            {/* Content */}
            <motion.div 
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 text-center max-w-4xl mx-auto mb-20"
                style={{ y }}
            >

                <h1 className="text-5xl md:text-8xl font-display font-medium tracking-tighter text-white mb-6 leading-[0.9]">
                    PSEUDO
                    <span className="text-white/30 ml-4 italic font-serif">LAWYER</span>
                </h1>

                <p className="max-w-xl mx-auto text-lg text-white/40 mb-10 leading-relaxed font-light">
                    Resolve complex legal agreements autonomously. <br className="hidden md:block" />
                    High-frequency negotiation infrastructure.
                </p>

                <div className="flex items-center justify-center gap-4">
                    <Magnetic>
                        <Link href="/register">
                            <Button size="xl" className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-14 text-base font-medium">
                                Start Negotiation
                            </Button>
                        </Link>
                    </Magnetic>
                </div>
            </motion.div>

            {/* Interface Mockup - "The Document" */}
            <motion.div 
                initial={{ opacity: 0, rotateX: 20, y: 100 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ rotateX }}
                className="relative w-full max-w-5xl aspect-[16/10] bg-[#0A0A0A] rounded-xl border border-white/10 shadow-2xl shadow-black/80 overflow-hidden group"
            >
                {/* Window Header */}
                <div className="h-12 border-b border-white/5 bg-[#0A0A0A] flex items-center px-4 justify-between select-none">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#1A1A1A] group-hover:bg-red-500/20 transition-colors" />
                            <div className="w-3 h-3 rounded-full bg-[#1A1A1A] group-hover:bg-yellow-500/20 transition-colors" />
                            <div className="w-3 h-3 rounded-full bg-[#1A1A1A] group-hover:bg-green-500/20 transition-colors" />
                        </div>
                        <div className="h-4 w-px bg-white/5" />
                        <div className="flex items-center gap-2 text-xs text-white/40">
                            <FileText size={12} />
                            <span>Master_Services_Agreement_v3.docx</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-6 h-6 rounded-full bg-white/5 border border-[#0A0A0A] flex items-center justify-center text-[10px] text-white/40">
                                    {i}
                                </div>
                            ))}
                        </div>
                        <Button size="sm" variant="secondary" className="h-7 text-xs bg-white/5 hover:bg-white/10 border-white/5">
                            Share
                        </Button>
                    </div>
                </div>

                {/* Editor Content */}
                <div className="flex h-full">
                    {/* Document View */}
                    <div className="flex-1 bg-[#050505] p-12 overflow-hidden relative">
                        {/* Page Container */}
                        <div className="max-w-2xl mx-auto bg-[#0A0A0A] min-h-[800px] border border-white/5 p-12 shadow-2xl relative">
                            {/* Watermark/Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(#ffffff03_1px,transparent_1px)] bg-[size:20px_20px]" />
                            
                            {/* Text Content */}
                            <div className="relative space-y-6 font-serif text-white/70 leading-loose text-sm select-none">
                                <h2 className="text-xl text-white font-medium mb-8">4. INTELLECTUAL PROPERTY RIGHTS</h2>
                                <p>
                                    4.1 <span className="text-white">Ownership.</span> Consultant agrees that all Work Product 
                                    shall be the sole and exclusive property of the Company. Consultant hereby assigns 
                                    to the Company all right, title, and interest in and to the Work Product.
                                </p>
                                <div className="relative group/clause cursor-pointer">
                                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-500/50 rounded-full opacity-0 group-hover/clause:opacity-100 transition-opacity" />
                                    <p className="bg-blue-500/5 p-1 -m-1 rounded transition-colors duration-300">
                                        4.2 <span className="text-white">Background Technology.</span> Consultant retains all rights 
                                        to any pre-existing IP ("Background Technology") incorporated into the Work Product, 
                                        provided that Consultant grants Company a non-exclusive, perpetual, worldwide, 
                                        royalty-free license to use such Background Technology.
                                    </p>
                                    
                                    {/* Real-time Cursor/Comment Animation */}
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        transition={{ delay: 1.5, duration: 0.5 }}
                                        className="absolute -right-64 top-0 w-56 bg-[#151515] border border-white/10 rounded-lg p-3 shadow-xl z-20"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center">
                                                <Bot size={10} className="text-emerald-500" />
                                            </div>
                                            <span className="text-[10px] text-emerald-500 font-mono uppercase">AI Suggestion</span>
                                        </div>
                                        <p className="text-xs text-white/60 mb-2">
                                            This clause is non-standard. Most agreements require exclusive assignment.
                                        </p>
                                        <div className="flex gap-2">
                                            <button className="flex-1 bg-white/5 hover:bg-white/10 text-[10px] py-1 rounded text-white/80 transition-colors">Accept</button>
                                            <button className="flex-1 bg-white/5 hover:bg-white/10 text-[10px] py-1 rounded text-white/80 transition-colors">Reject</button>
                                        </div>
                                    </motion.div>
                                </div>
                                <p>
                                    4.3 <span className="text-white">Moral Rights.</span> Consultant hereby waives any moral rights 
                                    authors' rights or rights of integrity or attribution with respect to the Work Product.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* AI Sidebar */}
                    <div className="w-80 border-l border-white/5 bg-[#080808] flex flex-col">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <span className="text-xs font-medium text-white/50">Negotiation Agent</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="flex-1 p-4 space-y-4 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent z-10 pointer-events-none" />
                            
                            <AgentMessage 
                                text="Analyzing Section 4.2 against your playbook..." 
                                delay={0.5} 
                            />
                            <AgentMessage 
                                text="Risk detected: 'Background Technology' definition is too broad." 
                                delay={1.5} 
                                variant="warning" 
                            />
                            <AgentMessage 
                                text="Drafting counter-proposal..." 
                                delay={2.5} 
                            />
                            <div className="p-3 bg-white/5 rounded border border-white/5 text-xs text-white/70 font-mono animate-pulse">
                                &gt; Generating redline...
                            </div>
                        </div>
                        <div className="p-4 border-t border-white/5">
                            <div className="bg-[#050505] border border-white/10 rounded p-2 flex items-center gap-2">
                                <Sparkles size={14} className="text-white/30" />
                                <input type="text" placeholder="Ask Sudo..." className="bg-transparent text-xs text-white placeholder-white/20 outline-none w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

const AgentMessage = ({ text, delay, variant = 'default' }: { text: string, delay: number, variant?: 'default' | 'warning' }) => (
    <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.5 }}
        className={`text-xs p-3 rounded-lg border ${
            variant === 'warning' 
                ? 'bg-yellow-500/5 border-yellow-500/20 text-yellow-200/80' 
                : 'bg-white/5 border-white/5 text-white/60'
        }`}
    >
        {text}
    </motion.div>
);

// --- FEATURES GRID ---

const Features = () => {
    return (
        <section className="py-40 px-4 bg-[#020202] relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-24 flex items-end justify-between border-b border-white/10 pb-8">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-display font-medium text-white tracking-tighter mb-4">
                            Optimized
                            <span className="text-white/30 ml-3 italic font-serif">Tools</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Feature 1: Autonomous Redlining */}
                    <FeatureCard 
                        colSpan="md:col-span-2"
                        title="Autonomous Redlining"
                        subtitle="Real-time diff generation"
                        icon={GitBranch}
                    >
                        <div className="absolute inset-0 bg-[#0A0A0A] p-6 flex flex-col font-mono text-sm overflow-hidden">
                             {/* Header Simulation */}
                             <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-2">
                                <div className="flex gap-2 text-[10px] text-white/30">
                                    <span>DIFF_VIEW</span>
                                    <span>::</span>
                                    <span>MASTER_V2.1</span>
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                </div>
                             </div>

                             {/* Diff Content */}
                             <div className="space-y-3 relative z-10">
                                {/* Line 1 */}
                                <div className="flex items-start gap-4 opacity-40">
                                    <span className="text-white/20 select-none">01</span>
                                    <span>Interest shall accrue at <span className="line-through decoration-red-500">5% per annum</span>.</span>
                                </div>
                                {/* Line 2 (Active) */}
                                <div className="relative">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '100%' }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className="absolute inset-0 bg-emerald-500/10 border-l-2 border-emerald-500 -mx-2"
                                    />
                                    <div className="flex items-start gap-4 relative z-10">
                                        <span className="text-emerald-500/50 select-none">02</span>
                                        <span className="text-emerald-200">
                                            Interest shall accrue at <span className="bg-emerald-500/20 text-emerald-400 px-1 rounded">PRIME + 2%</span> per annum.
                                        </span>
                                    </div>
                                </div>
                                {/* Line 3 */}
                                <div className="flex items-start gap-4 opacity-40">
                                    <span className="text-white/20 select-none">03</span>
                                    <span>Payment due within 30 days of invoice.</span>
                                </div>
                             </div>

                             {/* Floating Cursor/Tooltip */}
                             <motion.div 
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-6 right-6 bg-[#151515] border border-white/10 p-3 rounded-lg shadow-2xl z-20 max-w-[200px]"
                             >
                                <div className="flex items-center gap-2 mb-1">
                                    <Bot size={12} className="text-blue-400" />
                                    <span className="text-[10px] text-blue-400 font-bold uppercase">Auto-Correction</span>
                                </div>
                                <p className="text-[10px] text-white/60 leading-relaxed">
                                    Adjusted to market standard based on jurisdiction (NY).
                                </p>
                             </motion.div>
                             
                             {/* Scanline Effect */}
                             <motion.div 
                                initial={{ top: "-10%" }}
                                animate={{ top: "110%" }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent pointer-events-none"
                             />
                        </div>
                    </FeatureCard>

                    {/* Feature 2: Tone Modulation */}
                    <FeatureCard 
                        title="Tone Modulation"
                        subtitle="Sentiment control matrix"
                        icon={Activity}
                    >
                        <div className="absolute inset-0 bg-[#0A0A0A] p-6 flex flex-col items-center justify-center">
                            {/* Visualizer */}
                            <div className="flex items-end gap-1 h-16 mb-6">
                                {[40, 70, 30, 80, 50, 90, 40, 60, 30, 50].map((h, i) => (
                                    <motion.div 
                                        key={i}
                                        animate={{ height: [`${h}%`, `${h + 20}%`, `${h}%`] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                        className="w-2 bg-white/20 rounded-t-sm"
                                        style={{ backgroundColor: i === 5 ? '#3b82f6' : undefined }}
                                    />
                                ))}
                            </div>

                            {/* Slider UI */}
                            <div className="w-full max-w-[200px] relative h-8">
                                <div className="absolute inset-x-0 top-1/2 h-1 bg-white/10 rounded-full" />
                                <motion.div 
                                    animate={{ left: ["20%", "80%", "20%"] }}
                                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                                    className="absolute top-1/2 -mt-2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10"
                                >
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-blue-400 font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                        ADJUSTING...
                                    </div>
                                </motion.div>
                            </div>

                            {/* Text Morph */}
                            <div className="h-8 mt-2 relative w-full text-center">
                                <AnimatePresence mode='wait'>
                                    <motion.p
                                        key="aggressive"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                        className="absolute inset-0 text-xs text-white/50 font-serif italic"
                                    >
                                        "We demand immediate payment..."
                                    </motion.p>
                                    <motion.p
                                        key="diplomatic"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 0, y: 0 }} // Hidden initially, faking the swap
                                        className="absolute inset-0 text-xs text-emerald-400/80 font-serif italic"
                                    >
                                        "We kindly request remittance..."
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </div>
                    </FeatureCard>

                    {/* Feature 3: Contextual Threads */}
                    <FeatureCard 
                        title="Contextual Threads"
                        subtitle="Encrypted in-line comms"
                        icon={MessageSquare}
                    >
                        <div className="absolute inset-0 bg-[#0A0A0A] p-6 flex flex-col">
                            {/* Chat Header */}
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Secure_Channel_01</span>
                                </div>
                            </div>

                            <div className="space-y-3 mt-auto">
                                {/* Message 1 */}
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center text-[10px] text-purple-400 font-bold border border-purple-500/20">JD</div>
                                    <div className="flex-1">
                                        <div className="bg-white/5 rounded-lg rounded-tl-none p-2 text-[11px] text-white/80 border border-white/5">
                                            Can we clarify the cap?
                                        </div>
                                        <span className="text-[9px] text-white/20 pl-1">10:42 AM</span>
                                    </div>
                                </div>

                                {/* Message 2 (AI) */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    className="flex gap-3 flex-row-reverse"
                                >
                                    <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-400 font-bold border border-emerald-500/20">AI</div>
                                    <div className="flex-1 text-right">
                                        <div className="bg-emerald-900/10 rounded-lg rounded-tr-none p-2 text-[11px] text-emerald-100/80 border border-emerald-500/10 inline-block text-left">
                                            Market standard is 2x.
                                        </div>
                                        <div className="text-[9px] text-white/20 pr-1 mt-1">Just now</div>
                                    </div>
                                </motion.div>

                                {/* Typing Indicator */}
                                <div className="flex gap-1 pl-9 opacity-50">
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} className="w-1 h-1 bg-white rounded-full" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1 h-1 bg-white rounded-full" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1 h-1 bg-white rounded-full" />
                                </div>
                            </div>
                        </div>
                    </FeatureCard>

                    {/* Feature 4: Immutable Audit */}
                    <FeatureCard 
                        colSpan="md:col-span-2"
                        title="Immutable Ledger"
                        subtitle="Cryptographic verification"
                        icon={Hash}
                    >
                         <div className="absolute inset-0 bg-[#0A0A0A] p-6 font-mono text-xs flex flex-col">
                            {/* Header */}
                            <div className="flex items-center gap-4 text-white/30 border-b border-white/5 pb-2 mb-2 uppercase tracking-wider text-[10px]">
                                <div className="w-24">Timestamp</div>
                                <div className="w-20">Block</div>
                                <div className="flex-1">Hash / Event</div>
                                <div className="w-16 text-right">Status</div>
                            </div>

                            {/* Rows */}
                            <div className="space-y-1 relative z-10">
                                {[
                                    { time: "09:00:01", block: "849201", event: "CONTRACT_INIT", hash: "0x7f...3a9c" },
                                    { time: "09:15:22", block: "849202", event: "CLAUSE_UPDATE", hash: "0x3b...91f2" },
                                    { time: "09:16:05", block: "849203", event: "CONFLICT_FLAG", hash: "0x1c...88e1", alert: true },
                                    { time: "10:30:11", block: "849204", event: "VERSION_MERGE", hash: "0x9d...22b4" },
                                    { time: "10:32:45", block: "849205", event: "FINAL_SIGN", hash: "0xe4...11c0", active: true },
                                ].map((row, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.15 }}
                                        className={`flex items-center gap-4 py-1.5 px-2 rounded border border-transparent ${row.active ? 'bg-white/5 border-white/10' : 'hover:bg-white/5'}`}
                                    >
                                        <div className="w-24 text-white/40">{row.time}</div>
                                        <div className="w-20 text-blue-500/60">#{row.block}</div>
                                        <div className="flex-1 flex gap-2">
                                            <span className={row.alert ? 'text-yellow-500' : 'text-white/80'}>{row.event}</span>
                                            <span className="text-white/20 hidden sm:block">{row.hash}</span>
                                        </div>
                                        <div className="w-16 text-right">
                                            {row.active ? (
                                                <span className="text-emerald-500 flex justify-end items-center gap-1">
                                                    <Check size={10} /> OK
                                                </span>
                                            ) : (
                                                <span className="text-white/20">VRFD</span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Verification Overlay Animation */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 2 }}
                                whileInView={{ opacity: 0.1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 1 }}
                                className="absolute right-10 bottom-4 pointer-events-none"
                            >
                                <div className="w-32 h-32 border-4 border-emerald-500 rounded-full flex items-center justify-center -rotate-12">
                                    <span className="text-2xl font-black text-emerald-500 uppercase tracking-widest">Verified</span>
                                </div>
                            </motion.div>
                         </div>
                    </FeatureCard>

                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ title, subtitle, colSpan = "", children, icon: Icon }: { title: string, subtitle: string, colSpan?: string, children: React.ReactNode, icon?: any }) => (
    <div className={`relative group h-72 rounded-xl border border-white/10 bg-[#080808] overflow-hidden ${colSpan}`}>
        {/* Always visible content */}
        <div className="absolute inset-0 z-0">
            {children}
        </div>
        
        {/* Glass Overlay for Header */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-20 flex items-end justify-between pointer-events-none">
            <div>
                <h3 className="text-lg font-medium text-white mb-0.5 flex items-center gap-2">
                    {Icon && <Icon size={16} className="text-white/50" />}
                    {title}
                </h3>
                <p className="text-xs text-white/40 font-mono">{subtitle}</p>
            </div>
            
            {/* Corner Tech Artifact */}
            <div className="hidden group-hover:block">
                 <ArrowRight size={16} className="text-white/30 -rotate-45" />
            </div>
        </div>

        {/* Decorative Borders */}
        <div className="absolute top-0 left-0 w-full h-full border border-white/5 rounded-xl pointer-events-none group-hover:border-white/20 transition-colors" />
        <div className="absolute top-0 right-0 p-2 opacity-50">
            <div className="w-1.5 h-1.5 bg-white/20 rounded-full group-hover:bg-emerald-500 transition-colors" />
        </div>
    </div>
);

// --- FOOTER ---

const Footer = () => (
    <footer className="bg-[#020202] border-t border-white/5 py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
            <div>
                <h1 className="text-4xl md:text-8xl font-display font-bold text-white tracking-tighter mb-8 leading-none opacity-20 hover:opacity-100 transition-opacity duration-500 cursor-default">
                    PSEUDO<br />LAWYER
                </h1>
                <div className="flex gap-6 text-sm text-white/40 font-mono">
                    <a href="#" className="hover:text-white transition-colors">Manifesto</a>
                    <a href="#" className="hover:text-white transition-colors">Protocol</a>
                    <a href="#" className="hover:text-white transition-colors">Ledger</a>
                </div>
            </div>
            
            <div className="text-right">
                <div className="mb-4 flex justify-end gap-2">
                </div>
                <p className="text-sm text-white/40 font-mono mb-2">PSEUDO LAWYER INC.</p>
                <div className="text-xs text-white/10 font-mono">
                    © 2026 PSEUDOLAWYER INC.
                </div>
            </div>
        </div>
    </footer>
);

export default function Home() {
    return (
        <main className="min-h-screen bg-[#020202] text-white selection:bg-white/20">
            <NoiseOverlay />
            <Hero />
            <Features />
            <Footer />
        </main>
    );
}
