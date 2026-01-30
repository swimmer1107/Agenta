"use client";
import React from "react";
import { motion } from "framer-motion";
import {
    Brain,
    ArrowRight,
    Code2,
    Zap,
    ShieldCheck,
    Sparkles,
    Layout
} from "lucide-react";
import Link from "next/link";

export default function IntroPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 px-8 h-20 flex items-center justify-between border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                        <Brain size={18} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">OrchestrAI</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/auth/signin" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign In</Link>
                    <Link href="/auth/signup" className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-slate-200 transition-colors">Get Started</Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-40 pb-24 px-8 max-w-7xl mx-auto">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest"
                    >
                        <Sparkles size={14} />
                        Next-Gen Multi-Agent Orchestration
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1] max-w-4xl mx-auto"
                    >
                        Build Software with an
                        <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-orange-400 bg-clip-text text-transparent"> AI Hive Mind.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        OrchestrAI deploys a specialized team of autonomous agents to architect,
                        code, and test your projects in parallel. One prompt. Total automation.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <Link
                            href="/auth/signup"
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20"
                        >
                            Get Started Free <ArrowRight size={20} />
                        </Link>
                        <Link
                            href="/about"
                            className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                        >
                            How it Works
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="px-8 max-w-7xl mx-auto py-24 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Code2 size={24} />
                        </div>
                        <h3 className="text-2xl font-bold">Autonomous Execution</h3>
                        <p className="text-slate-400 leading-relaxed">Agents write production-ready code, documentation, and tests without manual intervention.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-2xl font-bold">Turbo Orchestration</h3>
                        <p className="text-slate-400 leading-relaxed">Leveraging LangGraph for complex reasoning and state-aware agent collaboration.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                            <Layout size={24} />
                        </div>
                        <h3 className="text-2xl font-bold">Full Visibility</h3>
                        <p className="text-slate-400 leading-relaxed">Stream real-time logs, code snippets, and progress across the entire team in one view.</p>
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="px-8 pb-32">
                <motion.div
                    whileInView={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    className="max-w-5xl mx-auto p-12 rounded-[32px] bg-gradient-to-br from-blue-600 to-violet-700 text-center space-y-8 shadow-2xl shadow-blue-500/20"
                >
                    <h2 className="text-4xl md:text-5xl font-bold">Ready to automate your engineering?</h2>
                    <p className="text-blue-100 text-lg max-w-xl mx-auto">Join the future of software development today. No credit card required.</p>
                    <Link
                        href="/auth/signup"
                        className="inline-flex px-10 py-5 bg-white text-black rounded-2xl text-xl font-bold hover:shadow-xl transition-all"
                    >
                        Sign Up Now
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
