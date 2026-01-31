"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      {/* Hero Section */}
      <header className="relative h-[70vh] w-full overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-40">
          <img src="/mangata-bg.jpg" className="h-full w-full object-cover" />
        </div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="text-6xl font-extralight tracking-[0.4em] text-white uppercase mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Mangata
          </h1>
          <div className="h-[1px] w-24 bg-amber-400 mb-8"></div>
          <p className="max-w-md text-sm uppercase tracking-[0.3em] text-amber-100/60 italic">
            El camino de luz de la luna en tu hogar
          </p>
        </div>
      </header>

      {/* Product Grid */}
      <main className="mx-auto max-w-7xl px-8 py-24">
        <div className="flex flex-col items-center mb-16 space-y-4">
          <h2 className="text-3xl font-light tracking-tight uppercase">Colección <span className="text-amber-600 font-bold">Exclusiva</span></h2>
          <div className="h-[1px] w-12 bg-zinc-200"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-zinc-400 uppercase tracking-widest text-xs">Descubriendo piezas...</div>
        ) : products.length === 0 ? (
          <div className="flex justify-center py-20 text-zinc-400 uppercase tracking-widest text-xs">No hay piezas disponibles por el momento.</div>
        ) : (
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product._id} className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100 rounded-2xl">
                  {product.imageUrl ? (
                    <img
                      src={`http://localhost:3000${product.imageUrl}`}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-300 italic">Sin Imagen</div>
                  )}
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"></div>
                </div>
                <div className="mt-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-900">{product.name}</h3>
                    <p className="mt-1 text-xs text-zinc-500 font-light truncate max-w-[200px]">{product.description}</p>
                  </div>
                  <p className="text-sm font-bold text-amber-700 font-mono">${product.price}</p>
                </div>
                <button className="mt-4 w-full rounded-xl border border-zinc-900 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-900 transition-all hover:bg-zinc-900 hover:text-white">
                  Añadir al Carrito
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-100 py-20 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-8 text-center">
          <h3 className="text-sm font-extralight tracking-[0.5em] uppercase text-zinc-400">Mangata Shop</h3>
          <p className="mt-4 text-[10px] uppercase tracking-widest text-zinc-300">© 2026 Reservados todos los derechos.</p>
        </div>
      </footer>
    </div>
  );
}
