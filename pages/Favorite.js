import { useState } from 'react';
import Image from 'next/image';

const Favorite = () => {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div className="card w-6/12">
      <div className="card-body bg-base-100 mtl">
        <h1 className="card-title justify-between">
          <div className="">
            <span className="text-2xl">Favorites</span>
            <span
              className="tooltip tooltip-right align-super text-sm"
              data-tip="Select you favorite item."
            >
              &#9432;
            </span>
            <em className="text-[#919191] text-xs capitalize font-semibold"> &nbsp; Future</em>
          </div>
          <div className="card-actions">
            <label htmlFor="favorite" className="modal-button text-base">
              View All
            </label>
          </div>
        </h1>

        <input type="checkbox" id="favorites" className="modal-toggle" />

        <label htmlFor="favorites" className="modal cursor-pointer">
          <label
            className="modal-box relative h-full w-11/12 max-w-7xl"
            htmlFor=""
          >
            <label
              htmlFor="favorites"
              className="modal-button btn btn-circle btn-sm absolute right-2 top-2"
            >
              ✕
            </label>

            <h1 className="text-2xl font-bold">
              Favorites
              <span
                className="tooltip tooltip-right align-super text-sm"
                data-tip="Select your favorite item to search."
              >
                &#9432;
              </span>
            </h1>
            <div className="relative my-4 w-full">
              <span className="absolute z-10 h-full w-8 items-center justify-center rounded py-3 pl-3 text-center text-slate-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search..."
                className="relative w-full rounded border bg-white px-3 py-3 pl-10 text-lg placeholder-slate-300 outline-none focus:outline-none focus:ring"
              />
            </div>

            <div className="overflow-x-auto text-center">
              <div className="merchant"></div>
            </div>
          </label>
        </label>
        <div className="truncate merchant">
          <div className="container">
            <div className="bloc-tabs">
              <button
                className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                onClick={() => toggleTab(1)}
              >
                Items
              </button>
              <button
                className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                onClick={() => toggleTab(2)}
              >
                Merchants
              </button>
              <button
                className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
                onClick={() => toggleTab(3)}
              >
                Receipts
              </button>
            </div>

            <div className="content-tabs">
              <div
                className={
                  toggleState === 1 ? "content  active-content" : "content"
                }
              >
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="card w-[185px] rounded-[6px] border bg-base-100 mt-3 shadow-sm">
                      <figure className="rounded-[6px]">
                        <Image
                          alt=""
                          loading="eager"
                          width="200"
                          height="125"
                          src="/images/shirt.svg"
                        />
                      </figure>
                      <div className="card-body ml-2 p-1">
                        <h2 className="card-title text-sm font-normal">
                          T-Shirt
                        </h2>
                        <div className="card-actions justify-start mt-4">
                          <h2 className="card-title text-2xl font-bold">
                            $30.00
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="card w-[185px] rounded-[6px] border bg-base-100 mt-3 shadow-sm">
                      <figure className="rounded-[6px]">
                        <Image
                          alt=""
                          loading="eager"
                          width="200"
                          height="125"
                          src="/images/shirt.svg"
                        />
                      </figure>
                      <div className="card-body ml-2 p-1">
                        <h2 className="card-title text-sm font-normal">
                          T-Shirt
                        </h2>
                        <div className="card-actions justify-start mt-4">
                          <h2 className="card-title text-2xl font-bold">
                            $30.00
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="card w-[185px] rounded-[6px] border bg-base-100 mt-3 shadow-sm">
                      <figure className="rounded-[6px]">
                        <Image
                          alt=""
                          loading="eager"
                          width="200"
                          height="125"
                          src="/images/shirt.svg"
                        />
                      </figure>
                      <div className="card-body ml-2 p-1">
                        <h2 className="card-title text-sm font-normal">
                          T-Shirt
                        </h2>
                        <div className="card-actions justify-start mt-4">
                          <h2 className="card-title text-2xl font-bold">
                            $30.00
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="card w-[185px] rounded-[6px] border bg-base-100 mt-3 shadow-sm">
                      <figure className="rounded-[6px]">
                        <Image
                          alt=""
                          loading="eager"
                          width="200"
                          height="125"
                          src="/images/shirt.svg"
                        />
                      </figure>
                      <div className="card-body ml-2 p-1">
                        <h2 className="card-title text-sm font-normal">
                          T-Shirt
                        </h2>
                        <div className="card-actions justify-start mt-4">
                          <h2 className="card-title text-2xl font-bold">
                            $30.00
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="card w-[185px] rounded-[6px] border bg-base-100 mt-3 shadow-sm">
                      <figure className="rounded-[6px]">
                        <Image
                          alt=""
                          loading="eager"
                          width="200"
                          height="125"
                          src="/images/shirt.svg"
                        />
                      </figure>
                      <div className="card-body ml-2 p-1">
                        <h2 className="card-title text-sm font-normal">
                          T-Shirt
                        </h2>
                        <div className="card-actions justify-start mt-4">
                          <h2 className="card-title text-2xl font-bold">
                            $30.00
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="card w-[185px] rounded-[6px] border bg-base-100 mt-3 shadow-sm">
                      <figure className="rounded-[6px]">
                        <Image
                          alt=""
                          loading="eager"
                          width="200"
                          height="125"
                          src="/images/shirt.svg"
                        />
                      </figure>
                      <div className="card-body ml-2 p-1">
                        <h2 className="card-title text-sm font-normal">
                          T-Shirt
                        </h2>
                        <div className="card-actions justify-start mt-4">
                          <h2 className="card-title text-2xl font-bold">
                            $30.00
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={
                  toggleState === 2 ? "content  active-content" : "content"
                }
              >
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="card w-[185px] rounded-[6px] border bg-base-100 mt-3 shadow-sm">
                      <figure className="rounded-[6px]">
                        <Image
                          alt=""
                          loading="eager"
                          width="200"
                          height="125"
                          src="/images/shirt.svg"
                        />
                      </figure>
                      <div className="card-body ml-2 p-1">
                        <h2 className="card-title text-sm font-normal">
                          T-Shirt
                        </h2>
                        <div className="card-actions justify-start mt-4">
                          <h2 className="card-title text-2xl font-bold">
                            $30.00
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="card w-[185px] rounded-[6px] border bg-base-100 mt-3 shadow-sm">
                      <figure className="rounded-[6px]">
                        <Image
                          alt=""
                          loading="eager"
                          width="200"
                          height="125"
                          src="/images/shirt.svg"
                        />
                      </figure>
                      <div className="card-body ml-2 p-1">
                        <h2 className="card-title text-sm font-normal">
                          T-Shirt
                        </h2>
                        <div className="card-actions justify-start mt-4">
                          <h2 className="card-title text-2xl font-bold">
                            $30.00
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="card w-[185px] rounded-[6px] border bg-base-100 mt-3 shadow-sm">
                      <figure className="rounded-[6px]">
                        <Image
                          alt=""
                          loading="eager"
                          width="200"
                          height="125"
                          src="/images/shirt.svg"
                        />
                      </figure>
                      <div className="card-body ml-2 p-1">
                        <h2 className="card-title text-sm font-normal">
                          T-Shirt
                        </h2>
                        <div className="card-actions justify-start mt-4">
                          <h2 className="card-title text-2xl font-bold">
                            $30.00
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="card w-[185px] rounded-[6px] border bg-base-100 mt-3 shadow-sm">
                      <figure className="rounded-[6px]">
                        <Image
                          alt=""
                          loading="eager"
                          width="200"
                          height="125"
                          src="/images/shirt.svg"
                        />
                      </figure>
                      <div className="card-body ml-2 p-1">
                        <h2 className="card-title text-sm font-normal">
                          T-Shirt
                        </h2>
                        <div className="card-actions justify-start mt-4">
                          <h2 className="card-title text-2xl font-bold">
                            $30.00
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={
                  toggleState === 3 ? "content  active-content" : "content"
                }
              >
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="card w-[185px] rounded-[6px] border bg-base-100 mt-3 shadow-sm">
                      <figure className="rounded-[6px]">
                        <Image
                          alt=""
                          loading="eager"
                          width="200"
                          height="125"
                          src="/images/shirt.svg"
                        />
                      </figure>
                      <div className="card-body ml-2 p-1">
                        <h2 className="card-title text-sm font-normal">
                          T-Shirt
                        </h2>
                        <div className="card-actions justify-start mt-4">
                          <h2 className="card-title text-2xl font-bold">
                            $30.00
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="card w-[185px] rounded-[6px] border bg-base-100 mt-3 shadow-sm">
                      <figure className="rounded-[6px]">
                        <Image
                          alt=""
                          loading="eager"
                          width="200"
                          height="125"
                          src="/images/shirt.svg"
                        />
                      </figure>
                      <div className="card-body ml-2 p-1">
                        <h2 className="card-title text-sm font-normal">
                          T-Shirt
                        </h2>
                        <div className="card-actions justify-start mt-4">
                          <h2 className="card-title text-2xl font-bold">
                            $30.00
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Favorite;
