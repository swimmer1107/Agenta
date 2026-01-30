"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Rocket, History, Users, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
    const { data: session } = useSession();

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20">
            {/* Header Section */}
            <div className="space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-blue-400 font-medium"
                >
                    <Sparkles size={18} />
                    <span>Welcome back, {session?.user?.name?.split(' ')[0]}</span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent"
                >
                    Your Autonomous Team
                    <br />is Ready.
                </motion.h1>
            </div>

            {/* Main Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link
                        href="/dashboard/new"
                        className="group relative block p-8 rounded-3xl bg-blue-600 overflow-hidden shadow-2xl shadow-blue-500/20"
                    >
                        <div className="absolute top-0 right-0 p-8 text-blue-400/20 transition-transform group-hover:scale-110 group-hover:-rotate-12">
                            <Rocket size={120} />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                <PlusCircleIcon />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">New Project</h3>
                                <p className="text-blue-100 text-sm leading-relaxed">
                                    Launch a multi-agent swarm to build your next big idea from scratch.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-white font-medium group-hover:gap-4 transition-all pt-4 text-sm">
                                Get Started <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link
                        href="/history"
                        className="group h-full block p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                    >
                        <div className="space-y-4 h-full flex flex-col">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-400">
                                <History size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white mb-2">Recent Work</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Pick up where you left off or review completed software deliverables.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 font-medium pt-4 text-sm">
                                View History <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link
                        href="/agents"
                        className="group h-full block p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                    >
                        <div className="space-y-4 h-full flex flex-col">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-violet-400">
                                <Users size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white mb-2">The Agents</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Meet your digital teammates and configure their individual skillsets.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 font-medium pt-4 text-sm">
                                Management <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>

            {/* Quick Stats / Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-t border-slate-900"
            >
                <div className="flex gap-4">
                    <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
                    <div>
                        <h4 className="font-bold text-white">Enterprise Ready</h4>
                        <p className="text-sm text-slate-500">Secure, isolated environments for every execution.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <History className="text-blue-500 shrink-0" size={24} />
                    <div>
                        <h4 className="font-bold text-white">Full Persistence</h4>
                        <p className="text-sm text-slate-500">Never lose a thread. Every decision is indexed.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Rocket className="text-orange-500 shrink-0" size={24} />
                    <div>
                        <h4 className="font-bold text-white">Turbo Scaling</h4>
                        <p className="text-sm text-slate-500">Autonomous scaling for complex multi-file projects.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function PlusCircleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
    )
}
