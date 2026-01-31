"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        image: null as File | null,
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:3000/products");
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError("No se pudieron cargar los productos.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            // Usar FormData para enviar imagen
            const fd = new FormData();
            fd.append("name", formData.name);
            fd.append("description", formData.description);
            fd.append("price", formData.price);
            if (formData.image) fd.append("image", formData.image);

            const response = await fetch("http://localhost:3000/products", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: fd,
            });

            if (!response.ok) throw new Error("Error al crear producto");

            setIsModalOpen(false);
            setFormData({ name: "", description: "", price: "", image: null });
            fetchProducts();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:3000/products/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) fetchProducts();
        } catch (err) {
            alert("Error al eliminar");
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex items-end justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-white">
                        Inventario de <span className="text-amber-500">Productos</span>
                    </h1>
                    <p className="text-zinc-500 font-light text-sm tracking-wide">Gestiona el catálogo de tu tienda.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-full bg-zinc-900 px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-zinc-800 hover:shadow-xl dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                    Nuevo Producto
                </button>
            </div>

            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] uppercase tracking-widest text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50">
                            <tr>
                                <th className="px-8 py-4 font-semibold">Producto</th>
                                <th className="px-8 py-4 font-semibold">Precio</th>
                                <th className="px-8 py-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {loading && products.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-20 text-center text-zinc-400">Cargando productos...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-20 text-center text-zinc-400">No hay productos registrados.</td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl border border-zinc-100 bg-zinc-50 object-cover overflow-hidden dark:border-zinc-800 dark:bg-zinc-800">
                                                    {product.imageUrl && <img src={`http://localhost:3000${product.imageUrl}`} className="h-full w-full object-cover" />}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-zinc-900 dark:text-zinc-50">{product.name}</p>
                                                    <p className="text-xs text-zinc-500 line-clamp-1">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="font-mono text-zinc-900 dark:text-zinc-50">${product.price}</span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10"
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal - Simplificado para el ejemplo */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-8 dark:bg-zinc-900">
                        <h2 className="text-2xl font-light text-zinc-900 dark:text-zinc-50 mb-8">Crear <span className="text-amber-500">Nuevo Producto</span></h2>
                        <form onSubmit={handleCreateProduct} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500">Nombre</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-amber-500 dark:border-zinc-800 dark:bg-zinc-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500">Descripción</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-amber-500 dark:border-zinc-800 dark:bg-zinc-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500">Precio</label>
                                <input
                                    required
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none focus:border-amber-500 dark:border-zinc-800 dark:bg-zinc-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500">Imagen</label>
                                <input
                                    type="file"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                                    className="w-full text-xs text-zinc-500 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-zinc-700 dark:file:bg-zinc-800 dark:file:text-zinc-300"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 rounded-xl border border-zinc-200 py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    disabled={loading}
                                    className="flex-1 rounded-xl bg-zinc-900 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900"
                                >
                                    {loading ? "Creando..." : "Crear"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
