export const Radio = ({ onChange, label, name, checked }) => {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer select-none py-1 group">
            <input 
                type="radio" 
                value={label} 
                name={name} 
                checked={checked}
                onChange={onChange} 
                className="w-4 h-4 text-neutral-950 bg-white rounded-full border-neutral-400 focus:ring-neutral-900 focus:ring-2 cursor-pointer transition accent-neutral-950" 
            />
            <span className="text-xs font-bold text-neutral-800 group-hover:text-neutral-950 transition">{label}</span>
        </label>
    );
};