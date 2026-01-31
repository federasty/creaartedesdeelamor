"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todas");

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["Todas", "Aromática", "Decorativa", "Especial", "Edición Limitada"];

  const filteredProducts = activeCategory === "Todas"
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500/30">

      {/* --- Navegación Elite --- */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-10 py-8">
          <div className="flex items-center gap-16">
            <h1 className="text-xl md:text-2xl font-extralight tracking-[0.5em] uppercase text-white cursor-pointer hover:text-amber-500 transition-colors">Mangata</h1>
            <div className="hidden lg:flex items-center gap-12 text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-medium">
              <a href="#" className="hover:text-white transition-colors duration-300">Colecciones</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Nuestra Esencia</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Atelier</a>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <button className="relative group p-2">
              <svg className="h-6 w-6 text-zinc-400 group-hover:text-amber-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-black shadow-lg">0</span>
            </button>
          </div>
        </div>
      </nav>

      {/* --- Hero: Experiencia Sensorial --- */}
      <header className="relative h-screen w-full overflow-hidden">
        {/* Imagen de fondo con Ken Burns lento */}
        <div className="absolute inset-0 z-0">
          <img
            src="/mangata-bg.jpg"
            className="h-full w-full object-cover animate-ken-burns opacity-50 contrast-125"
            alt="Vela Mangata"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]"></div>
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto">
          <div className="flex flex-col items-center mb-10 md:mb-16">
            <div className="mb-6 h-[1px] w-12 md:w-24 bg-amber-500/40 animate-width-grow"></div>
            <p className="text-[9px] md:text-[12px] uppercase tracking-[0.4em] md:tracking-[0.8em] text-amber-200/50 font-light italic animate-in fade-in slide-in-from-bottom-2 duration-1000">
              Artesanía en cera y luz
            </p>
          </div>

          <h1 className="text-4xl md:text-[10rem] font-extralight tracking-[0.1em] md:tracking-[0.2em] text-white uppercase mb-12 md:mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 leading-none">
            Mangata
          </h1>

          <p className="max-w-2xl text-[10px] md:text-lg font-extralight text-zinc-400 tracking-[0.15em] leading-[2] mb-16 md:mb-24 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            El camino de luz de la luna capturado en fragancias atemporales. <br className="hidden md:block" /> Velas diseñadas para elevar el espíritu de tu hogar.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 md:gap-10 animate-in fade-in slide-in-from-bottom-16 duration-1000 w-full max-w-xs sm:max-w-none justify-center px-4 sm:px-0">
            <button className="h-14 md:h-18 px-10 md:px-16 border border-white/10 bg-white text-black text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-amber-600 transition-all duration-700 w-full sm:w-auto shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)]">
              Ver Colección
            </button>
            <button className="h-14 md:h-18 px-10 md:px-16 border border-white/20 bg-transparent text-white text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-white/10 transition-all duration-700 w-full sm:w-auto backdrop-blur-sm">
              Descubrir Mangata
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-zinc-500">
          <span className="text-[9px] uppercase tracking-[0.4em] font-light">Deslizar</span>
          <div className="h-12 w-[1px] bg-gradient-to-b from-amber-500 to-transparent"></div>
        </div>
      </header>

      {/* --- Seccion: Categorías y Filtros --- */}
      <section className="mx-auto max-w-7xl px-8 py-32">
        <div className="mb-24 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-4xl font-extralight tracking-tight uppercase">Nuestras <span className="text-amber-500 font-normal italic">Esencias</span></h2>
            <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] font-light">Selecciona el aura de tu próximo momento</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 bg-white/5 p-2 rounded-full border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat
                  ? "bg-white text-black shadow-xl"
                  : "text-zinc-400 hover:text-white"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* --- Grid de Velas Maestras --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="h-10 w-10 border border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 animate-pulse">Iluminando el catálogo...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-40 text-center">
            <p className="text-zinc-500 uppercase tracking-widest text-xs">No hemos encontrado velas en esta categoría celestial.</p>
          </div>
        ) : (
          <div className="grid gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group flex flex-col">
                {/* Contenedor de Imagen de Lujo */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/5 transition-all duration-700 group-hover:rounded-[3rem] group-hover:border-amber-500/30 group-hover:shadow-[0_0_80px_-20px_rgba(245,158,11,0.2)]">
                  {product.imageUrl ? (
                    <img
                      src={`http://localhost:3000${product.imageUrl}`}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-[5s] ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-700 uppercase tracking-widest text-[10px]">Sin Imagen Artística</div>
                  )}

                  {/* Etiqueta de Categoría */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-black/40 backdrop-blur-md border border-white/10 text-[8px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-amber-200/70">
                      {product.category || "Aromática"}
                    </span>
                  </div>

                  {/* Accion Rapida Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                    <button className="h-14 w-full bg-white text-black text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-amber-500 transition-colors duration-300">
                      Explorar Detalles
                    </button>
                  </div>
                </div>

                {/* Info Text */}
                <div className="mt-8 flex justify-between items-end px-2">
                  <div className="space-y-2">
                    <h3 className="text-lg font-light tracking-[0.1em] uppercase group-hover:text-amber-500 transition-colors duration-300">{product.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`h-1 w-1 rounded-full ${product.stock > 0 ? "bg-emerald-500/50" : "bg-red-500/50"}`}></span>
                      <p className="text-[10px] text-zinc-500 font-light uppercase tracking-widest">
                        {product.stock > 0 ? "Disponible en atelier" : "Agotada"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-xl font-mono font-extralight text-amber-500/80">${product.price}</p>
                    <div className="h-[1px] w-8 bg-zinc-800"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- Footer: El Reflejo de la Marca --- */}
      <footer className="mt-40 border-t border-white/5 bg-[#020202] py-32">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid gap-20 lg:grid-cols-3">
            <div className="space-y-10">
              <h3 className="text-3xl font-extralight tracking-[0.5em] uppercase">Mangata</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-light tracking-widest uppercase">
                Inspirados por el reflejo de la luna en el agua, creamos momentos de calma y luz a través de la artesanía olfativa.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500">Legal</h4>
                <ul className="space-y-3 text-[10px] uppercase tracking-widest text-zinc-500 font-light">
                  <li className="hover:text-white cursor-pointer transition-colors">Envíos</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Términos</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Privacidad</li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500">Mangata</h4>
                <ul className="space-y-3 text-[10px] uppercase tracking-widest text-zinc-500 font-light">
                  <li className="hover:text-white cursor-pointer transition-colors">Historia</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Atelier</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Contacto</li>
                </ul>
              </div>
            </div>
            <div className="space-y-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500">Boletín Celestial</h4>
              <div className="relative border-b border-zinc-800 flex items-center">
                <input type="text" placeholder="Correo electrónico" className="w-full bg-transparent py-4 text-xs font-light outline-none border-none placeholder:text-zinc-800" />
                <button className="text-[10px] font-bold uppercase tracking-widest text-white">Unirse</button>
              </div>
            </div>
          </div>
          <div className="mt-40 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 pt-10 opacity-20">
            <p className="text-[9px] uppercase tracking-[0.4em] text-zinc-500">© 2026 Mangata Candles Limited</p>
            <div className="flex gap-10 text-[9px] uppercase tracking-[0.4em] text-zinc-500">
              <span>Instagram</span>
              <span>Pinterest</span>
            </div>
          </div>
        </div>
      </footer>

      {/* --- Animaciones Globales Personalizadas --- */}
      <style jsx global>{`
        @keyframes ken-burns {
          0% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.1) translateY(-10px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes width-grow {
          0% { width: 0; }
          100% { width: 80px; }
        }
        .animate-ken-burns {
          animation: ken-burns 30s ease-in-out infinite;
        }
        .animate-width-grow {
          animation: width-grow 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
