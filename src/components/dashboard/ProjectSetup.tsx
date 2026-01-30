"use client";
import React, { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Rocket, Sparkles, Layout, Code, Zap, FileText,
    ArrowLeft, ShieldCheck, Plus
} from "lucide-react";
import clsx from "clsx";

export function ProjectSetup() {
    const { startTask, resetProject } = useProject();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        options: {
            isCode: true,
            isFast: false,
            isDetailed: true
        }
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) newErrors.title = "Project title is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        else if (formData.description.length < 20) newErrors.description = "Please provide more detail (min 20 chars)";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            resetProject(); // Clear previous state
            await startTask(formData as any);
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to start evaluation", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors mb-4 text-sm"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                            <PlusIcon className="text-blue-500" />
                            New Project Evaluation
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Define your project goals and configure the AI team for the best results.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-4 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                        <div className="text-right">
                            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Agents Ready</div>
                            <div className="text-sm text-slate-400">Alice, Bob & Charlie</div>
                        </div>
                        <ShieldCheck className="text-blue-500" size={32} />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: Main Form */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="space-y-4 p-6 bg-slate-900/40 border border-slate-800/50 rounded-2xl backdrop-blur-sm shadow-xl">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Project Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Enterprise CRM Dashboard"
                                    className={clsx(
                                        "w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white focus:outline-none transition-all",
                                        errors.title ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20" : "border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    )}
                                />
                                {errors.title && <p className="text-xs text-red-400 mt-1 font-medium">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Detailed Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe the goals, core features, and technical constraints..."
                                    className={clsx(
                                        "w-full h-48 px-4 py-3 bg-slate-800/50 border rounded-xl text-white focus:outline-none transition-all resize-none custom-scrollbar",
                                        errors.description ? "border-red-500/50 focus:ring-2 focus:ring-red-500/20" : "border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    )}
                                />
                                {errors.description && <p className="text-xs text-red-400 mt-1 font-medium">{errors.description}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right: Options & Toggles */}
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-900/40 border border-slate-800/50 rounded-2xl backdrop-blur-sm shadow-xl space-y-6">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800/50 pb-3">Evaluation Mode</h3>

                            <Toggle
                                icon={Code}
                                label="Code Generation"
                                description="Agents will generate actual implementation code."
                                enabled={formData.options.isCode || false}
                                onChange={() => setFormData({
                                    ...formData,
                                    options: { ...formData.options, isCode: !formData.options.isCode }
                                })}
                            />

                            <Toggle
                                icon={Zap}
                                label="Fast Evaluation"
                                description="Skip deep research for immediate high-level overview."
                                enabled={formData.options.isFast || false}
                                onChange={() => setFormData({
                                    ...formData,
                                    options: { ...formData.options, isFast: !formData.options.isFast, isDetailed: formData.options.isFast }
                                })}
                            />

                            <Toggle
                                icon={Layout}
                                label="Detailed Analysis"
                                description="Maximum depth on requirements and architectural planning."
                                enabled={formData.options.isDetailed || false}
                                onChange={() => setFormData({
                                    ...formData,
                                    options: { ...formData.options, isDetailed: !formData.options.isDetailed, isFast: formData.options.isDetailed }
                                })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-disabled:opacity-0" />
                            <div className="relative w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Start Evaluation <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <div className={clsx("w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20", className)}>
            <Sparkles size={20} />
        </div>
    );
}

function Toggle({ icon: Icon, label, description, enabled, onChange }: any) {
    return (
        <div
            onClick={onChange}
            className="group cursor-pointer space-y-2"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon size={16} className={enabled ? "text-blue-400" : "text-slate-500"} />
                    <span className={clsx("text-sm font-medium transition-colors", enabled ? "text-blue-300" : "text-slate-500")}>{label}</span>
                </div>
                <div className={clsx(
                    "w-10 h-5 rounded-full transition-all relative",
                    enabled ? "bg-blue-600" : "bg-slate-800"
                )}>
                    <div className={clsx(
                        "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                        enabled ? "right-1" : "left-1"
                    )} />
                </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight group-hover:text-slate-400 transition-colors uppercase font-mono">
                {description}
            </p>
        </div>
    );
}
