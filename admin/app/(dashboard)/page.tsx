"use client";

import { useEffect, useState } from "react";

export default function Home() {
    const [stats, setStats] = useState({
        products: 0,
        sales: 0,
        users: 1,
    });

    useEffect(() => {
        // Simular carga de estadísticas
        // En el futuro: fetchStats()
    }, []);

    const cards = [
        { name: "Productos", value: stats.products, action: "Gestionar inventario", href: "/products" },
        { name: "Ventas Totales", value: `$${stats.sales.toFixed(2)}`, action: "Ver reportes", href: "/sales" },
        { name: "Usuarios Admin", value: stats.users, action: "Ver equipo", href: "/users" },
    ];

    return (
        <div className="space-y-10">
            <div className="space-y-2">
                <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-white">
                    Panel de <span className="text-amber-500">Resumen</span>
                </h1>
                <p className="text-zinc-500 font-light">Bienvenido a la gestión operativa de Mangata.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                    <div
                        key={card.name}
                        className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 transition-all hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/5 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-500/5 transition-transform group-hover:scale-150"></div>

                        <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
                            {card.name}
                        </h3>
                        <p className="mt-4 text-5xl font-extralight tracking-tighter text-zinc-900 dark:text-zinc-50">
                            {card.value}
                        </p>
                        <div className="mt-8 flex items-center justify-between">
                            <button
                                className="text-xs font-bold uppercase tracking-widest text-amber-600 transition-colors hover:text-amber-500 dark:text-amber-500"
                            >
                                {card.action} →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actividad Reciente Placeholder */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-lg font-light text-zinc-900 dark:text-zinc-50 mb-6">Actividad Reciente</h3>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800 text-zinc-400">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-sm font-light text-zinc-500">No hay actividad registrada en las últimas 24 horas.</p>
                </div>
            </div>
        </div>
    );
}
