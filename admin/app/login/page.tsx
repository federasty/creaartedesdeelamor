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

            {/* Premium Dynamic Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src="/login-bg.jpg"
                    className="h-full w-full object-cover object-right scale-100 animate-ken-burns opacity-60"
                    alt="Spiritual Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-spiritual-dark/90 via-spiritual-dark/40 to-spiritual-dark"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-spiritual-dark/80 via-transparent to-spiritual-dark/80"></div>
            </div>

            {/* Seccion Izquierda: Experiencia de Marca */}
            <div className="relative z-10 hidden lg:flex lg:w-[60%] items-center justify-center p-12 border-r border-white/5">
                <div className="flex flex-col items-center w-full max-w-4xl">
                    <div className="relative group/title mb-20 flex flex-col items-center">
                        <span className="text-[10px] font-bold uppercase tracking-[1em] text-spiritual-purple mb-4 opacity-70 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            Gestión Artística
                        </span>
                        <h1 className="text-3xl lg:text-5xl font-extralight tracking-[0.4em] text-white uppercase relative z-10 text-center leading-snug">
                            CreaArte <br />
                            <span className="font-light italic text-transparent bg-clip-text bg-gradient-to-r from-spiritual-purple via-white to-spiritual-purple animate-shimmer">Desde el Amor</span>
                        </h1>
                        <div className="mt-8 h-[1px] w-48 bg-gradient-to-r from-transparent via-spiritual-purple/30 to-transparent"></div>
                    </div>

                    {/* El Div con la Imagen (Circular como en responsive) */}
                    <div className="relative group mb-12 px-4">
                        {/* Layered glows for depth */}
                        <div className="absolute -inset-24 rounded-full bg-spiritual-purple/10 blur-[120px] opacity-40 animate-pulse-slow"></div>
                        <div className="absolute -inset-12 rounded-full bg-spiritual-purple/20 blur-[60px] opacity-60 group-hover:opacity-80 transition duration-1000"></div>

                        <div className="relative">
                            {/* The Circular Container - Matching mobile style but bigger */}
                            <div className="relative w-80 h-80 lg:w-[480px] lg:h-[480px] rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_100px_-20px_rgba(139,92,246,0.4)] transition-all duration-1000 group-hover:scale-[1.03] group-hover:shadow-[0_0_150px_-20px_rgba(139,92,246,0.6)]">
                                <img
                                    src="/logo-spiritual.png"
                                    alt="CreaArte Logo"
                                    className="w-full h-full object-cover scale-[1.18] group-hover:scale-[1.25] transition duration-[20s] ease-out"
                                />

                                {/* Professional Overlays - Matching Mobile Rings */}
                                <div className="absolute inset-0 rounded-full border-[10px] border-black/20 z-20 pointer-events-none"></div>
                                <div className="absolute inset-0 rounded-full border-2 border-spiritual-purple/20 z-30 pointer-events-none"></div>

                                {/* Subtle inner sheen */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-spiritual-dark/40 via-transparent to-white/5 pointer-events-none z-10"></div>
                            </div>

                            {/* Decorative corner light */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-spiritual-purple/20 blur-3xl rounded-full animate-pulse-slow"></div>
                        </div>
                    </div>

                    <p className="text-[9px] uppercase tracking-[0.6em] text-zinc-500 font-light mt-8">
                        Portal Exclusivo para el Administrador de la Obra
                    </p>
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
                                <div className="absolute -inset-4 rounded-full bg-spiritual-purple/15 blur-2xl"></div>
                                <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-spiritual-purple/30 shadow-[0_0_50px_rgba(139,92,246,0.5)]">
                                    <img
                                        src="/logo-spiritual.png"
                                        alt="Logo creaarte desde el amor"
                                        className="w-full h-full object-cover scale-[1.18]"
                                    />
                                    {/* Internal Masking Rings for Mobile */}
                                    <div className="absolute inset-0 rounded-full border-[6px] border-black/20 z-20 pointer-events-none"></div>
                                    <div className="absolute inset-0 rounded-full border-2 border-spiritual-purple/20 z-30 pointer-events-none"></div>
                                </div>
                            </div>
                            <div className="relative flex flex-col items-center mt-12">
                                <h1 className="text-2xl font-extralight tracking-[0.5em] text-transparent bg-clip-text bg-gradient-to-b from-white to-spiritual-purple/50 uppercase text-center animate-shimmer">
                                    creaarte desde el amor
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
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 transition-colors group-focus-within:text-spiritual-purple">
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
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 transition-colors group-focus-within:text-spiritual-purple">
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
                            <span className="text-[9px] font-light uppercase tracking-[0.5em] text-zinc-500">creaarte desde el amor Core</span>
                            <span className="h-[1px] flex-1 bg-zinc-800"></span>
                        </div>
                        <p className="text-center text-[8px] uppercase tracking-[0.3em] text-zinc-600">
                            Sistema de Seguridad Encriptada v2.4.0
                        </p>
                    </footer>
                </div>
            </div>

            <style jsx global>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-ken-burns {
          animation: ken-burns 40s ease-in-out infinite alternate;
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
