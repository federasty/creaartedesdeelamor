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
                        <div className="h-2 w-10 bg-amber-500 rounded-full"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-600">Gestión de Ingresos</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight text-zinc-900 dark:text-white">
                        Registro de <span className="text-amber-500 font-light italic">Ventas</span>
                    </h1>
                    <p className="text-zinc-500 font-light text-sm tracking-widest max-w-lg">
                        Control maestro de transacciones y salida de inventario artístico.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="flex gap-4">
                        <div className="px-6 py-4 rounded-[1.5rem] bg-zinc-900 dark:bg-zinc-50 border border-white/10 dark:border-black/10 shadow-2xl">
                            <p className="text-[7px] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 font-bold mb-1">Recaudación</p>
                            <p className="text-xl font-mono text-amber-500 dark:text-amber-600">${totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="px-6 py-4 rounded-[1.5rem] bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-xl">
                            <p className="text-[7px] uppercase tracking-[0.3em] text-zinc-400 font-bold mb-1">Entregas</p>
                            <p className="text-xl font-mono text-zinc-900 dark:text-white">{totalItemsSold}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group relative h-14 px-10 overflow-hidden rounded-full bg-zinc-900 shadow-2xl transition-all hover:bg-black dark:bg-white dark:text-black w-full sm:w-auto"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-500 transition-all group-hover:h-full group-hover:opacity-10"></div>
                        <span className="relative z-10 text-[9px] font-bold uppercase tracking-[0.3em]">Registrar Venta Manual</span>
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
                                            <div className="h-4 w-4 border border-amber-500 border-t-transparent rounded-full animate-spin"></div>
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

            {/* Modal de Registro de Venta */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-xl overflow-hidden rounded-[3rem] border border-white/10 bg-zinc-950 shadow-2xl animate-in zoom-in-95 duration-500">
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none"></div>

                        <div className="p-8 sm:p-12 space-y-10">
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-extralight text-white tracking-tight">
                                    Registrar <span className="text-amber-500 italic">Conversión</span>
                                </h2>
                                <p className="text-[9px] uppercase tracking-[0.4em] text-zinc-500">Documento de Venta Manual</p>
                            </div>

                            <form onSubmit={handleRegisterSale} className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 block mb-4">Seleccionar Obra Vendida</label>
                                    <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {availableProducts.length === 0 ? (
                                            <p className="text-zinc-600 text-[10px] text-center py-10 uppercase tracking-widest">No hay obras disponibles para vender.</p>
                                        ) : (
                                            availableProducts.map(product => (
                                                <div
                                                    key={product._id}
                                                    onClick={() => setSelectedProductId(product._id)}
                                                    className={`group cursor-pointer flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${selectedProductId === product._id ? 'bg-amber-500/10 border-amber-500' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-8 rounded bg-zinc-900 overflow-hidden">
                                                            <img src={`http://localhost:3000${product.imageUrl}`} className="h-full w-full object-cover opacity-60 group-hover:opacity-100" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-medium text-white">{product.name}</p>
                                                            <p className="text-[8px] uppercase tracking-widest text-zinc-500">{product.category}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs font-mono text-amber-500">${product.price}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 rounded-full border border-zinc-800 py-4 text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-500 transition-all hover:bg-zinc-900"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        disabled={!selectedProductId || processing}
                                        className="flex-1 rounded-full bg-white py-4 text-[9px] font-bold uppercase tracking-[0.4em] text-black transition-all hover:bg-zinc-200 disabled:opacity-20 disabled:cursor-not-allowed"
                                    >
                                        {processing ? "Documentando..." : "Confirmar Venta"}
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
