"use client";

import React from "react";
import { ProjectProvider } from "@/context/ProjectContext";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ProjectProvider>
                {children}
            </ProjectProvider>
        </SessionProvider>
    );
}
