"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProject } from "@/context/ProjectContext";
import { useRouter } from "next/navigation";
import {
    Clock, Terminal, FileCode, FileText, LayoutDashboard, ChevronRight,
    Share2, Download, Mail, CheckCircle2, AlertCircle, Brain, Map, Code, ShieldCheck,
    MessageSquare, Activity, FileJson, X, FileSearch, Link as LinkIcon, FileCheck
} from "lucide-react";
import clsx from "clsx";
import { AgentCard } from "./AgentCard";
import { AgentProgressCard } from "./AgentProgressCard";
import { CodeBlock } from "../ui/CodeBlock";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

export function ExecutionView() {
    const {
        logs: rawLogs, plan, requirements, files, agentStatuses, agentProgress,
        isCompleted, isProcessing, metadata, threadId, currentAgent
    } = useProject();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"live_logs" | "full_output">("live_logs");
    const [showSidebar, setShowSidebar] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [shareDropdownOpen, setShareDropdownOpen] = useState(false);

    // DELIBERATE BOOT LOGIC
    const [isBooting, setIsBooting] = useState(true);
    useEffect(() => {
        const delay = Math.floor(Math.random() * (900 - 600 + 1)) + 600;
        const timer = setTimeout(() => setIsBooting(false), delay);
        return () => clearTimeout(timer);
    }, []);

    // LOG PACING LOGIC
    const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
    const pendingLogsRef = useRef<string[]>([]);
    const [isHoveringLogs, setIsHoveringLogs] = useState(false);

    useEffect(() => {
        // Find new logs
        const newLogs = rawLogs.filter(log => !displayedLogs.includes(log) && !pendingLogsRef.current.includes(log));

        if (newLogs.length > 0) {
            // Narrative Sync: Only queue logs belonging to the active agent or system
            const agentMapping: Record<string, string> = {
                manager: "Manager",
                requirement: "Alice",
                planner: "Bob",
                executor: "Charlie",
                qa: "Diana",
                reporting: "Reporting"
            };
            const activeLabel = currentAgent ? agentMapping[currentAgent] : null;

            const filteredLogs = newLogs.filter(log => {
                if (log.startsWith("System:")) return true;
                if (!activeLabel) return true;
                return log.includes(`${activeLabel}:`);
            });

            if (filteredLogs.length > 0) {
                pendingLogsRef.current = [...pendingLogsRef.current, ...filteredLogs];
            }
        }
    }, [rawLogs, displayedLogs, currentAgent]);

    useEffect(() => {
        if (isBooting || isHoveringLogs) return;

        const interval = setInterval(() => {
            if (pendingLogsRef.current.length > 0) {
                const nextLog = pendingLogsRef.current[0];

                // Narrative Sync: Only show logs if they belong to the current agent or system
                // Or if we want strict sequential logs, we just pop them slowly.
                // The requirement is "Logs appear ONLY for the currently active agent".

                pendingLogsRef.current = pendingLogsRef.current.slice(1);
                setDisplayedLogs(prev => [...prev, nextLog]);
            }
        }, Math.floor(Math.random() * (700 - 400 + 1)) + 400); // 400-700ms

        return () => clearInterval(interval);
    }, [isBooting, isHoveringLogs]);

    // COMPLETION ALERT LOGIC
    const [showAlert, setShowAlert] = useState(false);
    useEffect(() => {
        if (isCompleted && !showAlert) {
            const timer = setTimeout(() => setShowAlert(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [isCompleted, showAlert]);

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => setShowAlert(false), 4500);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    // Auto-scroll logs
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [displayedLogs]);

    // Trigger confetti on completion
    useEffect(() => {
        if (isCompleted && !showConfetti) {
            setShowConfetti(true);
        }
    }, [isCompleted, showConfetti]);

    const [visualGlobalProgress, setVisualGlobalProgress] = useState(0);

    // Global Progress Calculation: weighted average of all agents
    const AGENTS = [
        { id: "manager", name: "Manager", role: "Project Lead", icon: Brain, description: "Coordinating swarm workflow", core: true },
        { id: "requirement", name: "Alice", role: "Requirements Agent", icon: FileText, description: "Extracting core specifications", core: true },
        { id: "planner", name: "Bob", role: "Planning Agent", icon: Map, description: "Architecting the technical path", core: true },
        { id: "executor", name: "Charlie", role: "Coding Agent", icon: Code, description: "Generating implementation assets", core: true },
        { id: "qa", name: "Diana", role: "QA Agent", icon: ShieldCheck, description: "Validating output quality", core: false },
        { id: "reporting", name: "Reporting", role: "Documentation", icon: FileCheck, description: "Finalizing project materials", core: false }
    ];

    useEffect(() => {
        if (isCompleted) {
            setVisualGlobalProgress(100);
            return;
        }

        // Global Progress is derived from agent milestones + active progress
        const completedCount = AGENTS.filter(a => agentStatuses[a.id] === "completed").length;
        const activeAgentId = AGENTS.find(a => agentStatuses[a.id] === "running")?.id;
        const activeProgress = activeAgentId ? (agentProgress[activeAgentId] || 0) : 0;

        // Base progress from completed agents (e.g., each of 6 agents is 16.6%)
        const baseProgress = (completedCount / AGENTS.length) * 100;
        // Add a fraction of the current agent's progress
        const contribution = (activeProgress / 100) * (100 / AGENTS.length);

        const targetProgress = Math.round(baseProgress + contribution);

        const timer = setInterval(() => {
            setVisualGlobalProgress(prev => {
                if (prev >= targetProgress) return prev;
                // Move in very small, calm increments
                const diff = targetProgress - prev;
                const increment = Math.max(1, Math.floor(diff * 0.05));
                return Math.min(prev + increment, 99);
            });
        }, 200);

        return () => clearInterval(timer);
    }, [agentProgress, agentStatuses, isCompleted]);

    const globalProgress = visualGlobalProgress;

    const handleDownload = () => {
        if (!isCompleted) return;
        const doc = new jsPDF();
        const title = metadata?.title || "OrchestrAI Evaluation Report";
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text(title, 20, 30);
        doc.setFontSize(10);
        doc.text(`Generated by OrchestrAI - ${new Date().toLocaleString()}`, 20, 38);
        doc.save(`${(metadata?.title || "Project").replace(/\s+/g, '_')}_Report.pdf`);
        toast.success("PDF Report Generated");
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`, { icon: '📋' });
        setShareDropdownOpen(false);
    };

    return (
        <div className="flex h-[calc(100vh-120px)] gap-6 overflow-hidden animate-in fade-in duration-700">

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">

                {/* HEADER ACTION GROUP */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/60 p-6 rounded-[32px] border border-slate-800/50 backdrop-blur-xl shadow-2xl relative overflow-visible group shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-violet-500/5 group-hover:opacity-100 transition-opacity rounded-[32px] pointer-events-none" />

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
                            <Activity className="text-white" size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">{metadata?.title || "Orchestrating..."}</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <span className={clsx(
                                    "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    isCompleted ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse"
                                )}>
                                    {isCompleted ? "Verified & Ready" : "Swarms Working"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 relative z-50">
                        <button
                            onClick={() => router.push(`/report/${threadId}`)}
                            disabled={!isCompleted}
                            className={clsx(
                                "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border",
                                !isCompleted
                                    ? "bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed"
                                    : "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-95"
                            )}
                        >
                            <FileSearch size={18} />
                            View Report
                        </button>

                        <button
                            onClick={handleDownload}
                            disabled={!isCompleted}
                            className={clsx(
                                "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border",
                                !isCompleted
                                    ? "bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed"
                                    : "bg-slate-800 text-white border-slate-700 hover:bg-slate-700 active:scale-95"
                            )}
                        >
                            <Download size={18} />
                        </button>

                        {/* Share Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
                                className="p-3 bg-slate-800 text-white border border-slate-700 rounded-2xl hover:bg-slate-700 transition-all active:scale-95"
                            >
                                <Share2 size={20} />
                            </button>

                            <AnimatePresence>
                                {shareDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-2 z-[100] backdrop-blur-2xl"
                                    >
                                        <button onClick={() => copyToClipboard("Report content placeholder", "Full report")} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 transition-colors text-left uppercase font-bold tracking-widest">
                                            <FileText size={14} /> Copy Full Report
                                        </button>
                                        <button onClick={() => copyToClipboard(`${window.location.origin}/report/${threadId}`, "Share link")} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 transition-colors text-left uppercase font-bold tracking-widest">
                                            <LinkIcon size={14} /> Share Link
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* GLOBAL PROGRESS STRIP */}
                <div className="space-y-4 bg-slate-900/40 p-6 rounded-[32px] border border-slate-800/50 shrink-0">
                    <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-2">
                            <Activity className="text-blue-500" size={16} />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Global Orchestration Progress</span>
                        </div>
                        <span className="text-2xl font-black text-white tabular-nums">{globalProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-white/5 relative">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 via-violet-600 to-emerald-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${globalProgress}%` }}
                            transition={{ type: "spring", stiffness: 30, damping: 10 }}
                        >
                            {/* Shimmer Effect */}
                            {!isCompleted && (
                                <motion.div
                                    animate={{ left: ["-100%", "100%"] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full"
                                />
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* AGENT GRID - CORE AGENTS */}
                <div className="space-y-4 shrink-0">
                    <div className="flex items-center gap-2 px-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Core Swarm</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {AGENTS.filter(a => a.core).map(agent => (
                            <AgentProgressCard
                                key={agent.id}
                                {...agent}
                                status={isBooting ? "idle" : agentStatuses[agent.id] || "idle"}
                                progress={isBooting ? 0 : agentProgress[agent.id] || 0}
                            />
                        ))}
                    </div>
                </div>

                {/* SECONDARY AGENTS */}
                <div className="space-y-4 shrink-0">
                    <div className="flex items-center gap-2 px-2">
                        <span className="w-2 h-2 rounded-full bg-slate-600" />
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Support Sytems</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-80 scale-95 origin-top-left">
                        {AGENTS.filter(a => !a.core).map(agent => (
                            <AgentProgressCard
                                key={agent.id}
                                {...agent}
                                status={isBooting ? "idle" : agentStatuses[agent.id] || "idle"}
                                progress={isBooting ? 0 : agentProgress[agent.id] || 0}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* SIDE PANEL CONSOLE */}
            <div className={clsx(
                "w-[400px] flex flex-col gap-4 border-l border-slate-800 pl-6 transition-all duration-300 shrink-0",
                !showSidebar && "w-0 overflow-hidden opacity-0 pl-0 border-0"
            )}>
                <div className="flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <Terminal size={16} className="text-emerald-400" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">Real-time Trace</span>
                    </div>
                    <button
                        onClick={() => setShowSidebar(false)}
                        className="p-1 hover:bg-slate-800 rounded-lg text-slate-500"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex-1 bg-black/40 border border-slate-800/50 rounded-3xl p-4 overflow-hidden relative"
                    onMouseEnter={() => setIsHoveringLogs(true)}
                    onMouseLeave={() => setIsHoveringLogs(false)}
                >
                    <div className="h-full overflow-y-auto custom-scrollbar space-y-3 font-mono text-[11px]">
                        {displayedLogs.map((log: string, i: number) => (
                            <div key={i} className="flex gap-3 text-slate-300 leading-relaxed border-b border-white/5 pb-2">
                                <span className="text-slate-600 select-none shrink-0">{(i + 1).toString().padStart(3, '0')}</span>
                                <span className={clsx(
                                    log.includes("Manager:") ? "text-violet-400" :
                                        log.includes("Alice:") || log.includes("Requirement:") ? "text-amber-400" :
                                            log.includes("Bob:") || log.includes("Planner:") ? "text-cyan-400" :
                                                log.includes("Charlie:") || log.includes("Executor:") ? "text-emerald-400" :
                                                    log.includes("Diana:") || log.includes("QA:") ? "text-pink-400" :
                                                        log.includes("System:") ? "text-blue-400 font-bold" : "text-slate-400"
                                )}>{log}</span>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>
                </div>
            </div>

            {/* PANEL TOGGLE BUTTON (Hidden when sidebar is open) */}
            {!showSidebar && (
                <button
                    onClick={() => setShowSidebar(true)}
                    className="fixed right-6 bottom-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60]"
                >
                    <Terminal size={20} />
                </button>
            )}
            {/* COMPLETION ALERT */}
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed top-24 right-8 z-[100] w-80 p-6 rounded-3xl bg-slate-900/80 border border-blue-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(37,99,235,0.2)] flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/30">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h4 className="font-black text-white text-sm tracking-tight">Execution completed successfully</h4>
                            <p className="text-[11px] text-slate-400 font-medium">All agents finished orchestration</p>
                        </div>
                        {/* Soft Glow */}
                        <div className="absolute inset-0 bg-blue-500/5 rounded-3xl pointer-events-none" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
