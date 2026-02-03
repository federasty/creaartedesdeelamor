"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error al iniciar sesión");
            }

            // Guardar token en localStorage
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user || { username }));

            // Redirigir al dashboard
            router.push("/");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col lg:flex-row bg-spiritual-dark overflow-hidden font-sans">

            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 opacity-20 blur-[100px] scale-150 rotate-12"
                    style={{
                        backgroundImage: "url('/logo-spiritual.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                ></div>
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Seccion Izquierda: Experiencia de Marca */}
            <div className="relative z-10 hidden lg:flex lg:w-[65%] items-center justify-center p-12 border-r border-white/5">
                <div className="flex flex-col items-center w-full max-w-4xl">
                    <div className="relative group/title mb-16 flex flex-col items-center justify-center w-full">
                        <h1 className="text-4xl font-extralight tracking-[0.6em] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-spiritual-purple/30 uppercase relative z-10 animate-shimmer text-center">
                            Crea Arte Desde el Amor
                        </h1>
                        {/* Reflejo estilo agua - Refinado */}
                        <h1 className="absolute top-[90%] w-full text-4xl font-extralight tracking-[0.6em] text-white/[0.02] uppercase blur-[2px] scale-y-[-0.5] origin-top select-none pointer-events-none text-center">
                            Crea Arte Desde el Amor
                        </h1>
                    </div>

                    {/* El Div con la Imagen (La protagonista - AHORA MÁS GRANDE) */}
                    <div className="relative group mb-12 w-full flex justify-center px-4">
                        <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-b from-spiritual-purple/20 to-transparent blur-[100px] opacity-60 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative overflow-hidden rounded-[40px] border border-white/10 shadow-[0_0_120px_-30px_rgba(167,139,250,0.4)] bg-zinc-900/50">
                            <img
                                src="/logo-spiritual.png"
                                alt="Crea Arte Desde el Amor"
                                className="w-full max-w-[750px] aspect-[4/5] lg:aspect-auto object-cover scale-100 group-hover:scale-105 transition duration-[10s] ease-out"
                            />

                            {/* Overlay de luz sobre la imagen */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                        </div>
                    </div>

                    <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-spiritual-purple/40 to-transparent mb-10 opacity-50"></div>
                </div>
            </div>

            {/* Seccion Derecha: Formulario Elite */}
            <div className="relative z-10 flex flex-1 items-center justify-center px-8 lg:px-20 py-24">
                <div className="w-full max-w-sm space-y-16">

                    <div className="flex flex-col items-center lg:items-start space-y-4">
                        {/* Logo movil con imagen MUCHO más grande y destacada */}
                        <div className="lg:hidden relative mb-12 flex flex-col items-center w-full">
                            <div className="relative group">
                                {/* Resplandor detrás de la imagen móvil */}
                                <div className="absolute -inset-4 rounded-full bg-spiritual-purple/20 blur-2xl"></div>
                                <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-spiritual-purple/40 shadow-[0_0_40px_rgba(167,139,250,0.6)]">
                                    <img src="/logo-spiritual.png" alt="Logo Crea Arte Desde el Amor" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="relative flex flex-col items-center mt-12">
                                <h1 className="text-2xl font-extralight tracking-[0.5em] text-transparent bg-clip-text bg-gradient-to-b from-white to-spiritual-purple/50 uppercase text-center animate-shimmer">
                                    Crea Arte Desde el Amor
                                </h1>
                                <div className="mt-4 w-8 h-[0.5px] bg-spiritual-purple/20"></div>
                            </div>
                        </div>

                        <h2 className="text-5xl font-extralight text-white tracking-tight hidden lg:block">
                            Ingreso <span className="text-spiritual-purple">Privado</span>
                        </h2>
                        <p className="text-zinc-500 text-sm font-light tracking-widest uppercase">
                            Confirmación de administrador
                        </p>
                    </div>

                    <form className="space-y-10" onSubmit={handleLogin}>
                        {error && (
                            <div className="animate-in fade-in zoom-in-95 border border-spiritual-purple/50 bg-spiritual-purple/10 p-5 text-xs text-spiritual-purple tracking-wider">
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-spiritual-purple shadow-[0_0_8px_rgba(167,139,250,1)]"></div>
                                    {error}
                                </div>
                            </div>
                        )}

                        <div className="space-y-8">
                            <div className="group space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 transition-colors group-focus-within:text-amber-400">
                                    Nombre de Usuario
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full border-b-[0.5px] border-zinc-800 bg-transparent py-4 text-zinc-100 outline-none transition-all placeholder:text-zinc-800 focus:border-spiritual-purple focus:shadow-[0_4px_20px_-10px_rgba(167,139,250,0.2)]"
                                    placeholder="Administrador"
                                />
                            </div>

                            <div className="group space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 transition-colors group-focus-within:text-amber-400">
                                        Contraseña de Acceso
                                    </label>
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border-b-[0.5px] border-zinc-800 bg-transparent py-4 text-zinc-100 outline-none transition-all placeholder:text-zinc-800 focus:border-spiritual-purple focus:shadow-[0_4px_20px_-10px_rgba(167,139,250,0.2)]"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative h-16 w-full flex items-center justify-center overflow-hidden border border-zinc-700 bg-transparent transition-all hover:border-spiritual-purple"
                            >
                                <div className="absolute inset-0 z-0 translate-y-full bg-spiritual-purple transition-transform duration-500 ease-out group-hover:translate-y-0"></div>
                                <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.4em] text-white transition-colors duration-500 group-hover:text-black">
                                    {loading ? "Verificando..." : "Validar Accesos"}
                                </span>

                                {/* Micro-luz en el boton */}
                                <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_60%)]"></div>
                            </button>
                        </div>
                    </form>

                    <footer className="pt-20 flex flex-col space-y-6 opacity-30">
                        <div className="flex items-center gap-4">
                            <span className="h-[1px] flex-1 bg-zinc-800 text-title"></span>
                            <span className="text-[9px] font-light uppercase tracking-[0.5em] text-zinc-500">Crea Arte desde el Amor Core</span>
                            <span className="h-[1px] flex-1 bg-zinc-800"></span>
                        </div>
                        <p className="text-center text-[8px] uppercase tracking-[0.3em] text-zinc-600">
                            Sistema de Seguridad Encriptada v2.4.0
                        </p>
                    </footer>
                </div>
            </div>

            <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 20s ease-in-out infinite;
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 12s linear infinite;
        }
        .font-sans {
          font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
        }
      `}</style>
        </div >
    );
}
