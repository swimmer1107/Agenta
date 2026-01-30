"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Shield, ShieldCheck, Key, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const { data: session } = useSession();

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-blue-500 via-violet-500 to-orange-500 flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-blue-500/20">
                    {session?.user?.name ? session.user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold text-white">{session?.user?.name}</h1>
                    <p className="text-slate-400 flex items-center gap-2">
                        <Mail size={14} /> {session?.user?.email}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6"
                >
                    <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-xs">
                        <User size={14} /> Personal Information
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Name</label>
                            <div className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300">
                                {session?.user?.name}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                            <div className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 italic">
                                {session?.user?.email}
                            </div>
                            <p className="text-[10px] text-slate-600">Primary email for account access.</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6"
                >
                    <div className="flex items-center gap-2 text-violet-400 font-bold uppercase tracking-widest text-xs">
                        <Shield size={14} /> Account Security
                    </div>

                    <div className="space-y-4">
                        <button className="w-full flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl group hover:border-slate-700 transition-all">
                            <div className="flex items-center gap-4 text-slate-300">
                                <Key size={20} className="text-slate-500" />
                                <span className="text-sm font-medium">Reset Password</span>
                            </div>
                            <ShieldCheck size={18} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                        </button>

                        <button className="w-full flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl group hover:border-red-500/20 transition-all">
                            <div className="flex items-center gap-4 text-red-400 font-medium">
                                <LogOut size={20} />
                                <span className="text-sm">Delete Account</span>
                            </div>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
