import Image from "next/image";
import Link from "next/link";

export const CategoryCard = ({ name, imgUrl, itemCount = "Featured" }) => {
    return (
        <Link href={`/search?categories=["${name}"]`}>
            <a className="group relative w-full h-48 sm:h-56 rounded-3xl overflow-hidden block shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1.5 border border-slate-200/80 bg-slate-100">
                <Image
                    src={imgUrl}
                    layout="fill"
                    objectFit="cover"
                    alt={name}
                    className="transition-transform duration-700 ease-out group-hover:scale-110"
                />
                
                {/* Gradient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                {/* Floating Category Pill & Meta */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-col items-center justify-end text-center">
                    <span className="w-full py-2 px-3 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-extrabold rounded-2xl shadow-md group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                        {name}
                    </span>
                    <span className="text-[10px] font-semibold text-white/90 mt-1 drop-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Explore Collection →
                    </span>
                </div>
            </a>
        </Link>
    );
};