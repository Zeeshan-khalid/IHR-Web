import Image from "next/image";
import Link from "next/link";

const Receipts = (props) => {

  return (
    <div className="card w-12/12 bg-base-100 w-full mtl">
      <div className="card-body">
        <h1 className="card-title justify-between">
          <div className="">
            <span className="text-2xl">Receipts </span>
            <span
              className="tooltip tooltip-right align-super text-sm"
              data-tip="Tap on a receipt to see the full details."
            >
              &#9432;
            </span>
          </div>
          <div className="card-actions custom-size">
            <label
              htmlFor="receipt"
              className="modal-button text-sm cursor-pointer recipt"
            >
              <Image
                alt=""
                loading="eager"
                width="22"
                height="22"
                src="/images/viewall.png"
              />
            </label>
            <Link href={"/receiptdetails"} className="cursor-pointer">
              <label className="text-base cursor-pointer">View All</label>
            </Link>
          </div>
        </h1>

        <input type="checkbox" id="receipt" className="modal-toggle" />

        <label htmlFor="receipt" className="modal cursor-pointer">
          <label
            className="modal-box relative h-full w-11/12 max-w-7xl mt-[100px]"
            htmlFor=""
          >
            <label
              htmlFor="receipt"
              className="zeecss modal-button btn btn-circle btn-sm absolute right-2 top-5"
            >
              ✕
            </label>

            <h1 className="text-2xl font-bold">
              Receipts
              <span
                className="tooltip tooltip-right align-super text-sm"
                data-tip="Tap on a receipt to see the full details."
              >
                &#9432;
              </span>
              <Link href={"/receiptdetails"} className="cursor-pointer">
                <a className="float-right text-lg mr-[40px] text-[#6B30E4] font-normal">
                  See all
                </a>
              </Link>
            </h1>

            <div className="overflow-x-auto text-left">
              <div className="mt-4 receipts">
                <div className="grid grid-cols-3 gap-4">
                  {props.receipt?.slice(0, 6).map(function (receipt, id) {
                    return (
                      <div className="card bg-base-100" key={id}>
                        <Link href={`/${receipt.id}`}>
                          <div>
                            <div className="flex mb-4">
                              {receipt.merchant.name == "Walmart" ? (
                                <div className="receiptimg">
                                  <Image
                                    alt=""
                                    loading="eager"
                                    width="65"
                                    height="65"
                                    objectFit="contain"
                                    src="/images/walmart.png"
                                  />
                                </div>
                              ) : receipt.merchant.name == "Tim Hortons" ? (
                                <div className="receiptimg">
                                  <Image
                                    alt=""
                                    loading="eager"
                                    width="65"
                                    height="65"
                                    objectFit="contain"
                                    src="/images/timhortons.png"
                                  />
                                </div>
                              ) : receipt.merchant.name == "Roy Rogers" ? (
                                <div className="receiptimg">
                                  <Image
                                    alt=""
                                    loading="eager"
                                    width="65"
                                    height="65"
                                    objectFit="contain"
                                    src="/images/roy-rogers.png"
                                  />
                                </div>
                              ) : receipt.merchant.name == "Starbucks" ? (
                                <div className="receiptimg text-lg">
                                  <Image
                                    alt=""
                                    loading="eager"
                                    width="65"
                                    height="65"
                                    objectFit="contain"
                                    src="/images/starbucks.png"
                                  />
                                </div>
                              ) : (
                                <div className="receiptimg">
                                  <Image
                                    alt=""
                                    loading="eager"
                                    width="65"
                                    height="65"
                                    src="/images/noimage.jpg"
                                  />
                                </div>
                              )}

                              <div className="ml-4">
                                {receipt.merchant.name ? (
                                  <h3 className="font-bold text-lg">
                                    {receipt.merchant.name}
                                  </h3>
                                ) : (
                                  <h3 className="font-bold text-lg">Unknown</h3>
                                )}
                                <p className="text-xs opacity-70 font-semibold">
                                  {receipt.createdDate
                                    .slice(0, 16)
                                    .replace("T", ", ")}
                                </p>
                                {receipt.tags ? (
                                  <div className="truncate">
                                    {receipt.tags
                                      .slice(0, 3)
                                      .map((data, id) => {
                                        return (
                                          <div
                                            className="badge badge-outline badge-lg mr-2 mt-1 text-xs custom-border"
                                            key={id}
                                          >
                                            <p>#{data}</p>
                                          </div>
                                        );
                                      })}
                                    {receipt.tags.length > 3 ? (
                                      <label>...</label>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                            <hr />
                            <div className="min-h-[300px]">
                              {receipt?.lineItems?.length > 0 ? (
                                receipt?.lineItems
                                  .slice(0, 3)
                                  .map(function (lineItems, id) {
                                    return (
                                      <div className="flex mt-4" key={id}>
                                        <div className="receiptimg">
                                          {lineItems.imgUrl ? (
                                            <Image
                                              alt=""
                                              loading="eager"
                                              width="65"
                                              height="65"
                                              objectFit="contain"
                                              src={lineItems.imgUrl}
                                            />
                                          ) : (
                                            <Image
                                              alt=""
                                              loading="eager"
                                              width="65"
                                              height="65"
                                              src="/images/noimage.jpg"
                                            />
                                          )}
                                        </div>
                                        <div className="ml-4 w-full">
                                          <div className="flex justify-center mt-4">
                                            <div className="w-9/12">
                                              <p className="text-sm">
                                                {lineItems.description}
                                              </p>
                                            </div>
                                            <div className="w-3/12 text-right">
                                              <p className="text-base font-bold">
                                                ${lineItems.price}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                              ) : (
                                <div>
                                  <div className="flex justify-center pt-28">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="stroke-current flex-shrink-0 h-6 w-6"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                      />
                                    </svg>
                                    <span className="ml-2">
                                      There is no data to display!
                                    </span>
                                  </div>
                                </div>
                              )}

                              {receipt?.lineItems?.length > 3 ? (
                                <div className="text-right mb-2">
                                  <p className="text-sm text-[#343434] opacity-[0.3]">
                                    +{receipt?.lineItems?.length - 3} More Items
                                  </p>
                                </div>
                              ) : (
                                <div className="text-right mb-2"></div>
                              )}
                            </div>
                            <hr />
                            <div className="w-full">
                              <div className="flex justify-center mt-4 items-center">
                                <div className="w-6/12 flex items-center">
                                  <Image
                                    alt=""
                                    loading="eager"
                                    width="30"
                                    height="20"
                                    src="/images/visa.png"
                                  />
                                  <p className="text-sm font-bold text-[#FB4F08] ml-2">
                                    2565
                                  </p>
                                </div>
                                <div className="w-6/12 text-right">
                                  <p className="text-tiny text-[#A6A6A6]">
                                    Total
                                  </p>
                                  <p className="text-2xl font-bold">
                                    $
                                    {parseFloat(
                                      receipt.transactionTotal
                                    ).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </label>
        </label>

        <div className="mt-4 receipts">
          <div className="grid grid-cols-3 gap-4">
            {props.receipt?.slice(0, 3).map(function (receipt, id) {
              return (
                <div className="card bg-base-100 border" key={id}>
                  <Link href={`/${receipt.id}`}>
                    <div>
                      <div className="flex mb-4">
                        {receipt.merchant.name == "Walmart" ? (
                          <div className="receiptimg">
                            <Image
                              alt=""
                              loading="eager"
                              width="65"
                              height="65"
                              objectFit="contain"
                              src="/images/walmart.png"
                            />
                          </div>
                        ) : receipt.merchant.name == "Tim Hortons" ? (
                          <div className="receiptimg">
                            <Image
                              alt=""
                              loading="eager"
                              width="65"
                              height="65"
                              objectFit="contain"
                              src="/images/timhortons.png"
                            />
                          </div>
                        ) : receipt.merchant.name == "Roy Rogers" ? (
                          <div className="receiptimg">
                            <Image
                              alt=""
                              loading="eager"
                              width="65"
                              objectFit="contain"
                              height="65"
                              src="/images/roy-rogers.png"
                            />
                          </div>
                        ) : receipt.merchant.name == "Starbucks" ? (
                          <div className="receiptimg">
                            <Image
                              alt=""
                              loading="eager"
                              width="65"
                              height="65"
                              objectFit="contain"
                              src="/images/starbucks.png"
                            />
                          </div>
                        ) : (
                          <div className="receiptimg">
                            <Image
                              alt=""
                              loading="eager"
                              width="65"
                              height="65"
                              src="/images/noimage.jpg"
                            />
                          </div>
                        )}

                        <div className="ml-4">
                          {receipt.merchant.name ? (
                            <h3 className="font-bold text-lg">
                              {receipt.merchant.name}
                            </h3>
                          ) : (
                            <h3 className="font-bold text-lg">Unknown</h3>
                          )}

                          {receipt.createdDate ? (
                            <p className="text-xs opacity-70 font-semibold">
                              {receipt.createdDate
                                .slice(0, 16)
                                .replace("T", ", ")}
                            </p>
                          ) : (
                            <p></p>
                          )}

                          {receipt.tags ? (
                            <div className="truncate">
                              {receipt.tags.slice(0, 3).map((data, id) => {
                                return (
                                  <div
                                    className="badge badge-outline badge-lg mr-2 mt-1 text-xs custom-border"
                                    key={id}
                                  >
                                    <p>#{data}</p>
                                  </div>
                                );
                              })}
                              {receipt.tags.length > 3 ? (
                                <label>...</label>
                              ) : (
                                <></>
                              )}
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <hr />
                      <div className="min-h-[300px]">
                        {receipt?.lineItems?.length > 0 ? (
                          <div>
                            {receipt?.lineItems
                              ?.slice(0, 3)
                              .map(function (lineItems, id) {
                                return (
                                  <div className="flex mt-4" key={id}>
                                    <div className="receiptimg">
                                      {lineItems.imgUrl ? (
                                        <Image
                                          alt=""
                                          loading="eager"
                                          width="65"
                                          height="65"
                                          objectFit="contain"
                                          src={lineItems.imgUrl}
                                        />
                                      ) : (
                                        <Image
                                          alt=""
                                          loading="eager"
                                          width="65"
                                          height="65"
                                          src="/images/noimage.jpg"
                                        />
                                      )}
                                    </div>
                                    <div className="ml-4 w-full">
                                      <div className="flex justify-center mt-4">
                                        <div className="w-9/12">
                                          <p className="text-sm">
                                            {lineItems.description}
                                          </p>
                                        </div>
                                        <div className="w-3/12 text-right">
                                          <p className="text-base font-bold">
                                            ${lineItems.price}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            {receipt?.lineItems?.length > 3 ? (
                              <div className="text-right mb-2">
                                <p className="text-[14px] text-[#343434] opacity-[0.3]">
                                  +{receipt.lineItems.length - 3} More Items
                                </p>
                              </div>
                            ) : (
                              <div></div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-center pt-28">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="stroke-current flex-shrink-0 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                              </svg>
                              <span className="ml-2">
                                There is no data to display!
                              </span>
                            </div>
                          </div>)}
                      </div>
                      <hr />
                      <div className="w-full">
                        <div className="flex justify-center mt-4 items-center">
                          <div className="w-6/12 flex items-center">
                            <Image
                              alt=""
                              loading="eager"
                              width="30"
                              height="20"
                              src="/images/visa.png"
                            />
                            <p className="text-sm font-bold text-[#FB4F08] ml-2">
                              2565
                            </p>
                          </div>
                          <div className="w-6/12 text-right">
                            <p className="text-tiny text-[#A6A6A6]">Total</p>
                            <p className="text-xl font-bold mb-3">
                              ${parseFloat(receipt.transactionTotal).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Receipts;
