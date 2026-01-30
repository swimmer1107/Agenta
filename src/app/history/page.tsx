"use client";
import React, { useState, useEffect } from "react";
import { History as HistoryIcon, Search, Filter, ExternalLink, Calendar, Loader2, X, Trash2, ChevronRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReportRenderer } from "@/components/dashboard/ReportRenderer";
import toast from "react-hot-toast";
import clsx from "clsx";

export default function HistoryPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [archiveStatus, setArchiveStatus] = useState<"loading" | "success" | "empty" | "error">("loading");
    const [loadingText, setLoadingText] = useState("Fetching artifacts...");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "running" | "failed">("all");
    const [selectedProject, setSelectedProject] = useState<any | null>(null);

    useEffect(() => {
        fetchProjects();
        // Poll for updates if there are running projects
        const interval = setInterval(() => {
            const hasRunning = projects.some(p => p.status === "running");
            if (hasRunning) fetchProjects(false);
        }, 3000);
        return () => clearInterval(interval);
    }, [projects]);

    const fetchProjects = async (showLoading = true) => {
        if (showLoading) setArchiveStatus("loading");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        // Dynamic Loading Text Logic
        const textTimer = setTimeout(() => {
            if (archiveStatus === "loading") setLoadingText("Still working...");
        }, 3000);

        try {
            const res = await fetch("/api/projects", { signal: controller.signal });
            clearTimeout(timeoutId);
            clearTimeout(textTimer);

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const fetchedProjects = data.projects || [];

            setProjects(fetchedProjects);
            setArchiveStatus(fetchedProjects.length > 0 ? "success" : "empty");
        } catch (error: any) {
            clearTimeout(timeoutId);
            clearTimeout(textTimer);
            console.error("Failed to load history", error);
            if (showLoading) setArchiveStatus("error");
        }
    };

    const filteredProjects = projects.filter(p => {
        const title = p.metadata?.title || p.prompt || "Untitled Evaluation";
        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || p.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success("Project deleted");
                fetchProjects();
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">OrchestrAI Archive</h1>
                    <p className="text-slate-400 font-medium">Access and manage your swarm-generated technical reports.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find a project..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 transition-all"
                        />
                    </div>

                    <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
                        {["all", "completed", "running", "failed"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status as any)}
                                className={clsx(
                                    "px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                                    filterStatus === status ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {archiveStatus === "loading" && projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                    <p className="text-slate-500 font-mono text-sm tracking-widest uppercase transition-all duration-700">{loadingText}</p>
                </div>
            ) : archiveStatus === "error" ? (
                <div className="p-24 border-2 border-red-500/20 rounded-[48px] text-center space-y-6 bg-red-500/5">
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto text-red-400 shadow-inner border border-red-500/20">
                        <X size={40} />
                    </div>
                    <div className="space-y-2 text-center w-full">
                        <h3 className="text-2xl font-black text-white tracking-tight">Unable to fetch projects</h3>
                        <p className="text-slate-500 font-medium">Check your connection or the status of our systems and try again.</p>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => fetchProjects()}
                            className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-600/20 active:scale-95"
                        >
                            Retry Fetch
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-slate-900 border border-slate-800 text-slate-300 font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, i) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group p-6 bg-slate-900/40 border border-slate-800/60 rounded-[32px] hover:border-blue-500/30 hover:bg-slate-900/60 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[280px]"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className={clsx(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center border",
                                        project.status === 'completed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            project.status === 'running' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                "bg-red-500/10 text-red-400 border-red-500/20"
                                    )}>
                                        <Activity size={24} />
                                    </div>
                                    <div className={clsx(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                        project.status === 'completed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            project.status === 'running' ? "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse" :
                                                "bg-red-500/10 text-red-400 border-red-500/20"
                                    )}>
                                        {project.status === 'running' ? "Orchestrating" : project.status}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-black text-white text-xl leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {project.metadata?.title || project.prompt || "Untitled Evaluation"}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                        <Calendar size={12} />
                                        {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mt-6">
                                {project.status === 'running' && (
                                    <div className="space-y-1.5 px-1">
                                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                            <span>Progress</span>
                                            <span>{project.globalProgress || 0}%</span>
                                        </div>
                                        <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-1000"
                                                style={{ width: `${project.globalProgress || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    {project.status === 'completed' ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `/report/${project.threadId}`;
                                            }}
                                            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            View Report <ExternalLink size={12} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `/dashboard?threadId=${project.threadId}`;
                                            }}
                                            className="flex-1 py-2.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-blue-500/20 hover:border-blue-500 transition-all flex items-center justify-center gap-2"
                                        >
                                            View Execution <Activity size={12} />
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => handleDelete(e, project._id)}
                                        className="p-2.5 bg-slate-800 text-slate-600 hover:text-red-400 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/20 rounded-xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="p-24 border-2 border-dashed border-slate-900 rounded-[48px] text-center space-y-6 bg-slate-950/50">
                    <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto text-slate-700 shadow-inner">
                        <HistoryIcon size={40} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-300 tracking-tight">Vast Void...</h3>
                        <p className="text-slate-500 font-medium">No projects found matching your criteria. Start something epic!</p>
                    </div>
                    {searchTerm || filterStatus !== 'all' ? (
                        <button
                            onClick={() => { setSearchTerm(""); setFilterStatus("all"); }}
                            className="text-blue-400 font-bold uppercase tracking-widest text-xs hover:text-blue-300 transition-colors"
                        >
                            Reset Selection
                        </button>
                    ) : (
                        <button
                            onClick={() => window.location.href = "/dashboard/new"}
                            className="text-blue-400 font-bold uppercase tracking-widest text-xs hover:text-blue-300 transition-colors"
                        >
                            Initiate Evaluation
                        </button>
                    )}
                </div>
            )}

            {/* Project Details Modal - Legacy Support for older projects if needed, or generic view */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-6xl h-full bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/50 backdrop-blur-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                        <HistoryIcon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Project Archive</h3>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Record View</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all shadow-xl"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                                <ReportRenderer
                                    title={selectedProject.metadata?.title || selectedProject.prompt}
                                    description={`Archived project created on ${new Date(selectedProject.createdAt).toLocaleString()}`}
                                    requirements={selectedProject.requirements}
                                    plan={selectedProject.plan}
                                    isCompleted={selectedProject.status === 'completed'}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
