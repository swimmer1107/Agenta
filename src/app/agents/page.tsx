"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    MessageSquare,
    Code2,
    FileText,
    ShieldCheck,
    LineChart,
    Cpu,
    Zap,
    ChevronRight,
    Terminal,
    Wrench,
    CheckCircle2
} from "lucide-react";

const AGENTS = [
    {
        name: "Delivery Manager",
        role: "Project Orchestration",
        icon: Brain,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        desc: "Oversees the entire team and coordinates handoffs between specialized agents.",
        responsibilities: [
            "Agent task delegating",
            "Conflict resolution in logic",
            "Final quality gatekeeper"
        ],
        tools: ["LangGraph", "Decision Logs", "Audit Trail"]
    },
    {
        name: "Business Analyst",
        role: "Requirements Engineering",
        icon: FileText,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        desc: "Translates high-level prompts into granular technical requirements and user stories.",
        responsibilities: [
            "Prompt decomposition",
            "Schema definition",
            "User story generation"
        ],
        tools: ["NLP Parsers", "JSON Schema", "Requirement Traceability"]
    },
    {
        name: "Solution Architect",
        role: "System Planning",
        icon: LineChart,
        color: "text-violet-400",
        bg: "bg-violet-500/10",
        desc: "Designs the file structure, technology stack, and logical flow of the application.",
        responsibilities: [
            "Architecture mapping",
            "Dependency management",
            "Module planning"
        ],
        tools: ["System Design", "UML Modeling", "Stack Selection"]
    },
    {
        name: "Senior Developer",
        role: "Autonomous Coding",
        icon: Code2,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        desc: "Writes the actual implementation, adhering to the architect's planning and best practices.",
        responsibilities: [
            "Code generation",
            "API implementation",
            "Clean code standards"
        ],
        tools: ["Next.js", "Tailwind CSS", "TypeScript Engine"]
    },
    {
        name: "QA Engineer",
        role: "Quality Assurance",
        icon: ShieldCheck,
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        desc: "Reviews code for bugs, security vulnerabilities, and adherence to requirements.",
        responsibilities: [
            "Code sanity checks",
            "Error handling validation",
            "Requirement matching"
        ],
        tools: ["Static Analysis", "Rule Engines", "Validation Suites"]
    },
    {
        name: "Internal Auditor",
        role: "Final Verification",
        icon: MessageSquare,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        desc: "Provides a final sanity check and prepares the delivery report for the user.",
        responsibilities: [
            "Report generation",
            "User feedback loops",
            "State persistence"
        ],
        tools: ["Markdown Renderer", "Telemetry", "Audit Engine"]
    }
];

export default function AgentsPage() {
    const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20">
            <header className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <Users size={20} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">OrchestrAI Elite Swarm</h1>
                        <p className="text-slate-400 font-medium max-w-2xl">
                            Meet the specialized AI agents coordinating your project's lifecycle. Each agent is a specialized expert powered by advanced reasoning.
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {AGENTS.map((agent, i) => {
                    const isHovered = hoveredAgent === agent.name;

                    return (
                        <motion.div
                            key={agent.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onMouseEnter={() => setHoveredAgent(agent.name)}
                            onMouseLeave={() => setHoveredAgent(null)}
                            className="relative h-[320px] isolate"
                        >
                            {/* Base Card */}
                            <div className={clsx(
                                "absolute inset-0 p-8 bg-slate-900 border border-slate-800 rounded-[32px] transition-all duration-500 flex flex-col justify-between overflow-hidden group",
                                isHovered ? "border-blue-500/30 scale-[1.02] shadow-2xl shadow-blue-500/10" : ""
                            )}>
                                {/* Background Glow */}
                                <div className={clsx(
                                    "absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full pointer-events-none transition-opacity duration-700",
                                    agent.bg,
                                    isHovered ? "opacity-100" : "opacity-0"
                                )} />

                                <div className="space-y-6">
                                    <div className={clsx(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl",
                                        agent.bg, agent.color,
                                        isHovered ? "scale-110 rotate-3" : "border border-white/5 shadow-xl"
                                    )}>
                                        <agent.icon size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">{agent.name}</h3>
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">{agent.role}</p>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed max-w-[90%]">
                                        {agent.desc}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 uppercase">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        GPT-4o Stable
                                    </div>
                                    <ChevronRight size={18} className={clsx("transition-all duration-300", isHovered ? "text-blue-400 translate-x-1" : "text-slate-700")} />
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute inset-0 p-8 bg-blue-600 rounded-[32px] z-20 flex flex-col gap-6 shadow-2xl overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-[60px] rounded-full -mr-10 -mt-10" />

                                        <div>
                                            <h4 className="text-xs font-black text-blue-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <CheckCircle2 size={12} /> Key Responsibilities
                                            </h4>
                                            <ul className="space-y-2">
                                                {agent.responsibilities.map(r => (
                                                    <li key={r} className="text-sm font-bold text-white flex items-center gap-2">
                                                        <div className="w-1 h-1 bg-white rounded-full shrink-0" />
                                                        {r}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="pt-2 border-t border-white/10">
                                            <h4 className="text-xs font-black text-blue-100 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Wrench size={12} /> Core Tools
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {agent.tools.map(t => (
                                                    <span key={t} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-mono text-blue-50 font-medium">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-4 flex items-center justify-between text-[10px] font-black text-white/60 uppercase tracking-tighter">
                                            <span>Autonomous Class-A Agent</span>
                                            <span>v2.2.0</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <div className="p-10 rounded-[40px] bg-gradient-to-br from-blue-600/10 to-violet-600/10 border border-blue-500/20 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap size={120} />
                </div>
                <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-2xl shadow-blue-600/20 rotate-3 group-hover:rotate-6 transition-transform">
                    <Zap size={40} />
                </div>
                <div className="space-y-3 relative z-10 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white tracking-tight">Dynamic Hive Persistence</h3>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                        Nexus AI uses a low-latency state bus to ensure info is never lost between agents.
                        Each team member builds upon the work of the previous one, creating a seamless development lifecycle.
                    </p>
                </div>
            </div>
        </div>
    );
}

import { Users } from "lucide-react";

function clsx(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
