"use client";

import React, { useState } from 'react';
import { Copy, Check, FileCode } from 'lucide-react';
import clsx from 'clsx';

interface CodeBlockProps {
    filename: string;
    code: string;
    language?: string;
}

export function CodeBlock({ filename, code, language = "typescript" }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-xl overflow-hidden border border-slate-700/50 bg-[#0d1117] shadow-lg group transition-all hover:border-slate-600">
            {/* Header / Window Controls */}
            <div className="bg-slate-800/50 px-4 py-2.5 flex items-center justify-between border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                    {/* Window Control Buttons */}
                    <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    {/* Filename */}
                    <div className="flex items-center gap-2 pl-2 text-xs font-medium text-slate-300">
                        <FileCode size={14} className="text-blue-400" />
                        <span className="font-mono opacity-80">{filename}</span>
                    </div>
                </div>

                {/* Copy Button */}
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] font-medium text-slate-400 hover:text-white transition-colors border border-white/5"
                >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>

            {/* Code Content */}
            <div className="relative group/code">
                <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-slate-300 custom-scrollbar  selection:bg-blue-500/30">
                    <code className="language-{language} block min-w-full">
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
}
