"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [authorized, setAuthorized] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        } else {
            // Validar token con el backend
            fetch("http://localhost:3000/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    if (res.ok) {
                        setAuthorized(true);
                    } else {
                        localStorage.removeItem("token");
                        router.push("/login");
                    }
                })
                .catch(() => {
                    // Si el backend no responde, pero tenemos token, 
                    // en dev podríamos dejar pasar o bloquear. Por seguridad bloqueamos.
                    router.push("/login");
                });
        }
    }, [router]);

    if (!authorized) return null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:ml-64 flex flex-col min-h-screen">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-4 md:p-8 lg:p-12 animate-in fade-in duration-700">
                    {children}
                </main>
            </div>
        </div>
    );
}
