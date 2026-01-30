"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon, CheckCircle2, Circle, Loader2, AlertCircle } from "lucide-react";
import clsx from "clsx";

interface AgentProgressCardProps {
    name: string;
    role: string;
    icon: LucideIcon;
    status: "idle" | "running" | "completed" | "failed";
    progress: number;
    description: string;
}

export function AgentProgressCard({ name, role, icon: Icon, status, progress, description }: AgentProgressCardProps) {
    const isRunning = status === "running";
    const isCompleted = status === "completed";
    const isFailed = status === "failed";

    // Virtual progress for smooth, human-like increments
    const [visualProgress, setVisualProgress] = useState(0);
    const lastUpdateRef = useRef<number>(Date.now());

    // Internal status text mapping
    const getStatusText = (p: number, s: string) => {
        if (s === "completed") return "Completed successfully";
        if (s === "failed") return "Execution failed";

        // Evolutionary Phases
        if (p < 30) return "Initializing...";
        if (p < 70) return p % 2 === 0 ? "Processing decisions..." : "Analyzing context...";
        if (p < 99) return "Finalizing output...";
        return "Completed successfully";
    };

    const statusText = getStatusText(visualProgress, status);

    useEffect(() => {
        if (isCompleted || isFailed) {
            setVisualProgress(100);
            return;
        }

        if (!isRunning) return;

        // Visual smoothing interval - Deliberate & Non-linear
        const timer = setInterval(() => {
            setVisualProgress(prev => {
                // If backend progress is significantly ahead, catch up faster but still smooth
                if (progress > prev + 15) return prev + 5;

                // Hit 99% cap until real completion
                if (prev >= 99) return 99;

                // Randomized non-linear increments (3-8%)
                const increment = Math.floor(Math.random() * (8 - 3 + 1)) + 3;

                // Slow down toward the end to feel intentional
                const multiplier = prev > 70 ? 0.5 : 1;
                const finalIncrement = Math.max(1, Math.round(increment * multiplier));

                return Math.min(prev + finalIncrement, 99);
            });
        }, Math.floor(Math.random() * (500 - 300 + 1)) + 300); // 300-500ms interval

        return () => clearInterval(timer);
    }, [isRunning, progress, isCompleted, isFailed]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={clsx(
                "p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden group",
                isRunning ? "bg-blue-600/5 border-blue-500/30 shadow-lg shadow-blue-500/10" :
                    isCompleted ? "bg-emerald-500/5 border-emerald-500/30" :
                        isFailed ? "bg-red-500/5 border-red-500/30" :
                            "bg-slate-900/40 border-slate-800/50 hover:border-slate-700"
            )}
        >
            {/* Calm Status Background (No pulse) */}
            {isRunning && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
            )}

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={clsx(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                        isRunning ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50" :
                            isCompleted ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" :
                                isFailed ? "bg-red-500 text-white" :
                                    "bg-slate-800 text-slate-400"
                    )}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white leading-tight">{name}</h4>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{role}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isRunning ? (
                        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <Loader2 size={10} className="animate-spin text-blue-400" />
                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Active</span>
                        </div>
                    ) : isCompleted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <CheckCircle2 size={20} className="text-emerald-500" />
                        </motion.div>
                    ) : isFailed ? (
                        <AlertCircle size={20} className="text-red-500" />
                    ) : (
                        <Circle size={20} className="text-slate-700" />
                    )}
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                <p className={clsx(
                    "text-[11px] font-bold uppercase tracking-tight transition-colors duration-500",
                    isRunning ? "text-blue-400/80" : isCompleted ? "text-emerald-400" : "text-slate-500"
                )}>
                    {statusText}
                </p>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Confidence Index</span>
                        <span className={clsx(
                            "text-xs font-black tabular-nums",
                            isRunning ? "text-blue-400" : isCompleted ? "text-emerald-400" : "text-slate-500"
                        )}>
                            {visualProgress}%
                        </span>
                    </div>

                    <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5 relative">
                        <motion.div
                            animate={{ width: `${visualProgress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={clsx(
                                "h-full rounded-full relative",
                                isRunning ? "bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]" :
                                    isCompleted ? "bg-emerald-500" :
                                        isFailed ? "bg-red-600" :
                                            "bg-slate-800"
                            )}
                        >
                            {/* Shimmer Effect */}
                            {isRunning && (
                                <motion.div
                                    animate={{ left: ["-100%", "100%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full"
                                />
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
