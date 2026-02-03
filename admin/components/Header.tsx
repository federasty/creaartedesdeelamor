"use client";

import { useEffect, useState } from "react";

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between lg:justify-end border-b border-zinc-200 bg-white/80 px-4 md:px-8 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
            {/* Menu Toggle for Mobile */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                aria-label="Abrir menú"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>

            <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {user?.username || "Administrador"}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">Acceso Total</p>
                </div>
                <div className="h-10 w-10 overflow-hidden rounded-full border border-spiritual-purple/20 bg-zinc-100 dark:bg-zinc-800">
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-400">
                        {user?.username?.substring(0, 2).toUpperCase() || "AD"}
                    </div>
                </div>
            </div>
        </header>
    );
}
