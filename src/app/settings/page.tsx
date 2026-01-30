"use client";
import React, { useState, useEffect } from "react";
import { Settings, User, Bell, Shield, Terminal, Globe, Cloud, Sparkles, Loader2, CheckCircle2, Moon, Sun, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('General');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        settings: {
            theme: 'dark' as 'dark' | 'light',
            temperature: 0.7,
            verbosity: 'detailed' as 'simple' | 'detailed',
            model: 'GPT-4o (Recommended)'
        }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/user/profile");
            const data = await res.json();
            if (data.name) {
                setForm({
                    name: data.name,
                    settings: data.settings || form.settings
                });
            }
        } catch (error) {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                toast.success("Preferences synchronized successfully");
            } else {
                throw new Error();
            }
        } catch (error) {
            toast.error("Save failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">Initializing Control Panel...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-10 pb-20">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight">System Preferences</h1>
                <p className="text-slate-400 font-medium">Fine-tune your autonomous workspace and agent behaviors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Sidebar Links */}
                <div className="space-y-2">
                    {[
                        { name: 'General', icon: Settings },
                        { name: 'Profile', icon: User },
                        { name: 'Security', icon: Shield },
                        { name: 'Advanced', icon: Terminal },
                    ].map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={clsx(
                                "w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all",
                                activeTab === item.name
                                    ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30'
                                    : 'text-slate-500 hover:bg-slate-900 hover:text-slate-200'
                            )}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="md:col-span-3 space-y-8">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-10 bg-slate-900/40 border border-slate-800/60 rounded-[40px] space-y-10 backdrop-blur-md relative overflow-hidden"
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -mr-20 -mt-20" />

                        {activeTab === 'General' && (
                            <div className="space-y-10 relative z-10">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-[0.2em] text-[10px]">
                                        <Sparkles size={14} />
                                        Intelligence Engine
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-300 ml-1">Behavior Model</label>
                                            <select
                                                value={form.settings.model}
                                                onChange={(e) => setForm({ ...form, settings: { ...form.settings, model: e.target.value } })}
                                                className="w-full px-5 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white text-sm font-medium focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option>GPT-4o (Recommended)</option>
                                                <option>GPT-4 Turbo</option>
                                                <option>Claude 3.5 Sonnet</option>
                                                <option>Llama 3 70B</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-300 ml-1">Swarm Creativity</label>
                                            <div className="px-5 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl space-y-4">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={form.settings.temperature}
                                                    onChange={(e) => setForm({ ...form, settings: { ...form.settings, temperature: parseFloat(e.target.value) } })}
                                                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                />
                                                <div className="flex justify-between text-[10px] text-slate-500 font-black tracking-widest uppercase">
                                                    <span>Precise</span>
                                                    <span className="text-blue-400">{form.settings.temperature}</span>
                                                    <span>Creative</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8 pt-4">
                                    <div className="flex items-center gap-2 text-violet-400 font-black uppercase tracking-[0.2em] text-[10px]">
                                        <Moon size={14} />
                                        Visual Environment
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'dark', icon: Moon, label: 'Obsidian' },
                                            { id: 'light', icon: Sun, label: 'Crystal' },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setForm({ ...form, settings: { ...form.settings, theme: t.id as any } })}
                                                className={clsx(
                                                    "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3",
                                                    form.settings.theme === t.id
                                                        ? "border-blue-500 bg-blue-500/5 text-white"
                                                        : "border-slate-800 bg-slate-950/30 text-slate-500 hover:border-slate-700"
                                                )}
                                            >
                                                <t.icon size={24} />
                                                <span className="text-xs font-bold uppercase tracking-widest">{t.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Profile' && (
                            <div className="space-y-10 relative z-10">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-[0.2em] text-[10px]">
                                        <User size={14} />
                                        Identity Details
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-300 ml-1">Display Name</label>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                placeholder="Enter your name"
                                                className="w-full px-5 py-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-white text-sm font-medium focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                            />
                                        </div>

                                        <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-[32px] flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xl font-black text-white shadow-2xl">
                                                {form.name ? form.name[0].toUpperCase() : 'U'}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-white font-bold">{form.name || "Your Identity"}</p>
                                                <p className="text-xs text-slate-500 font-medium">Avatar persistent via Nexus Auth</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Security' && (
                            <div className="space-y-6 text-center py-10">
                                <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center mx-auto text-slate-700 border border-white/5">
                                    <Shield size={40} />
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight uppercase">Advanced Security</h3>
                                <p className="text-slate-500 font-medium max-w-sm mx-auto">Enterprise-grade encryption is active by default. API-level security rotations coming in v3.0.</p>
                            </div>
                        )}
                    </motion.div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-10 py-5 bg-blue-600 rounded-3xl font-black text-white hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 flex items-center gap-3 active:scale-[0.98] disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                            {saving ? "SYNCHRONIZING..." : "SAVE PREFERENCES"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function clsx(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
