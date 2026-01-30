"use client";
import { useEffect, useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { ExecutionView } from "@/components/dashboard/ExecutionView";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const { threadId, metadata, isProcessing } = useProject();
    const router = useRouter();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // If no project is active and not currently starting one, redirect to setup
    useEffect(() => {
        if (mounted && !threadId && !metadata && !isProcessing) {
            router.replace("/dashboard/new");
        }
    }, [mounted, threadId, metadata, isProcessing, router]);

    if (!mounted) {
        return <div className="p-8 max-w-7xl mx-auto h-full animate-pulse bg-slate-900/10 rounded-3xl min-h-[60vh]" />;
    }

    if (!threadId && !metadata) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Sparkles className="text-blue-400" size={32} />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">No Active Evaluation</h2>
                    <p className="text-slate-400 max-w-md">
                        Start a new AI team evaluation to see live progress and generated reports.
                    </p>
                </div>
                <Link
                    href="/dashboard/new"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25"
                >
                    Start New Project <ArrowRight size={18} />
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto h-full">
            <ExecutionView />
        </div>
    );
}
