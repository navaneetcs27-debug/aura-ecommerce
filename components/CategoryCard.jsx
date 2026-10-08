import Image from "next/image";
import Link from "next/link";

export const CategoryCard = ({ name, subtitle, count, imgUrl, categoryKey }) => {
    return (
        <Link href={`/search?categories=["${categoryKey || name}"]`}>
            <a className="group relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden block shadow-sm hover:shadow-xl transition-all duration-500 border border-[#dfdcd3] bg-neutral-200">
                <Image
                    src={imgUrl}
                    layout="fill"
                    objectFit="cover"
                    alt={name}
                    className="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* High-Contrast Editorial Shadow Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300" />

                {/* Top Badge: Item count */}
                {count && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest uppercase text-black border border-neutral-300 shadow-xs">
                        {count} Pieces
                    </div>
                )}

                {/* Category Meta & Action */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col space-y-1">
                    <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-widest drop-shadow-xs">
                        {subtitle || "Atelier Line"}
                    </span>
                    <div className="flex items-center justify-between">
                        <span className="text-white text-base sm:text-lg font-black tracking-wide drop-shadow-sm">
                            {name}
                        </span>
                        <span className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-xs font-black group-hover:bg-black group-hover:text-white transition-colors duration-200 shadow-xs">
                            →
                        </span>
                    </div>
                </div>
            </a>
        </Link>
    );
};