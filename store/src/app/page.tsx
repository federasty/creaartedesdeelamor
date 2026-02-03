"use client";

import { useEffect, useState } from "react";
import PremiumNavbar from "./navbar-premium";

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
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);

  // --- Product Detail Modal State ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Helper para mostrar notificaciones con tipo
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success', duration = 4000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

  // Función para verificar disponibilidad de productos
  const verifyCartAvailability = async (cartItems: CartItem[], availableProducts: Product[]) => {
    const validItems = cartItems.filter(item =>
      availableProducts.some(p => p._id === item.product._id && !p.isSold)
    );

    if (validItems.length < cartItems.length) {
      const removed = cartItems.length - validItems.length;
      showNotification(`${removed} producto(s) ya no están disponibles y fueron removidos`, 'warning', 5000);
    }

    return validItems;
  };

  useEffect(() => {
    // FALLA #3 y #4 FIX: Usar endpoint /available que solo retorna productos disponibles
    fetch("http://127.0.0.1:3000/products/available")
      .then((res) => {
        if (!res.ok) throw new Error("Error en el servidor");
        return res.json();
      })
      .then(async (data: Product[]) => {
        console.log("Productos disponibles:", data);
        setProducts(data);
        setLoading(false);

        // FALLA #4 FIX: Validar carrito guardado contra productos disponibles
        const savedCart = localStorage.getItem("creaartedesdeelamor_cart");
        if (savedCart) {
          try {
            const parsedCart: CartItem[] = JSON.parse(savedCart);
            const validCart = await verifyCartAvailability(parsedCart, data);
            setCart(validCart);
          } catch (e) {
            console.error("Error parsing cart", e);
          }
        }
      })
      .catch((err) => {
        console.error("Fallo al conectar con el backend:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("creaartedesdeelamor_cart", JSON.stringify(cart));
  }, [cart]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const categories = ["Todas", "Budas", "Ganeshas", "Ganeshas Tibetanos", "Velas de Miel", "Fuentes de Humo"];

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
  // FALLA #3 FIX: Verificar disponibilidad en tiempo real antes de agregar
  const addToCart = async (product: Product) => {
    // Verificar si ya está en el carrito localmente
    const existing = cart.find(item => item.product._id === product._id);
    if (existing) {
      showNotification('Esta pieza ya está en tu selección', 'warning');
      return;
    }

    // Verificar disponibilidad en tiempo real con el backend
    try {
      const res = await fetch('http://127.0.0.1:3000/products/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: [product._id] })
      });

      if (!res.ok) {
        // Si el servidor falla, preferimos dejar que el usuario lo intente
        console.warn('Backend unavailable, allowing add to cart');
        setCart(prev => [...prev, { product }]);
        showNotification(`✨ ${product.name} añadida a tu selección`, 'success');
        return;
      }

      const { available, unavailable } = await res.json();

      if (unavailable.includes(product._id)) {
        showNotification('Lo sentimos, esta pieza ya no está disponible ahora mismo', 'error', 4000);
        // Actualizar lista local solo si estamos seguros que se vendió (isSold: true)
        // Pero no lo removemos por ahora para no frustrar si es un error de red
        return;
      }

      // Si está disponible, agregar al carrito
      setCart(prev => [...prev, { product }]);
      showNotification(`✨ ${product.name} añadida a tu selección`, 'success');

    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      // En caso de error de red, permitir agregar (mejor UX)
      setCart(prev => [...prev, { product }]);
      showNotification(`✨ ${product.name} añadida a tu selección`, 'success');
    }
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

  const checkoutViaWhatsApp = async () => {
    const phoneNumber = "59893707023";

    // FALLA #3 FIX: Verificar disponibilidad de TODOS los productos del carrito antes de proceder
    try {
      const productIds = cart.map(item => item.product._id);
      const checkRes = await fetch('http://127.0.0.1:3000/products/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds })
      });

      if (!checkRes.ok) throw new Error('Error verificando disponibilidad');

      const { available, unavailable } = await checkRes.json();

      // Si hay productos no disponibles, notificar y removerlos
      if (unavailable.length > 0) {
        const unavailableItems = cart.filter(item => unavailable.includes(item.product._id));
        const availableItems = cart.filter(item => available.includes(item.product._id));

        showNotification(`${unavailable.length} producto(s) ya no están disponibles y fueron removidos`, 'warning', 5000);

        // Actualizar carrito solo con disponibles
        setCart(availableItems);
        // Actualizar lista de productos
        setProducts(prev => prev.filter(p => !unavailable.includes(p._id)));

        // Si no queda nada disponible, cancelar
        if (available.length === 0) {
          return;
        }

        // Continuar solo con los disponibles (mensaje actualizado)
      }

      // Construir mensaje con productos disponibles
      const itemsToCheckout = cart.filter(item => available.includes(item.product._id));
      let message = "Hola Crea Arte desde el Amor! Me interesa adquirir las siguientes piezas únicas:\n\n";

      itemsToCheckout.forEach(item => {
        message += `• ${item.product.name} (Pieza Única) - $${item.product.price.toFixed(2)}\n`;
      });

      const total = itemsToCheckout.reduce((sum, item) => sum + item.product.price, 0);
      message += `\nInversión Total: $${total.toFixed(2)}\n\nPor favor, confirmarme disponibilidad para concretar la compra. ¡Gracias!`;

      // Marcar productos como vendidos ANTES de abrir WhatsApp (con validación del backend)
      const sellResults = await Promise.allSettled(
        itemsToCheckout.map(item =>
          fetch(`http://127.0.0.1:3000/products/${item.product._id}/sold`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
          }).then(res => {
            if (!res.ok) throw new Error('Producto no disponible');
            return res.json();
          })
        )
      );

      // Verificar cuáles se vendieron exitosamente
      const successfullySold = sellResults
        .map((result, index) => ({ result, item: itemsToCheckout[index] }))
        .filter(({ result }) => result.status === 'fulfilled')
        .map(({ item }) => item);

      const failedToSell = sellResults
        .map((result, index) => ({ result, item: itemsToCheckout[index] }))
        .filter(({ result }) => result.status === 'rejected')
        .map(({ item }) => item);

      if (failedToSell.length > 0) {
        showNotification(`${failedToSell.length} producto(s) ya fueron vendidos a otro cliente`, 'error', 5000);
      }

      // Solo proceder si al menos un producto se vendió
      if (successfullySold.length > 0) {
        // Recalcular mensaje solo con los que sí se vendieron
        let finalMessage = "Hola Crea Arte desde el Amor! Me interesa adquirir las siguientes piezas únicas:\n\n";
        successfullySold.forEach(item => {
          finalMessage += `• ${item.product.name} (Pieza Única) - $${item.product.price.toFixed(2)}\n`;
        });
        const finalTotal = successfullySold.reduce((sum, item) => sum + item.product.price, 0);
        finalMessage += `\nInversión Total: $${finalTotal.toFixed(2)}\n\nPor favor, confirmarme disponibilidad para concretar la compra. ¡Gracias!`;

        // Abrir WhatsApp
        const encodedMessage = encodeURIComponent(finalMessage);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");

        // Limpiar carrito y actualizar lista
        setCart([]);
        setIsCartOpen(false);
        setProducts(prev => prev.filter(p => !successfullySold.find(item => item.product._id === p._id)));
      }

    } catch (error) {
      console.error('Error en checkout:', error);
      showNotification('Error al procesar tu pedido. Por favor intenta de nuevo.', 'error', 5000);
    }
  };

  return (
    <div className="min-h-screen bg-spiritual-dark text-white font-sans selection:bg-spiritual-purple/30">

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
                        <div className="h-full w-full flex items-center justify-center text-[10px] text-zinc-800">Crea Arte desde el Amor</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center flex-1 py-1">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-white">{item.product.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-spiritual-purple/50"></div>
                            <p className="text-[8px] uppercase tracking-widest text-spiritual-purple/60 font-medium">Obra Única</p>
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
                    <p className="text-[10px] uppercase tracking-[0.4em] text-spiritual-purple font-bold">Confirmación via WhatsApp</p>
                    <div className="h-[1px] w-6 bg-spiritual-purple/30"></div>
                  </div>
                  <p className="text-2xl font-mono text-white tracking-tighter">$ {getCartTotal().toFixed(2)}</p>
                </div>

                <button
                  onClick={checkoutViaWhatsApp}
                  className="relative w-full h-16 bg-spiritual-purple text-black text-[10px] font-bold uppercase tracking-[0.5em] flex items-center justify-center gap-3 overflow-hidden group shadow-[0_20px_40px_-10px_rgba(167,139,250,0.2)] hover:bg-spiritual-purple/80 transition-all duration-500 active:scale-[0.98]"
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

      {/* --- Premium Navbar --- */}
      <PremiumNavbar onCartClick={() => setIsCartOpen(true)} cartItemsCount={getItemsCount()} />

      {/* --- Hero --- */}
      <header className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* New Premium Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/spiritual-hero-bg.jpg"
            className="h-full w-full object-cover object-left md:object-center scale-110 animate-ken-burns opacity-60"
            alt="Budas y Ganeshas Arte Sagrado"
          />
          {/* Spiritual Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-spiritual-dark/80 via-transparent to-spiritual-dark"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-spiritual-dark/40 via-transparent to-spiritual-dark/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-4xl">
          {/* Floating Logo Ornament */}
          <div className="mb-12 relative group mx-auto">
            {/* Subtle Glow */}
            <div className="absolute inset-0 -m-12">
              <div className="absolute inset-0 bg-spiritual-purple/20 blur-3xl rounded-full animate-pulse"></div>
            </div>

            {/* Logo with Premium Effects & Edge Masking */}
            <div className="relative group/logo mx-auto">
              {/* Outer Spiritual Halo */}
              <div className="absolute inset-0 -m-4 bg-spiritual-purple/30 blur-2xl rounded-full opacity-50 animate-pulse"></div>

              <div className="relative h-44 w-44 md:h-64 md:w-64 p-[4px] rounded-full bg-gradient-to-tr from-spiritual-purple via-white/60 to-spiritual-purple shadow-[0_0_60px_rgba(167,139,250,0.8)] transition-all duration-700 group-hover:scale-105 group-hover:shadow-[0_0_90px_rgba(167,139,250,1)] overflow-hidden mx-auto">
                <img
                  src="/logo-spiritual.png"
                  className="h-full w-full object-cover rounded-full relative z-10 scale-[1.18]"
                  alt="Crea Arte desde el Amor Logo"
                />
                {/* Internal Mask - Extra Thick Rings to cover the black edges */}
                <div className="absolute inset-0 rounded-full border-[6px] border-white/20 z-20 pointer-events-none"></div>
                <div className="absolute inset-0 rounded-full border-[2px] border-spiritual-purple/30 z-30 pointer-events-none"></div>
              </div>

              {/* Rotating Sacred Geometry Ring */}
              <div className="absolute inset-x-0 inset-y-0 -m-6 border border-spiritual-purple/20 rounded-full animate-spin pointer-events-none" style={{ animationDuration: '25s' }}></div>
              <div className="absolute inset-x-0 inset-y-0 -m-10 border border-spiritual-purple/10 rounded-full animate-spin-reverse pointer-events-none" style={{ animationDuration: '35s' }}></div>
            </div>
          </div>

          <p className="text-[12px] uppercase tracking-[0.8em] text-spiritual-purple mb-6 font-medium animate-slide-up">
            Arte Sagrado & Conexión Espiritual
          </p>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 animate-bounce opacity-40">
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </header>

      {/* --- Shop Section --- */}
      <section id="shop" className="mx-auto max-w-7xl px-4 sm:px-8 py-24">
        {/* --- Shop Section Header --- */}
        <div className="mb-24 flex flex-col items-center text-center space-y-10">
          <div className="space-y-4 animate-slide-up">
            {/* Spiritual Accent */}
            <div className="flex justify-center items-center gap-3 opacity-40">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-spiritual-purple"></div>
              <span className="text-spiritual-purple text-[10px] tracking-[0.6em] uppercase font-bold">Mantras del Corazón</span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-spiritual-purple"></div>
            </div>

            <h2 className="text-4xl md:text-6xl font-serif font-extralight tracking-tight uppercase">
              Selección <span className="text-spiritual-purple font-serif italic drop-shadow-[0_0_15px_rgba(167,139,250,0.4)]">Espiritual</span>
            </h2>

            {/* Subtle Divider */}
            <div className="flex justify-center py-2">
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
            </div>

            <p className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-zinc-500 font-medium max-w-lg mx-auto leading-relaxed">
              Piezas únicas para tu espacio zen • Arte Sagrado y Conexión Divina
            </p>
          </div>

          {/* Improved Category Filters */}
          <div className="relative w-full max-w-3xl px-4">
            {/* Background Aura for active category */}
            <div className="absolute inset-0 bg-spiritual-purple/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 relative z-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    group relative px-8 py-3 rounded-full text-[9px] font-bold uppercase tracking-[0.25em] transition-all duration-700
                    ${activeCategory === cat
                      ? "text-black scale-105"
                      : "text-zinc-500 hover:text-spiritual-purple border border-white/5 hover:border-spiritual-purple/30 bg-white/[0.02]"
                    }
                  `}
                >
                  {/* Selected Active Background */}
                  {activeCategory === cat && (
                    <>
                      <div className="absolute inset-0 bg-white rounded-full shadow-[0_5px_30px_rgba(255,255,255,0.2)]"></div>
                      <div className="absolute inset-[-4px] bg-spiritual-purple/20 blur-xl rounded-full animate-pulse"></div>
                    </>
                  )}

                  {/* Hover Border Glow */}
                  <div className="absolute inset-0 rounded-full border border-spiritual-purple/0 group-hover:border-spiritual-purple/40 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="h-6 w-6 border-2 border-spiritual-purple/30 border-t-spiritual-purple rounded-full animate-spin"></div>
            <p className="text-[8px] uppercase tracking-[0.4em] text-zinc-600">Sincronizando piezas sagradas...</p>
          </div>
        ) : (
          <>
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16">
                {currentProducts.map((product) => (
                  <div key={product._id} className="group flex flex-col">
                    <div
                      className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 shadow-2xl transition-all duration-700 group-hover:border-spiritual-purple/30 cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {product.imageUrl ? (
                        <img src={`http://localhost:3000${product.imageUrl}`} className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition duration-[2s]" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[10px] uppercase tracking-widest text-zinc-800">Crea Arte desde el Amor</div>
                      )}

                      {/* Overlay con botones (Solo Desktop) */}
                      <div className="absolute inset-0 hidden lg:flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/90 to-transparent">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                            className="flex-1 h-10 bg-transparent border border-white/30 text-white text-[9px] font-bold uppercase tracking-[0.15em] hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                            Ver
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                            className="flex-1 h-10 bg-white text-black text-[9px] font-bold uppercase tracking-[0.15em] hover:bg-amber-500 transition-colors"
                          >
                            {cart.find(item => item.product._id === product._id) ? "En Selección" : "Adquirir"}
                          </button>
                        </div>
                      </div>

                      {/* Icono de zoom en esquina (Solo Desktop) */}
                      <div className="absolute top-4 right-4 h-8 w-8 bg-black/50 backdrop-blur-sm rounded-full hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3 px-1">
                      <div className="flex justify-between items-start gap-4">
                        <h3
                          className="text-[11px] font-light tracking-[0.1em] uppercase group-hover:text-spiritual-purple transition-colors line-clamp-2 flex-1 cursor-pointer"
                          onClick={() => setSelectedProduct(product)}
                        >
                          {product.name}
                        </h3>
                        <p className="text-sm font-mono text-zinc-400 whitespace-nowrap">$ {product.price}</p>
                      </div>
                      {/* Descripción truncada a 300 caracteres */}
                      {product.description && (
                        <p className="text-[10px] text-zinc-500 font-light leading-relaxed line-clamp-5 whitespace-pre-wrap">
                          {product.description.length > 300
                            ? `${product.description.substring(0, 300)}...`
                            : product.description}
                        </p>
                      )}
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
            ) : (
              <div className="flex flex-col items-center justify-center py-48 text-center space-y-8 animate-fade-in">
                {/* Spiritual Empty State Icon */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-spiritual-purple/10 blur-2xl rounded-full scale-150 animate-pulse"></div>
                  <div className="relative h-20 w-20 flex items-center justify-center rounded-full border border-spiritual-purple/20 bg-spiritual-purple/5">
                    <span className="text-3xl text-spiritual-purple/40">ॐ</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-extralight tracking-[0.4em] text-white/80 uppercase">Buscando en el Vacío Sagrado</p>
                  <p className="text-[10px] tracking-[0.2em] text-zinc-600 uppercase">Aún no hay piezas disponibles en esta categoría</p>
                </div>

                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-spiritual-purple/20 to-transparent"></div>
              </div>
            )}

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
                      className={`h-10 w-10 text-[10px] font-mono transition-all rounded-full ${currentPage === i + 1 ? "bg-spiritual-purple text-black font-bold" : "text-zinc-600 hover:text-white"}`}
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



      {/* --- Section Nosotros: Centered & Spiritual --- */}
      <section id="about" className="relative py-32 lg:py-56 overflow-hidden bg-spiritual-dark/20">
        {/* Background Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-spiritual-purple/[0.03] blur-[150px] rounded-full pointer-events-none"></div>

        <div className="mx-auto max-w-5xl px-8 relative">
          <div className="flex flex-col items-center text-center space-y-20">

            {/* Section Header - Consistent with Shop */}
            <div className="space-y-6 animate-slide-up">
              <div className="flex justify-center items-center gap-3 opacity-40">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-spiritual-purple"></div>
                <span className="text-spiritual-purple text-[10px] tracking-[0.6em] uppercase font-bold">Alquimia Sagrada</span>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-spiritual-purple"></div>
              </div>

              <h2 className="text-4xl md:text-7xl font-serif font-extralight tracking-tight uppercase leading-tight">
                El Arte de <span className="text-spiritual-purple font-serif italic drop-shadow-[0_0_20px_rgba(167,139,250,0.5)]">Elevar el Alma</span>
              </h2>

              <div className="flex justify-center py-2">
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
              </div>
            </div>

            {/* Content & Image - Balanced Centered Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Image with Premium Frame */}
              <div className="relative group order-2 lg:order-1">
                <div className="absolute -inset-10 bg-spiritual-purple/[0.03] blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 shadow-2xl transition-all duration-700 group-hover:border-spiritual-purple/30">
                  <img
                    src="/nosotros.jpeg"
                    alt="Nuestro Manifiesto Artesanal"
                    className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-[3s] scale-105 group-hover:scale-100"
                  />
                  {/* Subtle Grain Overlay */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-6 h-28 w-28 bg-[#080808]/80 backdrop-blur-xl border border-white/10 rounded-full flex flex-col justify-center items-center text-center p-4 shadow-2xl transform transition-transform duration-700 group-hover:-translate-y-2 z-20">
                  <div className="mb-0.5">
                    <span className="text-xl font-serif italic text-spiritual-purple">100</span>
                    <span className="text-xs text-spiritual-purple/60 ml-0.5">%</span>
                  </div>
                  <p className="text-[7px] uppercase tracking-[0.3em] text-zinc-500 leading-tight">Energía<br />Divina</p>
                </div>
              </div>

              {/* Text Body - Refined Hierarchy */}
              <div className="space-y-10 text-pretty order-1 lg:order-2 lg:text-left text-center">
                <div className="space-y-6">
                  <p className="text-2xl md:text-3xl font-serif font-extralight text-zinc-100 leading-relaxed italic">
                    "Crea Arte desde el Amor nace para ser el puente entre lo <span className="text-spiritual-purple/90">invisible y tu espacio sagrado</span>."
                  </p>
                  <p className="text-sm md:text-lg text-zinc-400 font-light leading-relaxed tracking-wide">
                    Nuestras piezas no son solo arte; son portales vibracionales. Cada Buda que esculpimos custodia la serenidad mística, y cada Ganesha —incluyendo las veneradas figuras de la tradición Tibetana— actúa como un guardián de caminos, transmutando obstáculos en pura armonía y abundancia divina.
                  </p>
                </div>

                <div className="pt-8 space-y-8">
                  <div className="flex flex-col space-y-6 lg:items-start items-center">
                    <p className="max-w-md text-zinc-500 text-[14px] leading-relaxed italic">
                      Elegir una de nuestras obras es anclar una intención de paz inquebrantable. Es permitir que la sabiduría milenaria de Oriente habite en tu rincón zen, irradiando una luz que calma la mente y despierta el espíritu hacia el amor incondicional.
                    </p>

                    {/* Manifest Accent */}
                    <div className="flex items-center gap-4 py-4">
                      <div className="h-[1px] w-12 bg-gradient-to-r from-spiritual-purple/40 to-transparent"></div>
                      <span className="text-[10px] uppercase tracking-[0.5em] text-spiritual-purple/60 font-bold">Nuestro Manifiesto de Luz</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#020202] py-24 border-t border-white/5 mt-20">
        <div className="mx-auto max-w-7xl px-8 flex flex-col items-center justify-center text-center">
          <h2 className="group cursor-default relative">
            <span className="text-2xl sm:text-5xl font-extralight tracking-[0.6em] sm:tracking-[1.2em] uppercase mb-12 block transition-all duration-1000 group-hover:tracking-[0.8em] sm:group-hover:tracking-[1.4em] group-hover:text-spiritual-purple/80">
              Crea Arte desde el Amor
            </span>
            <div className="absolute inset-0 blur-2xl bg-spiritual-purple/0 group-hover:bg-spiritual-purple/10 transition-all duration-1000 rounded-full"></div>
          </h2>
          <div className="flex gap-10 text-[9px] uppercase tracking-[0.4em] text-zinc-700">
            <span className="hover:text-amber-500 cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-amber-500 cursor-pointer transition-colors">Facebook</span>
            <span className="hover:text-amber-500 cursor-pointer transition-colors">Pinterest</span>
          </div>
          <p className="mt-16 text-[8px] uppercase tracking-[0.4em] text-zinc-800">© 2026 fdroots Crea Arte desde el Amor — Edición Limitada</p>
        </div>
      </footer>

      {/* --- WhatsApp Float Premium --- */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] group">
        {/* Subtle Aura on Hover */}
        <div className="absolute inset-0 -m-4 bg-spiritual-purple/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        {/* Tooltip Label - Glassmorphic */}
        <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 px-5 py-3 bg-black/40 backdrop-blur-xl text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full opacity-0 translate-x-4 pointer-events-none transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 border border-white/10 shadow-2xl whitespace-nowrap">
          ¿En qué puedo ayudarte?
        </div>

        <a
          href="https://wa.me/59893707023?text=Hola%20Crea%20Arte%20desde%20el%20Amor,%20me%20interesa%20un%20producto"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex h-16 w-16 md:h-18 md:w-18 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_rgba(37,211,102,0.3)] transition-all duration-700 hover:scale-110 hover:-translate-y-2 active:scale-95 group-hover:shadow-[0_15px_60px_rgba(167,139,250,0.3)]"
        >
          {/* White border mask */}
          <div className="absolute inset-0 border-2 border-white/20 rounded-full group-hover:border-white/40 transition-colors"></div>
          <svg className="h-8 w-8 md:h-9 md:w-9 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
        </a>
      </div>

      <style jsx global>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes slideUp {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-ken-burns { animation: ken-burns 25s ease-in-out infinite; }
        @keyframes radar {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .animate-radar {
          animation: radar 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {/* --- Product Detail Modal --- */}
      {
        selectedProduct && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setSelectedProduct(null)}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/95 shadow-2xl animate-scale-in">
              {/* Close button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-20 h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                {/* Image Section */}
                <div className="relative lg:w-3/5 h-[40vh] lg:h-auto overflow-hidden bg-zinc-900 flex-shrink-0">
                  {selectedProduct.imageUrl ? (
                    <img
                      src={`http://localhost:3000${selectedProduct.imageUrl}`}
                      alt={selectedProduct.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-4xl font-serif text-zinc-800 tracking-[0.3em] uppercase">Crea Arte desde el Amor</span>
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-spiritual-purple">{selectedProduct?.category || 'Exclusiva'}</span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="lg:w-2/5 flex flex-col overflow-y-auto">
                  <div className="p-8 lg:p-12 flex-1 space-y-8">
                    {/* Header */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1 w-8 bg-spiritual-purple rounded-full"></div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-spiritual-purple/70">Pieza Única</span>
                      </div>
                      <h2 className="text-3xl lg:text-4xl font-serif font-extralight tracking-tight text-white leading-tight">
                        {selectedProduct.name}
                      </h2>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-4">
                      <span className="text-4xl font-mono font-light text-white">
                        ${selectedProduct?.price?.toLocaleString() || '0'}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500">MXN</span>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Descripción</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed font-light whitespace-pre-wrap break-words">
                        {selectedProduct?.description || 'Una pieza artesanal única, elaborada a mano con los más finos materiales. Cada vela Crea Arte desde el Amor es una obra de arte que combina aromas exquisitos con un diseño excepcional, creando una experiencia sensorial incomparable.'}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600">Elaboración</span>
                        <p className="text-xs text-zinc-300">100% Artesanal</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600">Disponibilidad</span>
                        <p className="text-xs text-emerald-400">En Stock</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-8 lg:p-12 pt-0 space-y-4">
                    <button
                      onClick={() => {
                        if (selectedProduct) {
                          addToCart(selectedProduct);
                          setSelectedProduct(null);
                        }
                      }}
                      disabled={cart.find(item => item.product._id === selectedProduct?._id) !== undefined}
                      className={`
                      w-full h-14 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300
                      flex items-center justify-center gap-3
                      ${cart.find(item => item.product._id === selectedProduct?._id)
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                          : 'bg-white text-black hover:bg-spiritual-purple hover:text-white'
                        }
                    `}
                    >
                      {cart.find(item => item.product._id === selectedProduct?._id) ? (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          En tu Selección
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Añadir a Selección
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="w-full h-12 rounded-xl border border-white/10 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white hover:border-white/20 transition-all"
                    >
                      Continuar Explorando
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Notification Toast - Mejorado */}
      {
        notification && (
          <div className="fixed inset-x-0 top-8 z-[200] flex justify-center px-4 animate-slide-up">
            <div className={`
            relative overflow-hidden
            max-w-lg w-full
            backdrop-blur-2xl shadow-2xl
            rounded-2xl border
            px-6 py-5
            flex items-center gap-4
            ${notification?.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-500/40'
                : notification?.type === 'error'
                  ? 'bg-red-500/20 border-red-500/40'
                  : 'bg-spiritual-purple/20 border-spiritual-purple/40'
              }
          `}>
              {/* Animated background glow */}
              <div className={`
              absolute inset-0 opacity-30
              ${notification?.type === 'success'
                  ? 'bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0'
                  : notification?.type === 'error'
                    ? 'bg-gradient-to-r from-red-500/0 via-red-500/30 to-red-500/0'
                    : 'bg-gradient-to-r from-spiritual-purple/0 via-spiritual-purple/30 to-spiritual-purple/0'
                }
              animate-pulse
            `}></div>

              {/* Icon */}
              <div className={`
              relative flex-shrink-0 h-10 w-10 rounded-full 
              flex items-center justify-center
              ${notification?.type === 'success'
                  ? 'bg-emerald-500/30 text-emerald-300'
                  : notification?.type === 'error'
                    ? 'bg-red-500/30 text-red-300'
                    : 'bg-spiritual-purple/30 text-spiritual-purple/30'
                }
            `}>
                {notification?.type === 'success' && (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {notification?.type === 'error' && (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {notification?.type === 'warning' && (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
              </div>

              {/* Message */}
              <div className="relative flex-1 min-w-0">
                <p className={`
                text-sm font-medium tracking-wide
                ${notification?.type === 'success'
                    ? 'text-emerald-100'
                    : notification?.type === 'error'
                      ? 'text-red-100'
                      : 'text-spiritual-purple'
                  }
              `}>
                  {notification?.message}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={() => setNotification(null)}
                className={`
                relative flex-shrink-0 p-1.5 rounded-full transition-all
                hover:bg-white/10
                ${notification?.type === 'success'
                    ? 'text-emerald-300'
                    : notification?.type === 'error'
                      ? 'text-red-300'
                      : 'text-spiritual-purple'
                  }
              `}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                <div
                  className={`
                  h-full animate-shrink
                  ${notification?.type === 'success'
                      ? 'bg-emerald-400'
                      : notification?.type === 'error'
                        ? 'bg-red-400'
                        : 'bg-spiritual-purple'
                    }
                `}
                  style={{ animation: 'shrink 4s linear forwards' }}
                ></div>
              </div>
            </div>
          </div>
        )}
    </div >
  );
}
