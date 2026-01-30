"use client";
import React from "react";
import { useProject } from "@/context/ProjectContext";
import { ReportRenderer } from "@/components/dashboard/ReportRenderer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Sidebar } from "@/components/layout/Sidebar";
import { FileCode, Activity, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ReportPage() {
    const { id } = useParams();
    const { requirements, plan, files, metadata, isCompleted } = useProject();

    // In a real app, we'd fetch the project by ID if it's not in context
    // For this hackathon, we assume it's in the hydrated context

    return (
        <div className="flex h-screen bg-[#020617] text-slate-300">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-10 bg-slate-900/40 backdrop-blur-xl shrink-0">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/dashboard"
                            className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-500 hover:text-white"
                        >
                            <ChevronLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-white uppercase tracking-tight">Technical Report</h1>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Record: {id}</p>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in slide-in-from-bottom-8 duration-700">
                        <div className="bg-slate-900/60 border border-slate-800/80 rounded-[48px] p-12 shadow-3xl backdrop-blur-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -mr-64 -mt-64" />
                            <ReportRenderer
                                title={metadata?.title || "Evaluation Results"}
                                description={metadata?.description || "Project Analysis"}
                                requirements={requirements}
                                plan={plan}
                                isCompleted={isCompleted}
                            />
                        </div>

                        {files && files.length > 0 && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                        <FileCode className="text-emerald-400" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Generated Assets</h3>
                                        <p className="text-slate-500 text-sm font-medium">Verified technical source files</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-8">
                                    {files.map(f => (
                                        <CodeBlock
                                            key={f.path}
                                            filename={f.path}
                                            code={f.content}
                                            language={f.language || "typescript"}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
