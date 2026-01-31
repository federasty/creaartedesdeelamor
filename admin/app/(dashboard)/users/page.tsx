"use client";

export default function UsersPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="space-y-3">
                <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-zinc-50">
                    Gestión de <span className="text-amber-500 italic">Administradores</span>
                </h1>
                <p className="text-zinc-500 font-light max-w-lg">Control de accesos y perfiles autorizados para operar el panel.</p>
            </div>

            <div className="flex flex-col items-center justify-center py-40 bg-white/50 dark:bg-zinc-900/50 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 border-dashed">
                <div className="mb-6 rounded-full bg-amber-500/5 p-6 text-amber-500/30">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold">Módulo en Desarrollo</p>
                <p className="mt-2 text-sm text-zinc-500 font-light">Aquí podrás gestionar los permisos de tu equipo creativo.</p>
            </div>
        </div>
    );
}
