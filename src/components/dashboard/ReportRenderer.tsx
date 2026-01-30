"use client";
import React from "react";
import {
    FileText, CheckCircle2, AlertTriangle, List,
    ArrowRight, Lightbulb, ShieldCheck, Cpu
} from "lucide-react";
import clsx from "clsx";

interface ReportRendererProps {
    title: string;
    description: string;
    requirements: string | null;
    plan: any[] | null;
    isCompleted: boolean;
}

export function ReportRenderer({ title, description, requirements, plan, isCompleted }: ReportRendererProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* 1. Header Section */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600/10 to-violet-600/10 border border-blue-500/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldCheck size={120} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-blue-400 mb-3 text-sm font-bold uppercase tracking-widest">
                        <Cpu size={16} /> Autonomous Evaluation Report
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">{title || "Project Analysis"}</h1>
                    <div className="max-w-3xl text-slate-300 leading-relaxed text-lg">
                        {description}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. Executive Summary & Requirements */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Executive Summary Placeholder/Derived */}
                    <Section
                        title="Executive Summary"
                        icon={Lightbulb}
                        color="text-amber-400"
                    >
                        <p className="text-slate-300 leading-relaxed italic">
                            {isCompleted
                                ? "The AI team has completed a comprehensive evaluation of the project requirements. The proposed architecture follows industry best practices for scalability and maintainability."
                                : "Evaluation in progress. The swarm is currently synthesizing requirements and planning the implementation strategy."}
                        </p>
                    </Section>

                    {/* Requirements Analysis */}
                    <Section
                        title="Requirement Specifications"
                        icon={FileText}
                        color="text-blue-400"
                    >
                        {requirements ? (
                            <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50 text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-96 overflow-y-auto custom-scrollbar">
                                {requirements}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-slate-500 italic py-4">
                                <span className="w-2 h-2 rounded-full bg-slate-700 animate-pulse" />
                                Analyzing project scope...
                            </div>
                        )}
                    </Section>

                    {/* Implementation Notes (Placeholders for now) */}
                    <Section
                        title="Architecture & Implementation Notes"
                        icon={Cpu}
                        color="text-violet-400"
                    >
                        <ul className="space-y-3">
                            {[
                                "Modular microservices architecture",
                                "React-based frontend with Tailwind CSS",
                                "API-first design principles",
                                "Comprehensive unit and integration testing coverage"
                            ].map((note, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                                    <ArrowRight size={14} className="mt-1 text-slate-600" />
                                    {note}
                                </li>
                            ))}
                        </ul>
                    </Section>
                </div>

                {/* 3. Progress & Plan Sidebar */}
                <div className="space-y-8">
                    {/* Status Card */}
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Evaluation Status</h3>
                        <div className="flex items-center gap-3">
                            <div className={clsx(
                                "w-3 h-3 rounded-full",
                                isCompleted ? "bg-emerald-500" : "bg-blue-500 animate-pulse"
                            )} />
                            <span className="text-lg font-semibold text-white">
                                {isCompleted ? "Fully Evaluated" : "Processing Swarm"}
                            </span>
                        </div>
                    </div>

                    {/* Execution Roadmap */}
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 space-y-5">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <List size={14} /> Execution Roadmap
                        </h3>
                        <div className="space-y-4">
                            {plan ? plan.map((task, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={clsx(
                                            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-lg",
                                            task.status === "completed" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                                                task.status === "in_progress" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse" :
                                                    "bg-slate-800 text-slate-500 border border-slate-700"
                                        )}>
                                            {task.status === "completed" ? <CheckCircle2 size={12} /> : i + 1}
                                        </div>
                                        {i < (plan.length - 1) && <div className="w-px h-full bg-slate-800" />}
                                    </div>
                                    <div className="pb-4">
                                        <div className={clsx(
                                            "text-sm font-medium transition-colors",
                                            task.status === "completed" ? "text-slate-500" : "text-slate-200"
                                        )}>{task.title}</div>
                                        {task.status === "in_progress" && (
                                            <p className="text-xs text-blue-400 mt-1 animate-pulse">Running...</p>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-slate-600 text-xs italic">Awaiting planning phase...</div>
                            )}
                        </div>
                    </div>

                    {/* Risks & QA */}
                    <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10 space-y-4">
                        <h3 className="text-sm font-bold text-orange-400 uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle size={14} /> Risk Assessment
                        </h3>
                        <div className="text-xs text-slate-400 leading-relaxed">
                            No critical external blockers identified. The team is currently validating implementation complexity.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, icon: Icon, color, children }: any) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className={clsx("p-2 rounded-lg bg-slate-900 border border-slate-800 shadow-xl", color)}>
                    <Icon size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            {children}
        </div>
    );
}
