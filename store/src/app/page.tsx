"use client";

import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  stock?: number;
  isSold?: boolean;
}

interface CartItem {
  product: Product;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todas");

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  // --- Cart State ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        // Only show products that are NOT sold
        setProducts(data.filter(p => !p.isSold));
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const savedCart = localStorage.getItem("mangata_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mangata_cart", JSON.stringify(cart));
  }, [cart]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const categories = ["Todas", "Aromática", "Decorativa", "Especial", "Edición Limitada"];

  const filteredProducts = activeCategory === "Todas"
    ? products
    : products.filter(p => p.category === activeCategory);

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Cart Actions (Unique items only) ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product._id === product._id);
      if (existing) {
        return prev;
      }
      setNotification(`${product.name} añadida a tu selección`);
      setTimeout(() => setNotification(null), 3000);
      return [...prev, { product }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price, 0);
  };

  const getItemsCount = () => {
    return cart.length;
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkoutViaWhatsApp = () => {
    const phoneNumber = "59893653142";
    let message = "Hola Mangata! Me interesa adquirir las siguientes piezas únicas:\n\n";

    cart.forEach(item => {
      message += `• ${item.product.name} (Pieza Única) - $${item.product.price.toFixed(2)}\n`;
    });

    message += `\nInversión Total: $${getCartTotal().toFixed(2)}\n\nPor favor, confirmarme disponibilidad para concretar la compra. ¡Gracias!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");

    // Mark products as sold in the backend using the public endpoint
    cart.forEach(async (item) => {
      try {
        await fetch(`http://localhost:3000/products/${item.product._id}/sold`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        });
      } catch (e) {
        console.error("Error marking as sold", e);
      }
    });

    // Clear local selection and refresh
    setCart([]);
    setIsCartOpen(false);
    // Optional: local refresh to remove them from list immediately
    setProducts(prev => prev.filter(p => !cart.find(item => item.product._id === p._id)));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500/30">

      {/* --- Shopping Cart Drawer --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative h-full w-full max-w-md bg-zinc-950 border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-500 overflow-hidden flex flex-col">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extralight tracking-[0.2em] uppercase">Tu Selección</h2>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Piezas Exclusivas</p>
              </div>
              <div className="flex items-center gap-4">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[8px] uppercase tracking-[0.3em] text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    Vaciar
                  </button>
                )}
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-600 font-light">Tu selección está vacía</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product._id} className="flex gap-6 group">
                    <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-900 border border-white/5">
                      {item.product.imageUrl ? (
                        <img src={`http://localhost:3000${item.product.imageUrl}`} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] text-zinc-800">Mangata</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center flex-1 py-1">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-white">{item.product.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-amber-500/50"></div>
                            <p className="text-[8px] uppercase tracking-widest text-amber-500/60 font-medium">Obra Única</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-mono text-zinc-300">$ {item.product.price}</p>
                          <button onClick={() => removeFromCart(item.product._id)} className="text-[8px] uppercase tracking-widest text-zinc-600 hover:text-red-500 mt-2 transition-colors">Retirar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-white/5 bg-zinc-900/40 backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-10">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-amber-500 font-bold">Confirmación via WhatsApp</p>
                    <div className="h-[1px] w-6 bg-amber-500/30"></div>
                  </div>
                  <p className="text-2xl font-mono text-white tracking-tighter">$ {getCartTotal().toFixed(2)}</p>
                </div>

                <button
                  onClick={checkoutViaWhatsApp}
                  className="relative w-full h-16 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-[0.5em] flex items-center justify-center gap-3 overflow-hidden group shadow-[0_20px_40px_-10px_rgba(245,158,11,0.2)] hover:bg-amber-400 transition-all duration-500 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shine transition-all"></div>

                  <span className="relative z-10">Confirmar Selección</span>
                  <svg className="relative z-10 h-5 w-5 text-black group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Navegación --- */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-10 py-6">
          <h1 className="text-xl font-extralight tracking-[0.5em] uppercase text-white cursor-pointer hover:text-amber-500 transition-colors">Mangata</h1>
          <div className="flex items-center gap-10">
            <button onClick={() => setIsCartOpen(true)} className="relative group p-2">
              <svg className="h-5 w-5 text-zinc-400 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {getItemsCount() > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-black shadow-lg">
                  {getItemsCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Hero --- */}
      <header className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/mangata-bg.jpg" className="h-full w-full object-cover animate-ken-burns opacity-40" alt="Mangata" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]"></div>
        </div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.6em] text-amber-200/40 mb-6 italic">Artesanía en cera y luz</p>
          <h1 className="text-6xl md:text-9xl font-extralight tracking-[0.2em] uppercase mb-12">Mangata</h1>

        </div>
      </header>

      {/* --- Shop Section --- */}
      <section id="shop" className="mx-auto max-w-7xl px-8 py-24">
        <div className="mb-20 flex flex-col md:flex-row items-center justify-between gap-10 border-b border-white/5 pb-10">
          <div>
            <h2 className="text-3xl font-extralight tracking-tight uppercase">Selección <span className="text-amber-500 font-normal italic">Exclusiva</span></h2>
            <p className="text-[9px] uppercase tracking-[0.4em] text-zinc-500 mt-2">Cada pieza es una obra irrepetible</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? "bg-white text-black" : "text-zinc-500 hover:text-white border border-white/5"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="h-6 w-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
            <p className="text-[8px] uppercase tracking-[0.4em] text-zinc-600">Sincronizando esencias únicas...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16">
              {currentProducts.map((product) => (
                <div key={product._id} className="group flex flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 shadow-2xl transition-all duration-700 group-hover:border-amber-500/30">
                    {product.imageUrl ? (
                      <img src={`http://localhost:3000${product.imageUrl}`} className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition duration-[2s]" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[8px] uppercase tracking-widest text-zinc-800">Mangata</div>
                    )}

                    <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/90 to-transparent">
                      <button
                        onClick={() => addToCart(product)}
                        className="h-10 w-full bg-white text-black text-[8px] font-bold uppercase tracking-[0.2em] hover:bg-amber-600 transition-colors"
                      >
                        {cart.find(item => item.product._id === product._id) ? "En Selección" : "Adquirir Obra"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 px-1">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-[11px] font-light tracking-[0.1em] uppercase group-hover:text-amber-500 transition-colors line-clamp-2 flex-1">{product.name}</h3>
                      <p className="text-sm font-mono text-zinc-400 whitespace-nowrap">$ {product.price}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] text-zinc-600 font-light truncate uppercase tracking-widest">{product.category}</p>
                      <div className="h-[1px] w-6 bg-zinc-800"></div>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-3 border border-white/5 text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-400 hover:text-white hover:border-white/20 transition-all lg:hidden"
                    >
                      {cart.find(item => item.product._id === product._id) ? "En Selección" : "Comprar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-24 flex items-center justify-center gap-4">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 rounded-full border border-white/5 text-zinc-500 hover:text-white disabled:opacity-20 transition-all"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`h-10 w-10 text-[10px] font-mono transition-all rounded-full ${currentPage === i + 1 ? "bg-amber-500 text-black font-bold" : "text-zinc-600 hover:text-white"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-full border border-white/5 text-zinc-500 hover:text-white disabled:opacity-20 transition-all"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#020202] py-24 border-t border-white/5 mt-20">
        <div className="mx-auto max-w-7xl px-8 flex flex-col items-center justify-center text-center">
          <h2 className="group cursor-default relative">
            <span className="text-2xl sm:text-5xl font-extralight tracking-[0.6em] sm:tracking-[1.2em] uppercase mb-12 block transition-all duration-1000 group-hover:tracking-[0.8em] sm:group-hover:tracking-[1.4em] group-hover:text-amber-500/80">
              Mangata
            </span>
            <div className="absolute inset-0 blur-2xl bg-amber-500/0 group-hover:bg-amber-500/10 transition-all duration-1000 rounded-full"></div>
          </h2>
          <div className="flex gap-10 text-[9px] uppercase tracking-[0.4em] text-zinc-700">
            <span className="hover:text-amber-500 cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-amber-500 cursor-pointer transition-colors">Facebook</span>
            <span className="hover:text-amber-500 cursor-pointer transition-colors">Pinterest</span>
          </div>
          <p className="mt-16 text-[8px] uppercase tracking-[0.4em] text-zinc-800">© 2026 fdroots Mangata — Edición Limitada</p>
        </div>
      </footer>

      {/* --- WhatsApp Float --- */}
      <a
        href="https://wa.me/59893653142?text=Hola!%20Me%20interesa%20su%20producto."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
      >
        <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>

      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
        .animate-ken-burns { animation: ken-burns 25s ease-in-out infinite; }
      `}</style>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-full shadow-2xl flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-white">{notification}</p>
          </div>
        </div>
      )}
    </div>
  );
}
