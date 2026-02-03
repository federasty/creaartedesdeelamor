'use client';

interface NavbarProps {
    onCartClick: () => void;
    cartItemsCount: number;
}

export default function PremiumNavbar({ onCartClick, cartItemsCount }: NavbarProps) {
    return (
        <nav className="fixed top-0 z-50 w-full">
            {/* Glassmorphic Container with Gradient Border */}
            <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-spiritual-purple/20 via-transparent to-spiritual-purple/20 p-[1px] rounded-2xl">
                    <div className="h-full w-full bg-black/40 backdrop-blur-2xl rounded-2xl"></div>
                </div>

                {/* Floating Glow Effect */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-spiritual-purple/10 via-spiritual-purple/5 to-spiritual-purple/10 blur-xl opacity-50"></div>

                {/* Content */}
                <div className="relative mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

                    {/* Brand Section - Mobile Only */}
                    <div className="flex items-center gap-3 cursor-pointer group lg:hidden" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        {/* Mini Logo for Mobile */}
                        <div className="relative flex-shrink-0">
                            {/* Animated Glow Ring - Same as Desktop */}
                            <div className="absolute -inset-2 bg-spiritual-purple/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                            <div className="absolute inset-0 border border-spiritual-purple/0 group-hover:border-spiritual-purple/50 rounded-full transition-all duration-500"></div>

                            {/* Logo Container - Enhanced Effects */}
                            <div className="relative h-12 w-12 p-[1px] rounded-full bg-gradient-to-tr from-spiritual-purple via-white to-spiritual-purple shadow-[0_0_30px_rgba(167,139,250,0.5)] group-hover:shadow-[0_0_45px_rgba(167,139,250,0.8)] transition-all duration-500 overflow-hidden">
                                <img
                                    src="/logo-spiritual.png"
                                    alt="Crea Arte desde el Amor"
                                    className="h-full w-full object-cover rounded-full relative z-10 scale-[1.15] transition-all duration-500 group-hover:scale-[1.25]"
                                />
                                {/* Internal Masking Rings - Same as Desktop */}
                                <div className="absolute inset-0 rounded-full border-[3px] border-white/30 z-20 pointer-events-none"></div>
                                <div className="absolute inset-0 rounded-full border-2 border-spiritual-purple/20 z-30 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Brand Text - Enhanced Effects */}
                        <div className="relative flex items-center">
                            {/* Sacred Geometry Background - Enhanced */}
                            <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                                <div className="absolute inset-0 bg-spiritual-purple/8 blur-2xl rounded-full"></div>
                                {/* Subtle Pulsing Ring */}
                                <div className="absolute inset-0 border border-spiritual-purple/20 rounded-full animate-pulse"></div>
                            </div>

                            {/* Text Content */}
                            <div className="relative flex flex-col justify-center">
                                {/* Main Brand Name - Premium Effects */}
                                <h1 className="text-[10px] sm:text-[11px] font-serif font-light tracking-[0.15em] sm:tracking-[0.2em] uppercase leading-none relative">
                                    {/* First Line - Crea Arte */}
                                    <span className="relative inline-block">
                                        <span className="bg-gradient-to-r from-white via-spiritual-purple/90 to-white bg-clip-text text-transparent group-hover:from-spiritual-purple group-hover:via-white group-hover:to-spiritual-purple transition-all duration-1000 drop-shadow-[0_0_8px_rgba(167,139,250,0.3)]">
                                            Crea Arte
                                        </span>
                                        {/* Subtle Glow Behind Text */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-spiritual-purple/20 to-transparent blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
                                    </span>
                                    <br />
                                    {/* Second Line - Desde el Amor */}
                                    <span className="relative inline-block mt-0.5">
                                        <span className="bg-gradient-to-r from-white via-spiritual-purple/90 to-white bg-clip-text text-transparent group-hover:from-spiritual-purple group-hover:via-white group-hover:to-spiritual-purple transition-all duration-1000 drop-shadow-[0_0_8px_rgba(167,139,250,0.3)]" style={{ transitionDelay: '100ms' }}>
                                            Desde el Amor
                                        </span>
                                        {/* Subtle Glow Behind Text */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-spiritual-purple/20 to-transparent blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ transitionDelay: '100ms' }}></span>
                                    </span>

                                    {/* Zen Underline - Appears on Hover */}
                                    <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-spiritual-purple/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 scale-x-0 group-hover:scale-x-100"></div>
                                </h1>

                                {/* Om Symbol - Enhanced */}
                                <div className="absolute -right-5 top-1/2 -translate-y-1/2 text-spiritual-purple/10 group-hover:text-spiritual-purple/40 transition-all duration-700 text-[11px] group-hover:scale-110 drop-shadow-[0_0_4px_rgba(167,139,250,0.2)]">
                                    ॐ
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Logo Section - Hidden on Mobile */}
                    <div className="hidden lg:flex items-center gap-4 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="relative">
                            {/* Animated Glow Ring */}
                            <div className="absolute -inset-2 bg-spiritual-purple/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                            <div className="absolute inset-0 border border-spiritual-purple/0 group-hover:border-spiritual-purple/50 rounded-full transition-all duration-500"></div>

                            {/* Logo with Masking Border & Scaling to crop black source edges */}
                            <div className="relative h-16 w-16 p-[1px] rounded-full bg-gradient-to-tr from-spiritual-purple via-white to-spiritual-purple shadow-[0_0_30px_rgba(167,139,250,0.5)] group-hover:shadow-[0_0_45px_rgba(167,139,250,0.8)] transition-all duration-500 overflow-hidden">
                                <img
                                    src="/logo-spiritual.png"
                                    alt="Crea Arte desde el Amor"
                                    className="h-full w-full object-cover rounded-full relative z-10 scale-[1.15] transition-all duration-500 group-hover:scale-[1.25]"
                                />
                                {/* Internal Masking Ring - This overlaps the image edges to hide the black line */}
                                <div className="absolute inset-0 rounded-full border-[4px] border-white/30 z-20 pointer-events-none"></div>
                                <div className="absolute inset-0 rounded-full border-2 border-spiritual-purple/20 z-30 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Brand Name with Gradient */}
                        <div>
                            <h1 className="text-sm font-serif font-light tracking-[0.3em] uppercase bg-gradient-to-r from-white via-white to-spiritual-purple/80 bg-clip-text text-transparent group-hover:from-spiritual-purple group-hover:via-white group-hover:to-spiritual-purple transition-all duration-700">
                                Crea Arte Desde el Amor
                            </h1>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="hidden md:flex items-center gap-2">
                        {[
                            { label: 'Nosotros', target: 'about' },
                            { label: 'Tienda', target: 'shop' }
                        ].map((item, index) => (
                            <button
                                key={index}
                                onClick={() => document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth' })}
                                className="group relative px-6 py-2.5 overflow-hidden rounded-full transition-all duration-300"
                            >
                                {/* Hover Background */}
                                <div className="absolute inset-0 bg-spiritual-purple/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"></div>
                                <div className="absolute inset-0 border border-transparent group-hover:border-spiritual-purple/30 rounded-full transition-all duration-300"></div>

                                {/* Text */}
                                <span className="relative text-[10px] uppercase tracking-[0.4em] text-zinc-400 group-hover:text-white transition-colors duration-300 font-medium">
                                    {item.label}
                                </span>

                                {/* Underline Effect */}
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-gradient-to-r from-transparent via-spiritual-purple to-transparent group-hover:w-3/4 transition-all duration-500"></div>
                            </button>
                        ))}
                    </div>

                    {/* Cart Button - Premium Design */}
                    <button
                        onClick={onCartClick}
                        className="group relative"
                    >
                        {/* Glow Effect */}
                        <div className="absolute -inset-3 bg-spiritual-purple/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Button Container */}
                        <div className="relative flex items-center gap-3 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm group-hover:border-spiritual-purple/40 group-hover:bg-spiritual-purple/10 transition-all duration-300">

                            {/* Cart Icon */}
                            <svg className="h-6 w-6 text-zinc-300 group-hover:text-spiritual-purple transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>

                            {/* Item Count Badge */}
                            {cartItemsCount > 0 && (
                                <div className="relative">
                                    <div className="absolute inset-0 bg-spiritual-purple blur-md animate-pulse"></div>
                                    <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-spiritual-purple to-spiritual-pink text-[10px] font-bold text-white shadow-lg">
                                        {cartItemsCount}
                                    </span>
                                </div>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </nav>
    );
}
