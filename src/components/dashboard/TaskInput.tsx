"use client";
import { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { motion } from "framer-motion";
import { Rocket, Sparkles } from "lucide-react";
import { VoiceButton } from "../ui/VoiceButton";

export function TaskInput() {
    const { startTask } = useProject();
    const [prompt, setPrompt] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isSubmitting) return;

        setIsSubmitting(true);
        await startTask(prompt);
        setIsSubmitting(false);
    };

    const handleVoiceTranscript = (text: string) => {
        setPrompt(text);
    };

    const examples = [
        "Create a todo app with React",
        "Build a REST API for user management",
        "Design a landing page for a SaaS product",
        "Develop a chat application",
    ];

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-4"
                    >
                        <Sparkles size={16} />
                        <span>AI Team Ready</span>
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-violet-400 to-orange-400 bg-clip-text text-transparent">
                        What would you like to build?
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Describe your project idea and watch our AI team bring it to life
                    </p>
                </div>

                {/* Input Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 shadow-2xl hover:border-slate-700/50 transition-all"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="E.g., Create a task management app with user authentication, real-time updates, and a modern UI..."
                                className="w-full h-32 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none custom-scrollbar"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <motion.button
                                type="submit"
                                disabled={!prompt.trim() || isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 via-violet-600 to-orange-600 hover:from-blue-500 hover:via-violet-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Launching...</span>
                                    </>
                                ) : (
                                    <>
                                        <motion.div
                                            animate={{ rotate: isSubmitting ? 0 : [0, -10, 10, -10, 0] }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <Rocket size={20} />
                                        </motion.div>
                                        <span>Start Project</span>
                                    </>
                                )}
                            </motion.button>

                            <VoiceButton onTranscript={handleVoiceTranscript} />
                        </div>
                    </form>
                </motion.div>

                {/* Examples */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6"
                >
                    <p className="text-sm text-slate-500 mb-3">Try these examples:</p>
                    <div className="flex flex-wrap gap-2">
                        {examples.map((example, i) => (
                            <motion.button
                                key={i}
                                onClick={() => setPrompt(example)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition-all"
                            >
                                {example}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
