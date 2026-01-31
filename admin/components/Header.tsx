"use client";

import { useEffect, useState } from "react";

export default function Header() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-end border-b border-zinc-200 bg-zinc-50/80 px-8 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {user?.username || "Administrador"}
                    </p>
                    <p className="text-xs text-zinc-500">Acceso Total</p>
                </div>
                <div className="h-10 w-10 overflow-hidden rounded-full border border-amber-500/20 bg-zinc-200 dark:bg-zinc-800">
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-400">
                        {user?.username?.substring(0, 2).toUpperCase() || "AD"}
                    </div>
                </div>
            </div>
        </header>
    );
}
