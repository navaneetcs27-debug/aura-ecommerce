import clsx from 'clsx';

const pageNumberStyle = {
    current: "z-10 bg-neutral-950 border-neutral-950 text-white font-bold",
    default: "bg-white border-neutral-200 text-neutral-800 font-bold hover:bg-neutral-100 hover:text-black"
};

const defaultPageNumberStyle = 
    "relative inline-flex items-center border-r px-4 py-2 text-xs font-bold transition focus:z-20";

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
                {currentPage > 2 && <span className="relative inline-flex items-center border-r border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-600">...</span>}
                {
                    [...Array(currentPage - 1, currentPage, currentPage + 1)].filter(i => ![...Array(0,1,pagesTotal)].includes(i)).map((page) => {
                        return (
                            <Btn key={page} pageIndex={page} currentPage={currentPage} onClick={onClickPage} />
                        );
                    })
                }
                {(pagesTotal - currentPage) > 2 && <span className="relative inline-flex items-center border-r border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-600">...</span>}
                {pagesTotal > 1 && <Btn key={pagesTotal} pageIndex={pagesTotal} currentPage={currentPage} onClick={onClickPage}>{pagesTotal}</Btn>}
            </>
        );
    }
};