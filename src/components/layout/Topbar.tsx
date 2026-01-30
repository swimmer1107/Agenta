"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, Settings, LogOut, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const userInitials = session?.user?.name
        ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'U';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!session) return null;

    return (
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
            <button
                onClick={onMenuClick}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all border border-transparent hover:border-slate-800"
            >
                <Menu size={24} />
            </button>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-800 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/20">
                        {userInitials}
                    </div>
                    <span className="text-sm font-medium text-slate-300 hidden md:block">{session.user?.name}</span>
                    <ChevronDown size={14} className={clsx("text-slate-500 transition-transform", isOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50"
                        >
                            <div className="px-4 py-2 border-b border-slate-800 mb-1">
                                <p className="text-xs font-medium text-slate-500 truncate">{session.user?.email}</p>
                            </div>

                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                            >
                                <User size={16} />
                                Profile
                            </Link>

                            <Link
                                href="/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                            >
                                <Settings size={16} />
                                Settings
                            </Link>

                            <div className="h-px bg-slate-800 my-1" />

                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}

function clsx(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
