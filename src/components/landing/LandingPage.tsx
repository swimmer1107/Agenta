"use client";
import { motion } from "framer-motion";
import { Brain, Zap, Users, ShieldCheck, Sparkles, Rocket, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
    const features = [
        {
            icon: Brain,
            title: "Autonomous Intelligence",
            description: "AI agents that think, plan, and adapt using advanced LLM reasoning",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: Users,
            title: "Specialized Team",
            description: "Dedicated roles: Managers, Analysts, Developers, and QA Engineers",
            color: "from-violet-500 to-purple-500"
        },
        {
            icon: Zap,
            title: "Real-Time Execution",
            description: "Watch your project come to life with live streaming updates",
            color: "from-orange-500 to-amber-500"
        },
        {
            icon: ShieldCheck,
            title: "Safety First",
            description: "Every output reviewed by dedicated QA agents for quality assurance",
            color: "from-green-500 to-emerald-500"
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px]"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px]"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-20"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
                            <Brain size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            OrchestrAI
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/auth/signin">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-white font-medium transition-all border border-slate-700"
                            >
                                Sign In
                            </motion.button>
                        </Link>
                        <Link href="/auth/signup">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium shadow-lg shadow-blue-500/25 transition-all"
                            >
                                Get Started
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {/* Hero Section */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6"
                    >
                        <Sparkles size={16} />
                        <span>Powered by Advanced AI Agents</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
                    >
                        <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-orange-400 bg-clip-text text-transparent">
                            Autonomous AI
                        </span>
                        <br />
                        <span className="text-white">Project Manager</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Your Digital Dev Team for Any Idea. Watch AI agents collaborate in real-time to plan, code, and deliver your projects.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link href="/auth/signup">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-orange-600 hover:from-blue-500 hover:via-violet-500 hover:to-orange-500 text-white font-semibold shadow-2xl shadow-blue-500/30 transition-all flex items-center gap-2 text-lg"
                            >
                                <Rocket size={20} />
                                Start Building Now
                                <ArrowRight size={20} />
                            </motion.button>
                        </Link>
                        <Link href="/about">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-white font-semibold border border-slate-700 transition-all"
                            >
                                Learn More
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 hover:border-slate-700 transition-all group"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                <feature.icon size={24} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-3xl p-10 mb-20"
                >
                    <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: "1", title: "Describe Your Idea", desc: "Simply tell us what you want to build" },
                            { step: "2", title: "Watch Agents Work", desc: "See AI team members collaborate in real-time" },
                            { step: "3", title: "Get Results", desc: "Download code, reports, and documentation" }
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-lg shadow-blue-500/30">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="text-center bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm border border-slate-800/50 rounded-3xl p-12 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-orange-500/10" />
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Ideas?</h2>
                        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                            Join thousands of developers using AI agents to build faster and smarter.
                        </p>
                        <Link href="/auth/signup">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-orange-600 hover:from-blue-500 hover:via-violet-500 hover:to-orange-500 text-white font-bold shadow-2xl shadow-blue-500/30 transition-all text-lg inline-flex items-center gap-3"
                            >
                                <Sparkles size={20} />
                                Get Started Free
                                <ArrowRight size={20} />
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="mt-20 pt-10 border-t border-slate-800/50 text-center text-slate-500 text-sm"
                >
                    <p>© 2026 OrchestrAI. Built for the Agentathon Hackathon.</p>
                    <div className="flex gap-6 justify-center mt-4">
                        <Link href="/about" className="hover:text-slate-300 transition-colors">About Us</Link>
                        <span>•</span>
                        <Link href="/auth/signin" className="hover:text-slate-300 transition-colors">Sign In</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
