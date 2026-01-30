"use client";
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Menu } from "lucide-react";

export function DashboardLayout({
    children,
    session
}: {
    children: React.ReactNode;
    session: any;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!session) {
        return <main className="flex-1 relative">{children}</main>;
    }

    return (
        <div className="flex w-full min-h-screen">
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
