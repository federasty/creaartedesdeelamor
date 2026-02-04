"use client";

import { useEffect, useState } from "react";

interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
    isSold: boolean;
}

export default function Home() {
    const [stats, setStats] = useState({
        total: 0,
        available: 0,
        sold: 0,
        value: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch Products for general count
                const productsRes = await fetch("http://localhost:3000/products");
                const productsData = productsRes.ok ? await productsRes.json() : [];

                // Fetch Sales stats for revenue and count
                const salesRes = await fetch("http://localhost:3000/sales/stats");
                const salesStats = salesRes.ok ? await salesRes.json() : { totalItemsSold: 0, totalRevenue: 0 };

                const availableCount = Array.isArray(productsData)
                    ? productsData.filter((p: any) => !p.isSold && (p.stock || 0) > 0).length
                    : 0;

                setStats({
                    total: Array.isArray(productsData) ? productsData.length : 0,
                    available: availableCount,
                    sold: salesStats.totalItemsSold || 0,
                    value: salesStats.totalRevenue || 0
                });
            } catch (error) {
                console.error("Error fetching stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        {
            name: "Obras Maestras",
            value: stats.total,
            label: "Total Galería",
            action: "Ver catálogo",
            href: "/products",
            color: "text-white"
        },
        {
            name: "Obras Disponibles",
            value: stats.available,
            label: "Visibles en tienda",
            action: "Gestionar",
            href: "/products",
            color: "text-emerald-500"
        },
        {
            name: "Ventas Totales",
            value: `$${stats.value.toLocaleString()}`,
            label: `${stats.sold} piezas entregadas`,
            action: "Ver reportes",
            href: "/sales",
            color: "text-spiritual-purple"
        },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-10 bg-spiritual-purple rounded-full"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-spiritual-purple">Visión Maestro</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight text-zinc-900 dark:text-white">
                        Panel de <span className="text-spiritual-purple font-light italic">Resumen</span>
                    </h1>
                    <p className="text-zinc-500 font-light text-sm tracking-widest max-w-lg">
                        Análisis en tiempo real de la presencia y éxito de creaarte desde el amor.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                    <div
                        key={card.name}
                        className="group relative overflow-hidden rounded-[2.5rem] border border-zinc-200/50 bg-white/80 p-8 sm:p-10 backdrop-blur-xl transition-all duration-500 hover:border-spiritual-purple/30 hover:shadow-2xl hover:shadow-spiritual-purple/5 dark:border-zinc-800/50 dark:bg-zinc-950/50"
                    >
                        {/* Glow Effect */}
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-spiritual-purple/0 opacity-50 blur-3xl transition-all duration-700 group-hover:bg-spiritual-purple/20 group-hover:scale-150"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                                    {card.name}
                                </h3>
                                <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
                                    {card.label}
                                </p>
                            </div>

                            <p className={`text-4xl sm:text-6xl font-extralight tracking-tighter ${card.color}`}>
                                {loading ? "..." : card.value}
                            </p>

                            {card.action && (
                                <a
                                    href={card.href}
                                    className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-all hover:text-spiritual-purple gap-2"
                                >
                                    {card.action}
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Actividad Reciente con Estética Mangata */}
            <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200/50 bg-white/80 backdrop-blur-xl shadow-2xl dark:border-zinc-800/50 dark:bg-zinc-950/50">
                <div className="p-8 sm:p-10">
                    <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-900 dark:text-zinc-50 mb-10 flex items-center gap-4">
                        <span className="h-1 w-1 rounded-full bg-spiritual-purple animate-pulse"></span>
                        Estado del Inventario
                    </h3>

                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-spiritual-purple/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div className="relative rounded-full border border-zinc-100 bg-zinc-50/50 p-8 dark:border-zinc-800 dark:bg-zinc-900/50 text-zinc-400 transition-transform duration-700 group-hover:scale-110">
                                <svg className="h-10 w-10 text-zinc-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">Todo bajo control</p>
                            <p className="text-[10px] font-light text-zinc-500 tracking-[0.1em] max-w-xs mx-auto">
                                No se requieren acciones artísticas inmediatas. Tu galería fluye en perfecta armonía.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
