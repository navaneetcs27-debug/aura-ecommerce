import Image from "next/image";
import Link from "next/link";

export const CategoryCard = ({ name, subtitle, count, imgUrl, categoryKey }) => {
    return (
        <Link href={`/search?categories=["${categoryKey || name}"]`}>
            <a className="group relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden block shadow-xs hover:shadow-xl transition-all duration-500 border border-neutral-200/90 bg-neutral-100">
                <Image
                    src={imgUrl}
                    layout="fill"
                    objectFit="cover"
                    alt={name}
                    className="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Minimalist Editorial Shadow Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-300" />

                {/* Top Badge: Item count */}
                {count && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase text-neutral-900 border border-white/60">
                        {count} Pieces
                    </div>
                )}

                {/* Category Meta & Action */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col space-y-1">
                    <span className="text-[10px] font-semibold text-neutral-300 uppercase tracking-widest">
                        {subtitle || "Atelier Line"}
                    </span>
                    <div className="flex items-center justify-between">
                        <span className="text-white text-sm sm:text-base font-bold tracking-wide">
                            {name}
                        </span>
                        <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs group-hover:bg-white group-hover:text-neutral-900 transition-colors duration-200">
                            →
                        </span>
                    </div>
                </div>
            </a>
        </Link>
    );
};