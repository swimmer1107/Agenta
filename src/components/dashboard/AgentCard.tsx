"use client";
import React from "react";
import { LucideIcon, Loader2, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import { useProject } from "@/context/ProjectContext";

interface AgentCardProps {
    id: string;
    name: string;
    role: string;
    icon: LucideIcon;
    description: string;
}

export function AgentCard({ id, name, role, icon: Icon, description }: AgentCardProps) {
    const { agentStatuses, progress } = useProject(); // Assuming progress context or derived
    const status = agentStatuses[id] || "idle";

    const isRunning = status === "running";
    const isCompleted = status === "completed"; // Context might keep 'completed' state
    const isWaiting = status === "idle";

    return (
        <div className={clsx(
            "relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 backdrop-blur-md",
            isRunning ? "bg-blue-900/10 border-blue-500/50 shadow-lg shadow-blue-500/10" : "bg-slate-900/40 border-slate-800/60 hover:border-slate-700 hover:bg-slate-800/40"
        )}>
            {isRunning && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent animate-pulse" />
            )}

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50 shadow-inner">
                    <Icon size={24} className={clsx(isRunning ? "text-blue-400" : "text-slate-400")} />
                </div>
                <div className="flex items-center gap-2">
                    {isRunning && <Loader2 size={16} className="animate-spin text-blue-400" />}
                    {isCompleted && <CheckCircle2 size={16} className="text-emerald-400" />}
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-0.5">{role}</h3>
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-3">{name}</p>
                <div className="h-px w-8 bg-slate-800 mb-3" />
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 italic">{description}</p>
            </div>

            {/* Status Pill */}
            <div className={clsx(
                "mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border relative z-10",
                isRunning ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                    isCompleted ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                        "bg-slate-800/50 text-slate-500 border-slate-700"
            )}>
                <div className={clsx("w-1.5 h-1.5 rounded-full", isRunning ? "bg-blue-400 animate-pulse" : isCompleted ? "bg-emerald-400" : "bg-slate-400")} />
                {isRunning ? "Working..." : isCompleted ? "Done" : "Waiting"}
            </div>
        </div>
    );
}
