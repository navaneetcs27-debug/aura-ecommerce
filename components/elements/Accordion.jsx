import React, { useState } from "react";
import DownArrowIcon from "../../assets/icons/down-arrow.svg";
import UpArrowIcon from "../../assets/icons/up-arrow.svg";

export const Accordion = ({ label, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleAccordion = () => setIsOpen(prevIsOpen => !prevIsOpen);

    return (
        <div className="py-2">
            <div className="flex flex-1 justify-between items-center cursor-pointer select-none py-1" onClick={toggleAccordion}>
                <div><p className="font-extrabold text-xs uppercase tracking-wider text-neutral-950">{label}</p></div>
                <button type="button" className="p-1.5 text-neutral-800 hover:text-black transition" onClick={(e) => { e.stopPropagation(); toggleAccordion(); }} aria-label="Toggle filter section">
                    {
                        isOpen ? <UpArrowIcon height="12" width="12" /> : <DownArrowIcon height="12" width="12" />
                    }
                </button>
            </div>
            {
                isOpen && <div className="accordion-content pt-2 pb-1 space-y-2">{children}</div>
            }
        </div>
    );
};