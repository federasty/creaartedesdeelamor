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
                            <div className="relative h-14 w-14 p-[1px] rounded-full bg-gradient-to-tr from-spiritual-purple via-white to-spiritual-purple shadow-[0_0_30px_rgba(167,139,250,0.5)] group-hover:shadow-[0_0_45px_rgba(167,139,250,0.8)] transition-all duration-500 overflow-hidden">
                                <img
                                    src="/logo1.jpeg"
                                    alt="creaarte desde el amor"
                                    className="h-full w-full object-cover rounded-full relative z-10 scale-[1.3] transition-all duration-500 group-hover:scale-[1.4]"
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
                                <h1 className="text-[10px] sm:text-[12px] font-serif font-extralight tracking-[0.25em] sm:tracking-[0.3em] uppercase leading-relaxed relative">
                                    <span className="relative inline-block">
                                        <span className="bg-gradient-to-r from-white/90 via-spiritual-purple to-white/90 bg-[length:200%_auto] bg-clip-text text-transparent animate-text-shimmer">
                                            CREAARTE
                                        </span>
                                    </span>
                                    <br />
                                    <span className="relative inline-block mt-0.5">
                                        <span className="bg-gradient-to-r from-white/50 via-spiritual-purple/60 to-white/50 bg-[length:200%_auto] bg-clip-text text-transparent animate-text-shimmer">
                                            DESDE EL AMOR
                                        </span>
                                    </span>
                                </h1>
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
                            <div className="relative h-20 w-20 p-[1px] rounded-full bg-gradient-to-tr from-spiritual-purple via-white to-spiritual-purple shadow-[0_0_30px_rgba(167,139,250,0.5)] group-hover:shadow-[0_0_45px_rgba(167,139,250,0.8)] transition-all duration-500 overflow-hidden">
                                <img
                                    src="/logo1.jpeg"
                                    alt="creaarte desde el amor"
                                    className="h-full w-full object-cover rounded-full relative z-10 scale-[1.3] transition-all duration-500 group-hover:scale-[1.4]"
                                />
                                {/* Internal Masking Ring - This overlaps the image edges to hide the black line */}
                                <div className="absolute inset-0 rounded-full border-[4px] border-white/30 z-20 pointer-events-none"></div>
                                <div className="absolute inset-0 rounded-full border-2 border-spiritual-purple/20 z-30 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Brand Name with Gradient */}
                        <div>
                            <h1 className="text-sm font-serif font-light tracking-[0.3em] uppercase bg-gradient-to-r from-white/90 via-spiritual-purple to-white/90 bg-[length:200%_auto] bg-clip-text text-transparent animate-text-shimmer">
                                creaarte desde el amor
                            </h1>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="hidden md:flex items-center gap-2">
                        {[
                            { label: 'Colección', target: 'shop' },
                            { label: 'Nosotros', target: 'about' },
                            { label: 'Guía de Significados', target: 'rituals' }
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

                    {/* Cart Button - Circular Premium Design Matching Reference Image */}
                    <button
                        onClick={onCartClick}
                        className="group relative"
                    >
                        {/* Glow Effect */}
                        <div className="absolute -inset-3 bg-spiritual-purple/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        {/* Button Container - Circular & Highly Glassmorphic */}
                        <div className="relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl group-hover:border-spiritual-purple/30 group-hover:bg-white/10 transition-all duration-500 shadow-2xl">

                            {/* Cart Icon */}
                            <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white/70 group-hover:text-white transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>

                            {/* Item Count Badge - Refined */}
                            {cartItemsCount > 0 && (
                                <div className="absolute -top-1 -right-1">
                                    <div className="absolute inset-0 bg-spiritual-purple blur-sm animate-pulse opacity-50"></div>
                                    <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-white text-[9px] font-bold text-black shadow-lg">
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
