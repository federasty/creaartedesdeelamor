"use client";

export default function SalesPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="space-y-3">
                <h1 className="text-4xl font-light tracking-tight text-zinc-900 dark:text-zinc-50">
                    Registro de <span className="text-amber-500 italic">Ventas</span>
                </h1>
                <p className="text-zinc-500 font-light max-w-lg">Seguimiento de pedidos y transacciones del atelier.</p>
            </div>

            <div className="flex flex-col items-center justify-center py-40 bg-white/50 dark:bg-zinc-900/50 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 border-dashed">
                <div className="mb-6 rounded-full bg-amber-500/5 p-6 text-amber-500/30">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold">Módulo en Desarrollo</p>
                <p className="mt-2 text-sm text-zinc-500 font-light">Pronto podrás visualizar aquí el rendimiento comercial de Mangata.</p>
            </div>
        </div>
    );
}
