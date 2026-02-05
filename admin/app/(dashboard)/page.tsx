"use client";

import { useEffect, useState } from "react";

interface Product {
    _id: string;
    name: string;
    description: string;
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

    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

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

                const lowStock = Array.isArray(productsData)
                    ? productsData.filter((p: any) => p.stock <= 1)
                    : [];

                setStats({
                    total: Array.isArray(productsData) ? productsData.length : 0,
                    available: availableCount,
                    sold: salesStats.totalItemsSold || 0,
                    value: salesStats.totalRevenue || 0
                });
                setLowStockProducts(lowStock);
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
        <div className="space-y-8 sm:space-y-12 animate-in fade-in duration-1000 pb-8">
            {/* Enhanced Header with Gradient Accent */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="relative flex items-center gap-2">
                            <div className="relative">
                                <div className="absolute inset-0 bg-spiritual-purple/30 blur-md rounded-full"></div>
                                <div className="relative h-0.5 w-12 bg-gradient-to-r from-spiritual-purple to-spiritual-purple/40 rounded-full"></div>
                            </div>
                            <div className="h-1 w-1 rounded-full bg-spiritual-purple/60 animate-pulse"></div>
                        </div>
                        <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.4em] sm:tracking-[0.5em] text-spiritual-purple">Visión Maestro</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight text-zinc-900 dark:text-white leading-tight">
                        Panel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-spiritual-purple via-spiritual-purple/80 to-spiritual-purple font-light italic">Resumen</span>
                    </h1>
                    <p className="text-zinc-500 font-light text-xs sm:text-sm tracking-wide max-w-lg leading-relaxed">
                        Análisis en tiempo real de la presencia y éxito de <span className="text-spiritual-purple/70 italic">creaarte desde el amor</span>.
                    </p>
                </div>
            </div>

            {/* Premium Stats Cards with Enhanced Visuals */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card, index) => (
                    <div
                        key={card.name}
                        className="group relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-zinc-200/50 bg-gradient-to-br from-white/90 to-white/70 p-6 sm:p-8 md:p-10 backdrop-blur-xl transition-all duration-500 hover:border-spiritual-purple/40 hover:shadow-2xl hover:shadow-spiritual-purple/10 active:scale-[0.98] sm:hover:scale-[1.02] dark:border-zinc-800/50 dark:from-zinc-950/90 dark:to-zinc-950/70"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Multi-layered Glow Effect */}
                        <div className="absolute -right-8 -top-8 sm:-right-12 sm:-top-12 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-spiritual-purple/0 opacity-40 blur-2xl sm:blur-3xl transition-all duration-700 group-hover:bg-spiritual-purple/30 group-hover:scale-150"></div>
                        <div className="absolute -left-6 -bottom-6 sm:-left-8 sm:-bottom-8 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-tr from-spiritual-purple/0 to-transparent opacity-20 blur-xl sm:blur-2xl transition-all duration-700 group-hover:opacity-40"></div>

                        {/* Gradient Border Accent */}
                        <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-spiritual-purple/0 via-spiritual-purple/5 to-spiritual-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative z-10 space-y-5 sm:space-y-6 md:space-y-8">
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <div className="h-0.5 w-0.5 sm:h-1 sm:w-1 rounded-full bg-spiritual-purple/50 animate-pulse"></div>
                                    <h3 className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] sm:tracking-[0.35em] text-zinc-400 group-hover:text-spiritual-purple/70 transition-colors">
                                        {card.name}
                                    </h3>
                                </div>
                                <p className="text-[7px] sm:text-[8px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-zinc-500 font-medium pl-2 sm:pl-3">
                                    {card.label}
                                </p>
                            </div>

                            {/* Animated Value Display */}
                            <div className="relative">
                                <p className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tighter ${card.color} transition-all duration-500 group-hover:scale-105`}>
                                    {loading ? (
                                        <span className="inline-block animate-pulse">...</span>
                                    ) : (
                                        <span className="inline-block transition-all duration-300">{card.value}</span>
                                    )}
                                </p>
                                {/* Subtle underline accent */}
                                <div className="mt-2 sm:mt-3 h-[1.5px] sm:h-[2px] w-0 bg-gradient-to-r from-spiritual-purple to-transparent transition-all duration-500 group-hover:w-16 sm:group-hover:w-20"></div>
                            </div>

                            {card.action && (
                                <a
                                    href={card.href}
                                    className="inline-flex items-center text-[8px] sm:text-[9px] font-black uppercase tracking-[0.35em] sm:tracking-[0.4em] text-zinc-400 transition-all hover:text-spiritual-purple active:text-spiritual-purple hover:gap-3 gap-2 group/link"
                                >
                                    <span>{card.action}</span>
                                    <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Low Stock Alerts - Premium Section */}
            {lowStockProducts.length > 0 && (
                <div className="relative space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="space-y-1">
                            <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                Alertas de Stock Bajo
                            </h3>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-medium">Acción Requerida para mantener el flujo</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                        {lowStockProducts.map((product, index) => (
                            <div
                                key={product._id}
                                className={`group relative overflow-hidden rounded-[2rem] border backdrop-blur-xl transition-all duration-500 hover:shadow-2xl dark:bg-zinc-950/40 p-6 sm:p-8 ${product.stock === 0
                                    ? 'border-red-500/40 bg-gradient-to-br from-red-500/[0.08] to-transparent shadow-red-500/10'
                                    : 'border-amber-500/20 bg-gradient-to-br from-amber-500/[0.03] to-transparent hover:border-amber-500/40 shadow-amber-500/5'
                                    }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative z-10 flex flex-col gap-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-4 flex-1">
                                            <div className="space-y-1">
                                                <p className={`text-[8px] font-black uppercase tracking-[0.4em] ${product.stock === 0 ? 'text-red-500' : 'text-amber-500/80'}`}>
                                                    {product.stock === 0 ? 'Reposición Urgente' : 'Stock Crítico'}
                                                </p>
                                                <h4 className="text-xl sm:text-2xl font-extralight text-zinc-900 dark:text-white tracking-tight">
                                                    {product.name}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description Area */}
                                    <div className="relative">
                                        <p className="text-xs font-light text-zinc-500 dark:text-zinc-400 leading-relaxed italic line-clamp-2">
                                            &ldquo;{product.description || "Sin descripción disponible"}&rdquo;
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-2">
                                        <div className={`inline-flex px-4 py-1.5 rounded-full border ${product.stock === 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                                            <span className={`text-[10px] font-mono font-black ${product.stock === 0 ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'}`}>
                                                {product.stock === 0 ? 'AGOTADO' : `RESTANTES: ${product.stock}`}
                                            </span>
                                        </div>
                                        <div className="hidden sm:block h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-800"></div>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-medium">Valor: <span className="text-zinc-900 dark:text-zinc-300">${product.price}</span></p>
                                    </div>
                                </div>

                                {/* Ambient Glow */}
                                <div className={`absolute -right-12 -bottom-12 h-32 w-32 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${product.stock === 0 ? 'bg-red-500/10' : 'bg-amber-500/5'
                                    }`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Enhanced Status Section */}
            <div className="relative overflow-hidden rounded-[3rem] border border-zinc-200/50 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl shadow-2xl dark:border-zinc-800/50 dark:from-zinc-950/90 dark:to-zinc-950/70">
                {/* Ambient Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-spiritual-purple/5 via-transparent to-spiritual-purple/5 opacity-50"></div>

                <div className="relative p-10 sm:p-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8 sm:mb-12">
                        <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] sm:tracking-[0.35em] text-zinc-900 dark:text-zinc-50 flex items-center gap-3 sm:gap-4">
                            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${lowStockProducts.length > 0 ? 'bg-amber-500' : 'bg-spiritual-purple'}`}></span>
                                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 ${lowStockProducts.length > 0 ? 'bg-amber-500' : 'bg-spiritual-purple'}`}></span>
                            </span>
                            Estado del Sistema
                        </h3>
                        <div className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border ${lowStockProducts.length > 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                            <div className={`h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full animate-pulse ${lowStockProducts.length > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                            <span className={`text-[7px] sm:text-[8px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-bold ${lowStockProducts.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {lowStockProducts.length > 0 ? "Atención requerida" : "Operativo"}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center space-y-6 sm:space-y-8">
                        <div className="relative group">
                            {/* Multi-layer glow */}
                            <div className={`absolute inset-0 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ${lowStockProducts.length > 0 ? 'bg-amber-500/20' : 'bg-spiritual-purple/20'}`}></div>
                            <div className={`absolute inset-0 blur-2xl rounded-full animate-pulse ${lowStockProducts.length > 0 ? 'bg-amber-500/10' : 'bg-spiritual-purple/10'}`}></div>

                            {/* Icon container with glassmorphism */}
                            <div className={`relative rounded-full border-2 border-zinc-200/50 bg-gradient-to-br from-zinc-50/80 to-zinc-100/60 p-10 dark:border-zinc-800/50 dark:from-zinc-900/80 dark:to-zinc-800/60 backdrop-blur-md transition-all duration-700 group-hover:scale-110 shadow-xl ${lowStockProducts.length > 0 ? 'group-hover:border-amber-500/30' : 'group-hover:border-spiritual-purple/30'}`}>
                                <svg className={`h-10 w-10 sm:h-12 sm:w-12 transition-all duration-500 ${lowStockProducts.length > 0 ? 'text-amber-500/50 group-hover:text-amber-500' : 'text-spiritual-purple/40 dark:text-spiritual-purple/30 group-hover:text-spiritual-purple/60'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {lowStockProducts.length > 0 ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    )}
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-3 max-w-md">
                            <p className="text-sm font-black uppercase tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-zinc-600 to-zinc-400 dark:from-zinc-300 dark:to-zinc-500">
                                {lowStockProducts.length > 0 ? "Atención en la Galería" : "Todo bajo control"}
                            </p>
                            <p className="text-xs font-light text-zinc-500 dark:text-zinc-400 tracking-wide leading-relaxed">
                                {lowStockProducts.length > 0
                                    ? `Hay ${lowStockProducts.length} obras que necesitan ser repuestas para mantener el flujo constante de arte.`
                                    : "No se requieren acciones inmediatas. Tu galería fluye en perfecta armonía espiritual."}
                            </p>
                            {/* Decorative divider */}
                            <div className="flex items-center justify-center gap-2 pt-4">
                                <div className={`h-[1px] w-8 bg-gradient-to-r from-transparent ${lowStockProducts.length > 0 ? 'to-amber-500/30' : 'to-spiritual-purple/30'}`}></div>
                                <div className={`h-1 w-1 rounded-full ${lowStockProducts.length > 0 ? 'bg-amber-500/40' : 'bg-spiritual-purple/40'}`}></div>
                                <div className={`h-[1px] w-8 bg-gradient-to-l from-transparent ${lowStockProducts.length > 0 ? 'to-amber-500/30' : 'to-spiritual-purple/30'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
