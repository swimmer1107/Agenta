"use client";
import React from "react";
import {
    Brain,
    LayoutDashboard,
    PlusCircle,
    History,
    Users,
    Settings,
    Info,
    ChevronRight,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_ITEMS = [
    { name: "Overview", icon: LayoutDashboard, href: "/landing" },
    { name: "New Project", icon: PlusCircle, href: "/dashboard/new" },
    { name: "History", icon: History, href: "/history" },
    { name: "Agents Team", icon: Users, href: "/agents" },
    { name: "Settings", icon: Settings, href: "/settings" },
    { name: "About", icon: Info, href: "/about" },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();

    return (
        <aside className={clsx(
            "w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col gap-6 fixed h-full z-50 top-0 left-0 transition-transform duration-300 ease-in-out shadow-2xl",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="flex items-center justify-between px-2 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Brain size={18} className="text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">OrchestrAI</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-900 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex flex-col gap-1.5 flex-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={clsx(
                                "flex items-center justify-between p-3 rounded-xl transition-all group",
                                isActive
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={20} className={clsx("transition-colors", isActive ? "text-blue-400" : "group-hover:text-blue-400")} />
                                <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            {isActive && <ChevronRight size={14} className="text-blue-400" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800/50 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></div>
                    <span className="text-xs font-medium text-emerald-400">System Online</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                    v2.2.0-stable
                </div>
            </div>
        </aside>
    );
}
