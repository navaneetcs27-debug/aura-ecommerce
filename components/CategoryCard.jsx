import Image from "next/image";
import Link from "next/link";

export const CategoryCard = ({ name, imgUrl }) => {
    return (
        <Link href={`/search?categories=["${name}"]`}>
            <a className="group relative w-full h-52 sm:h-60 rounded-2xl overflow-hidden block shadow-xs hover:shadow-xl transition-all duration-500 border border-neutral-200/90 bg-neutral-100">
                <Image
                    src={imgUrl}
                    layout="fill"
                    objectFit="cover"
                    alt={name}
                    className="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Minimalist Editorial Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300" />

                {/* Category Meta */}
                <div className="absolute bottom-4 left-3 right-3 flex flex-col items-center justify-end text-center space-y-0.5">
                    <span className="text-white text-xs sm:text-sm font-bold tracking-wider uppercase drop-shadow-sm">
                        {name}
                    </span>
                    <span className="text-[10px] text-neutral-300 font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View Collection →
                    </span>
                </div>
            </a>
        </Link>
    );
};