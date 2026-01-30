import { Brain, Users, Zap, ShieldCheck } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                    About OrchestrAI
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    We are redefining software development with a fully autonomous, multi-agent workforce
                    that plans, codes, and refines projects in real-time.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                        <Brain size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Autonomous Intelligence</h3>
                    <p className="text-slate-400">
                        Our agents don't just follow scripts. They think, plan, and adapt using advanced LLM reasoning
                        to solve complex engineering challenges.
                    </p>
                </div>
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
                    <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center mb-4 text-violet-400">
                        <Users size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Specialized Roles</h3>
                    <p className="text-slate-400">
                        Just like a real team, we have specific roles: Managers for oversight, Analysts for requirements,
                        and specialized Developers for execution.
                    </p>
                </div>
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4 text-amber-400">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">High Performance</h3>
                    <p className="text-slate-400">
                        Built on Next.js 16 and LangGraph, our system is designed for speed, reliability, and
                        real-time streaming of complex tasks.
                    </p>
                </div>
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl backdrop-blur-sm">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4 text-emerald-400">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Safety First</h3>
                    <p className="text-slate-400">
                        Every line of code is reviewed by a dedicated QA Agent. We ensure quality and safety
                        before delivering the final result.
                    </p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-800/[0.1] -z-10" />
                <h2 className="text-2xl font-bold text-white mb-4">Ready to start?</h2>
                <p className="text-slate-400 mb-6">Experience the future of coding today.</p>
                <a href="/" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
                    Launch Dashboard
                </a>
            </div>
        </div>
    );
}
