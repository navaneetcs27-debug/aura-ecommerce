import clsx from 'clsx';

const pageNumberStyle = {
    current: "z-10 bg-black border-black text-white font-black",
    default: "bg-white border-neutral-300 text-black font-black hover:bg-neutral-100 hover:text-black"
};

const defaultPageNumberStyle = 
    "relative inline-flex items-center border-r px-4 py-2 text-xs font-black transition focus:z-20";

const Btn = ({ pageIndex, onClick, currentPage }) => {
    return (
        <button 
            type="button"
            onClick={() => onClick(pageIndex)} 
            className={clsx(pageIndex == currentPage ? pageNumberStyle.current : pageNumberStyle.default, defaultPageNumberStyle)}
        >
            {pageIndex}
        </button>
    );
};

export const Pagination = ({ pagesTotal, isExpanded, currentPage, onClickPage }) => {
    if (isExpanded) {
        return (
            <>
                {
                    [...Array(pagesTotal)].map((_, index) => {
                        return (
                            <Btn key={index} pageIndex={index + 1} currentPage={currentPage} onClick={onClickPage} />
                        );
                    })
                }
            </>
        );
    } else {
        return (
            <>
                <Btn key="1" pageIndex={1} currentPage={currentPage} onClick={onClickPage}>1</Btn>
                {currentPage > 2 && <span className="relative inline-flex items-center border-r border-neutral-300 bg-white px-3 py-2 text-xs font-black text-black">...</span>}
                {
                    [...Array(currentPage - 1, currentPage, currentPage + 1)].filter(i => ![...Array(0,1,pagesTotal)].includes(i)).map((page) => {
                        return (
                            <Btn key={page} pageIndex={page} currentPage={currentPage} onClick={onClickPage} />
                        );
                    })
                }
                {(pagesTotal - currentPage) > 2 && <span className="relative inline-flex items-center border-r border-neutral-300 bg-white px-3 py-2 text-xs font-black text-black">...</span>}
                {pagesTotal > 1 && <Btn key={pagesTotal} pageIndex={pagesTotal} currentPage={currentPage} onClick={onClickPage}>{pagesTotal}</Btn>}
            </>
        );
    }
};