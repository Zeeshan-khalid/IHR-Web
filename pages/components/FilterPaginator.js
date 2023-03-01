import React from 'react';

const FilterPaginator = ({ currentPage, totalPageCount, changePage }) => {

  const GenerateItem = ({ page, currentPage, key }) => {
    return (
      <button
        key={key}
        className={`btn btn-xs ${page === currentPage ? 'text-white bg-primary' : 'text-black bg-base-200'}`}
        onClick={() => {
          if (page !== currentPage) {
            if (typeof changePage === 'function') {
              changePage(page);
            }
          }
        }}
      >
        {page + 1}
      </button>
    );
  };

  const GeneratePaginator = () => {
    let i = 0;
    let paginator = [];

    do {
      paginator.push(<GenerateItem page={i} currentPage={currentPage} key={i} />)
      i = i + 1;
    } while (i < totalPageCount);

    return paginator;
  }

  return (<GeneratePaginator />);
}

export default FilterPaginator;
