"use client";

import { useEffect, useState } from "react";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stock: number;
    isSold: boolean;
    updatedAt: string;
}

interface Sale {
    _id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    category: string;
    createdAt: string;
}

export default function SalesPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch Sales
            const salesRes = await fetch("http://localhost:3000/sales");
            const salesData: Sale[] = salesRes.ok ? await salesRes.json() : [];
            setSales(salesData);

            // Fetch Products for the modal
            const productsRes = await fetch("http://localhost:3000/products");
            const productsData: Product[] = productsRes.ok ? await productsRes.json() : [];

            // Only show products with stock > 0 in the manual sale modal
            const available = productsData.filter(p => !p.isSold && (p.stock ?? 0) > 0);
            setAvailableProducts(available);
        } catch (err) {
            console.error("Error fetching data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSale = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProductId) return;

        setProcessing(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:3000/products/${selectedProductId}/sold`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity: 1 }),
            });

            if (res.ok) {
                setIsModalOpen(false);
                setSelectedProductId("");
                fetchData();
            }
        } catch (error) {
            console.error("Error registering sale", error);
        } finally {
            setProcessing(false);
        }
    };

    const totalRevenue = sales.reduce((acc, sale) => acc + (sale.price * sale.quantity), 0);
    const totalItemsSold = sales.reduce((acc, sale) => acc + sale.quantity, 0);

    return (
        <div className="space-y-12 animate-in fade-in duration-700 text-left pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="relative flex items-center gap-2">
                            <div className="relative">
                                <div className="absolute inset-0 bg-spiritual-purple/30 blur-md rounded-full"></div>
                                <div className="relative h-0.5 w-12 bg-gradient-to-r from-spiritual-purple to-spiritual-purple/40 rounded-full"></div>
                            </div>
                            <div className="h-1 w-1 rounded-full bg-spiritual-purple/60 animate-pulse"></div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-spiritual-purple">Gestión de Ingresos</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight text-zinc-900 dark:text-white">
                        Registro de <span className="text-spiritual-purple font-light italic">Ventas</span>
                    </h1>
                    <p className="text-zinc-500 font-light text-sm tracking-widest max-w-lg">
                        Control maestro de transacciones y salida de inventario artístico.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="flex gap-4">
                        <div className="px-6 py-4 rounded-[1.5rem] bg-zinc-900 dark:bg-zinc-50 border border-white/10 dark:border-black/10 shadow-2xl">
                            <p className="text-[7px] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 font-bold mb-1">Recaudación</p>
                            <p className="text-xl font-mono text-spiritual-purple dark:text-spiritual-purple">${totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="px-6 py-4 rounded-[1.5rem] bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-xl">
                            <p className="text-[7px] uppercase tracking-[0.3em] text-zinc-400 font-bold mb-1">Entregas</p>
                            <p className="text-xl font-mono text-zinc-900 dark:text-white">{totalItemsSold}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto group relative h-14 sm:h-16 px-8 sm:px-12 overflow-visible transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {/* Outer Glow Halo */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-spiritual-purple via-spiritual-purple/80 to-spiritual-purple rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-all duration-700 group-hover:blur-2xl"></div>

                        {/* Animated Border */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-spiritual-purple via-spiritual-purple/80 to-spiritual-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

                        {/* Inner Border Offset */}
                        <div className="absolute inset-[2px] rounded-full bg-zinc-950 dark:bg-zinc-900"></div>

                        {/* Glassmorphic Surface */}
                        <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black dark:from-zinc-50 dark:via-zinc-100 dark:to-white backdrop-blur-xl"></div>

                        {/* Shimmer Effect */}
                        <div className="absolute inset-[2px] rounded-full overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-spiritual-purple/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 flex items-center justify-center gap-3 h-full">
                            <div className="relative">
                                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white dark:text-zinc-900 transition-all duration-700 group-hover:rotate-90 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                                <div className="absolute inset-0 bg-spiritual-purple blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                            </div>

                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] bg-gradient-to-r from-white via-zinc-100 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 bg-clip-text text-transparent group-hover:from-spiritual-purple group-hover:via-white group-hover:to-spiritual-purple dark:group-hover:from-spiritual-purple dark:group-hover:via-zinc-900 dark:group-hover:to-spiritual-purple transition-all duration-500">
                                Registrar Venta Manual
                            </span>
                        </div>
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200/50 bg-white/80 backdrop-blur-xl shadow-2xl dark:border-zinc-800/50 dark:bg-zinc-950/50">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-zinc-100 bg-zinc-50/30 text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-400 dark:border-zinc-800/30 dark:bg-zinc-900/30">
                            <tr>
                                <th className="px-4 sm:px-10 py-6">Fecha</th>
                                <th className="px-4 sm:px-10 py-6">Obra Maestro</th>
                                <th className="px-4 sm:px-10 py-6 text-center">Cant.</th>
                                <th className="px-4 sm:px-10 py-6">Categoría</th>
                                <th className="px-4 sm:px-10 py-6 text-right">Inversión</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100/50 dark:divide-zinc-800/50 font-light">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center text-zinc-400 uppercase tracking-widest text-[10px]">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-4 w-4 border border-spiritual-purple border-t-transparent rounded-full animate-spin"></div>
                                            Sincronizando Archivos...
                                        </div>
                                    </td>
                                </tr>
                            ) : sales.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center text-zinc-400 uppercase tracking-widest text-[10px]">
                                        Aún no se han registrado transacciones artísticas.
                                    </td>
                                </tr>
                            ) : (
                                sales.map((sale) => (
                                    <tr key={sale._id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all duration-300">
                                        <td className="px-4 sm:px-10 py-8 text-[10px] text-zinc-400 uppercase tracking-widest">
                                            {new Date(sale.createdAt).toLocaleDateString("es-ES", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </td>
                                        <td className="px-4 sm:px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 tracking-tight">{sale.productName}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-10 py-8 text-center text-sm font-light text-zinc-500">
                                            {sale.quantity}
                                        </td>
                                        <td className="px-4 sm:px-10 py-8 whitespace-nowrap">
                                            <span className="text-[8px] uppercase tracking-widest text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50">
                                                {sale.category}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-10 py-8 text-right font-mono text-base text-zinc-900 dark:text-zinc-50 whitespace-nowrap">
                                            ${(sale.price * sale.quantity).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Registro de Venta Manual - Rediseño Zen Premium */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-y-auto">
                    <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>

                    <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/10 bg-zinc-950 shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)] animate-in zoom-in-95 fade-in duration-500 my-auto">
                        {/* Decorative Top Glow */}
                        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-spiritual-purple/20 to-transparent pointer-events-none"></div>

                        <div className="relative p-8 sm:p-14 space-y-12">
                            {/* Header Section */}
                            <div className="text-center space-y-4">
                                <h2 className="text-xl sm:text-3xl font-extralight text-white leading-tight">
                                    Registrar <span className="text-transparent bg-clip-text bg-gradient-to-r from-spiritual-purple via-spiritual-purple/80 to-spiritual-purple italic font-light pr-1">Venta Manual</span>
                                </h2>
                                <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 font-medium tracking-widest">Gestión Manual</p>
                            </div>

                            <form onSubmit={handleRegisterSale} className="space-y-10">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Seleccionar Obra Vendida</label>
                                        <span className="text-[10px] text-zinc-600 font-mono">{availableProducts.length} disponibles</span>
                                    </div>

                                    {/* Enhanced Product Grid */}
                                    <div className="grid gap-4 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar -mr-3">
                                        {availableProducts.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                                                <svg className="h-8 w-8 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-zinc-600 text-[10px] uppercase tracking-widest text-center">No hay obras disponibles para documentar.</p>
                                            </div>
                                        ) : (
                                            availableProducts.map(product => (
                                                <div
                                                    key={product._id}
                                                    onClick={() => setSelectedProductId(product._id)}
                                                    className={`group relative cursor-pointer flex items-center gap-5 p-5 rounded-[2rem] border transition-all duration-500 ${selectedProductId === product._id
                                                        ? 'bg-spiritual-purple/15 border-spiritual-purple shadow-[0_0_30px_-10px_rgba(139,92,246,0.3)]'
                                                        : 'bg-white/[0.03] border-white/5 hover:border-white/15 hover:bg-white/[0.05]'
                                                        }`}
                                                >
                                                    {/* Product Preview Image */}
                                                    <div className="relative h-16 w-14 rounded-2xl bg-zinc-900 overflow-hidden border border-white/10 flex-shrink-0 shadow-xl">
                                                        <img
                                                            src={`http://localhost:3000${product.imageUrl}`}
                                                            className={`h-full w-full object-cover transition-all duration-700 ${selectedProductId === product._id ? 'scale-110 opacity-100' : 'opacity-60 group-hover:opacity-100 group-hover:scale-110'}`}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium tracking-tight mb-1 transition-colors ${selectedProductId === product._id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                                                            {product.name}
                                                        </p>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold">{product.category}</span>
                                                            <div className="h-1 w-1 rounded-full bg-zinc-700"></div>
                                                            <span className={`text-[9px] uppercase tracking-[0.2em] font-bold ${product.stock < 3 ? 'text-amber-500/80' : 'text-zinc-600'}`}>
                                                                Stock: {product.stock}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="text-right flex-shrink-0">
                                                        <p className={`text-lg font-light font-mono transition-colors ${selectedProductId === product._id ? 'text-spiritual-purple' : 'text-zinc-500 group-hover:text-spiritual-purple/70'}`}>
                                                            ${product.price}
                                                        </p>
                                                    </div>

                                                    {/* Selection Glow Indicator */}
                                                    {selectedProductId === product._id && (
                                                        <div className="absolute inset-0 rounded-[2rem] border border-spiritual-purple/30 animate-pulse pointer-events-none"></div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-full sm:flex-1 h-16 rounded-full border border-zinc-800 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 transition-all duration-500 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 active:scale-95 order-2 sm:order-1"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        disabled={!selectedProductId || processing}
                                        className="w-full sm:flex-[1.5] group relative h-16 overflow-hidden rounded-full transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 order-1 sm:order-2"
                                    >
                                        {/* Premium Button Background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-spiritual-purple via-spiritual-purple/80 to-spiritual-purple transition-all duration-500 group-hover:brightness-110"></div>

                                        {/* Animated Shimmer */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                                        <div className="relative z-10 flex items-center justify-center gap-3">
                                            {processing ? (
                                                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <svg className="h-4 w-4 text-white group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                                                {processing ? "Documentando..." : "Confirmar Venta"}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
