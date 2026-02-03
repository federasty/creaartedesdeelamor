"use client";

import { useEffect, useState } from "react";

const CATEGORIES = ["Budas", "Ganeshas", "Ganeshas Tibetanos"];

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Budas",
        image: null as File | null,
        isSold: false,
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://127.0.0.1:3000/products");
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
            if (Number(formData.price) < 0) {
                alert("El precio no puede ser negativo");
                setLoading(false);
                return;
            }

            const fd = new FormData();
            fd.append("name", formData.name);
            fd.append("description", formData.description);
            fd.append("price", formData.price);
            fd.append("category", formData.category);
            fd.append("isSold", formData.isSold.toString());
            if (formData.image) fd.append("image", formData.image);

            const url = isEditing
                ? `http://127.0.0.1:3000/products/${editId}`
                : "http://127.0.0.1:3000/products";

            const method = isEditing ? "PATCH" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: fd,
            });

            if (!response.ok) throw new Error("Error al crear la vela");

            setIsModalOpen(false);
            setIsEditing(false);
            setEditId(null);
            setFormData({ name: "", description: "", price: "", category: "Budas", image: null, isSold: false });
            fetchProducts();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Deseas retirar esta vela del catálogo?")) return;
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://127.0.0.1:3000/products/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) fetchProducts();
        } catch (err) {
            alert("Error al retirar el producto");
        }
    };

    const handleEdit = (product: any) => {
        setIsEditing(true);
        setEditId(product._id);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category || "Budas",
            image: null,
            isSold: product.isSold || false
        });
        setIsModalOpen(true);
    };

    const toggleSoldStatus = async (product: any) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://127.0.0.1:3000/products/${product._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ isSold: !product.isSold }),
            });

            if (res.ok) fetchProducts();
        } catch (error) {
            console.error("Error toggling status", error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-10 bg-amber-500 rounded-full"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-600">Catálogo de Velas</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extralight tracking-tight text-zinc-900 dark:text-white">
                        Gestión <span className="text-amber-500 font-light italic">Artística</span>
                    </h1>
                    <p className="text-zinc-500 font-light text-sm tracking-widest max-w-lg">
                        Control de inventario maestro. Aquí defines la esencia y presencia de cada vela en Mangata.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-80">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar por obra o categoría..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-14 pl-12 pr-6 rounded-full border border-zinc-200 bg-white/50 text-[10px] uppercase tracking-widest outline-none focus:border-amber-500 transition-all dark:border-zinc-800 dark:bg-zinc-900/50"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setEditId(null);
                            setFormData({ name: "", description: "", price: "", category: "Budas", image: null, isSold: false });
                            setIsModalOpen(true);
                        }}
                        className="w-full sm:w-auto group relative h-14 sm:h-16 px-8 sm:px-12 overflow-visible transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {/* Outer Glow Halo */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-all duration-700 group-hover:blur-2xl"></div>

                        {/* Animated Border */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

                        {/* Inner Border Offset */}
                        <div className="absolute inset-[2px] rounded-full bg-zinc-950 dark:bg-zinc-900"></div>

                        {/* Glassmorphic Surface */}
                        <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black dark:from-zinc-50 dark:via-zinc-100 dark:to-white backdrop-blur-xl"></div>

                        {/* Shimmer Effect */}
                        <div className="absolute inset-[2px] rounded-full overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 flex items-center justify-center gap-3 h-full">
                            {/* Icon with Complex Animation */}
                            <div className="relative">
                                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white dark:text-zinc-900 transition-all duration-700 group-hover:rotate-180 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                                {/* Icon Glow */}
                                <div className="absolute inset-0 bg-amber-500 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                            </div>

                            {/* Text with Gradient */}
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] bg-gradient-to-r from-white via-zinc-100 to-white dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 bg-clip-text text-transparent group-hover:from-amber-200 group-hover:via-amber-100 group-hover:to-amber-200 dark:group-hover:from-amber-600 dark:group-hover:via-amber-500 dark:group-hover:to-amber-600 transition-all duration-500">
                                Nueva Vela
                            </span>

                            {/* Sparkle Effect */}
                            <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-150"></div>
                            <div className="absolute -left-1 -bottom-1 h-1.5 w-1.5 rounded-full bg-amber-300 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
                        </div>
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200/50 bg-white/80 backdrop-blur-xl shadow-2xl dark:border-zinc-800/50 dark:bg-zinc-950/50">
                <div className="overflow-x-auto text-left">
                    <table className="w-full">
                        <thead className="border-b border-zinc-100 bg-zinc-50/30 text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-400 dark:border-zinc-800/30 dark:bg-zinc-900/30">
                            <tr>
                                <th className="px-4 sm:px-10 py-4 sm:py-6">Obra / Esencia</th>
                                <th className="px-4 sm:px-10 py-4 sm:py-6">Categoría</th>
                                <th className="px-4 sm:px-10 py-4 sm:py-6">Precio</th>
                                <th className="px-4 sm:px-10 py-4 sm:py-6 text-center">Estado</th>
                                <th className="sticky right-0 z-10 bg-zinc-50/80 px-4 sm:px-10 py-4 sm:py-6 text-right backdrop-blur-md dark:bg-zinc-900/80">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100/50 dark:divide-zinc-800/50">
                            {loading && products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-[10px] uppercase tracking-widest text-zinc-400">Sincronizando Galería...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center">
                                        <p className="text-sm font-light text-zinc-400">La galería se encuentra vacía. Comienza a crear magia.</p>
                                    </td>
                                </tr>
                            ) : (
                                products.length > 0 && filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-32 text-center text-zinc-400">
                                            No se encontraron obras con ese criterio.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product._id} className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-900/80 transition-all duration-300">
                                            <td className="px-4 sm:px-10 py-4 sm:py-8">
                                                <div className="flex items-center gap-3 sm:gap-6">
                                                    <div className="relative h-16 w-12 sm:h-20 sm:w-16 flex-shrink-0 overflow-hidden rounded-xl sm:rounded-2xl border border-zinc-100 bg-zinc-50 shadow-inner dark:border-zinc-800 dark:bg-zinc-900">
                                                        {product.imageUrl ? (
                                                            <img src={`http://127.0.0.1:3000${product.imageUrl}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                                                                <svg className="h-6 w-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl sm:rounded-2xl"></div>
                                                    </div>
                                                    <div className="space-y-0.5 sm:space-y-1">
                                                        <p className="text-sm sm:text-base font-medium text-zinc-900 dark:text-zinc-50 tracking-tight line-clamp-2 max-w-[120px] sm:max-w-sm">{product.name}</p>
                                                        <p className="text-[10px] sm:text-xs text-zinc-400 line-clamp-4 max-w-[150px] sm:max-w-md italic whitespace-pre-wrap">
                                                            &ldquo;{product.description.length > 300 ? `${product.description.substring(0, 300)}...` : product.description}&rdquo;
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-10 py-4 sm:py-8">
                                                <span className="inline-flex rounded-full bg-amber-500/10 px-2 sm:px-3 py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-amber-600 ring-1 ring-inset ring-amber-500/20 whitespace-nowrap">
                                                    {product.category || "Budas"}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-10 py-4 sm:py-8">
                                                <span className="font-mono text-base sm:text-lg font-extralight text-zinc-900 dark:text-zinc-50">${product.price}</span>
                                            </td>
                                            <td className="px-4 sm:px-10 py-4 sm:py-8 text-center text-[10px] uppercase tracking-widest whitespace-nowrap">
                                                {product.isSold ? (
                                                    <span className="inline-flex rounded-full bg-red-500/10 px-2 sm:px-3 py-1 font-bold text-red-600 ring-1 ring-inset ring-red-500/20">Vendido</span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-emerald-500/10 px-2 sm:px-3 py-1 font-bold text-emerald-600 ring-1 ring-inset ring-emerald-500/20">Disponible</span>
                                                )}
                                            </td>
                                            <td className="sticky right-0 z-10 bg-white/80 px-2 sm:px-10 py-4 sm:py-8 text-right backdrop-blur-md dark:bg-zinc-950/80 flex justify-end gap-1 sm:gap-2">
                                                <button
                                                    onClick={() => toggleSoldStatus(product)}
                                                    title={product.isSold ? "Reactivar Obra" : "Marcar como Vendido"}
                                                    className={`rounded-full p-3 transition-all ${product.isSold ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30' : 'text-zinc-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/30'}`}
                                                >
                                                    {product.isSold ? (
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="rounded-full p-3 text-zinc-400 transition-all hover:bg-amber-50/80 hover:text-amber-600 dark:hover:bg-amber-950/30"
                                                >
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="rounded-full p-3 text-zinc-400 transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                                                >
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Elite */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-2xl overflow-hidden rounded-[3rem] border border-white/10 bg-zinc-950 shadow-2xl animate-in zoom-in-95 duration-500">
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none"></div>

                        <div className="p-6 sm:p-14 space-y-6 sm:space-y-10">
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl sm:text-4xl font-extralight text-white tracking-tight">
                                    {isEditing ? "Editar" : "Nueva"} <span className="text-amber-500 italic">Vela</span>
                                </h2>
                                <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                                    {isEditing ? "Modificando obra existente" : "Creación de pieza única"}
                                </p>
                            </div>

                            <form onSubmit={handleCreateProduct} className="space-y-8">
                                <div className="grid gap-8 sm:grid-cols-2">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Nombre de la Vela</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full border-b border-zinc-800 bg-transparent py-3 text-white outline-none focus:border-amber-500 transition-all placeholder:text-zinc-800"
                                            placeholder="Ej: Brisa de Medianoche"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Categoría</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full border-b border-zinc-800 bg-transparent py-3 text-white outline-none focus:border-amber-500 transition-all appearance-none cursor-pointer"
                                        >
                                            {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Descripción Artística</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full border-b border-zinc-800 bg-transparent py-3 text-white outline-none focus:border-amber-500 transition-all placeholder:text-zinc-800 resize-none"
                                        placeholder="Evoca la sensación de esta vela..."
                                    />
                                </div>

                                <div className="grid gap-8 sm:grid-cols-2">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Precio (USD)</label>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full border-b border-zinc-800 bg-transparent py-3 text-white outline-none focus:border-amber-500 transition-all font-mono"
                                            placeholder="0.00"
                                        />
                                    </div>

                                </div>

                                <div className="space-y-3 flex items-center gap-4 py-2">
                                    <div
                                        onClick={() => setFormData({ ...formData, isSold: !formData.isSold })}
                                        className={`relative h-6 w-12 rounded-full cursor-pointer transition-all duration-500 ${formData.isSold ? 'bg-red-500/20 ring-1 ring-red-500/50' : 'bg-emerald-500/20 ring-1 ring-emerald-500/50'}`}
                                    >
                                        <div className={`absolute top-1 h-4 w-4 rounded-full transition-all duration-500 ${formData.isSold ? 'left-7 bg-red-500' : 'left-1 bg-emerald-500'}`}></div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Estado de la Obra</p>
                                        <p className={`text-[8px] uppercase tracking-[0.1em] font-medium ${formData.isSold ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {formData.isSold ? "Pieza Vendida (Oculta al Público)" : "Pieza Disponible (Visible al Público)"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Retrato de la Obra</label>
                                    <div className="relative group/upload h-24 w-full flex items-center justify-center rounded-2xl border border-dashed border-zinc-800 hover:border-amber-500/50 transition-all group-hover:bg-amber-500/5 cursor-pointer overflow-hidden">
                                        <input
                                            type="file"
                                            id="image-upload"
                                            onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="flex items-center gap-4 text-zinc-500 group-hover/upload:text-amber-500 transition-colors">
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <span className="text-xs font-medium tracking-widest">{formData.image ? formData.image.name : "Subir Fotografía Artística"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 rounded-full border border-zinc-800 py-5 text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500 transition-all hover:bg-zinc-900"
                                    >
                                        Descartar
                                    </button>
                                    <button
                                        disabled={loading}
                                        className="flex-1 rounded-full bg-white py-5 text-[10px] font-bold uppercase tracking-[0.4em] text-black transition-all hover:bg-zinc-200"
                                    >
                                        {loading ? (isEditing ? "Actualizando..." : "Registrando...") : (isEditing ? "Actualizar Obra" : "Registrar Vela")}
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
