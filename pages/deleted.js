import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import useAuthContext from "../hooks/useAuth";
import Navbar from "./navbar";
import Spinner from "./icons/Spinner";
import HashLoader from "react-spinners/HashLoader";

const Deleted = () => {
  const [data, setData] = useState([]);
  const AuthContext = useAuthContext();
  const [loading, setloading] = useState(true);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    const getReceipt = async () => {
      try {
        if (AuthContext?.encodedToken) {
          fetchData();
        }
      } catch (error) {
        console.log("SLUG: Error");
        console.log(error);
      }
    };
    getReceipt();
  }, [AuthContext?.encodedToken]);

  function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("en-US", {
      month: "short",
    });
  }

  const fetchData = async () => {
    var header = {
      headers: {
        "x-api-key": AuthContext?.apiKey,
        Authorization: "Bearer " + AuthContext?.encodedToken,
      },
    };
    const newsRes = await fetch(
      `${process.env.IHR_BASE_URL}/receipts/trash?offset=0&limit=100`,
      header
    ).then((response) => response.json());
    setData(newsRes);
    setLoader(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 1000);
  }, []);

  const update = async (id) => {
    let receipt = [];
    data.map((item) => {
      if (item.id === id) {
        receipt.push(item);
      }
    })
    new Promise((resolve) => {
      resolve(
        (receipt[0].isTrashed = true)
      );
    }).then(async () => {
      await fetch(
        `${process.env.IHR_BASE_URL}/receipts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            bundleid: "com.ihatereceipts.web",
            "x-api-key": AuthContext?.apiKey,
            Authorization: "Bearer " + AuthContext?.encodedToken,
          },
          body: JSON.stringify(receipt[0]),
        }
      )
        .then((response) => response.json())
        .catch((err) => {
          throw err;
        });
      fetchData();
    });
  };


  return (
    <>
      <Head>
        <title>Deleted receipts</title>
        <meta name="description" content="I Hate receipt" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? (
        <div className="loader">
          <HashLoader color={"#F37A24"} loading={loading} size={80} />
        </div>
      ) : (
      <main className="flex flex-col">
        <Navbar type={"delete"} route={"/"} />
        <div className="flex w-full h-[200px] justify-between mt-[100px]">
          <div className="flex flex-col ml-[50px]">
            <h1 className="text-4xl text-base-content mt-[48px] font-bold">
              Deleted Receipts
            </h1>
            <label className="text-regular">
              Receipts shown bellow will be automatically deleted forever after
              30 days.
            </label>
          </div>
        </div>

        <div className="text-left ml-[54px]">
          <div className="grid grid-cols-5 gap-4 mg-5">
            <div>
              <span className="text-sm font-bold text-[#838383]">DATE</span>
            </div>
            <div>
              <p className="bg-white text-center text-sm font-bold text-[#838383]">
                MERCHANT
              </p>
            </div>
            <div>
              <p className="bg-white text-center text-sm font-bold text-[#838383]">
                NOTE AND TAGS
              </p>
            </div>
            <div>
              <p className="bg-white text-center text-sm font-bold text-[#838383]">
                PAYMENT TYPE
              </p>
            </div>
            <div>
              <p className="bg-white text-center text-sm font-bold text-[#838383]">
                TOTAL
              </p>
            </div>
          </div>
        </div>
        {loader === true ? (
              <div className="flex w-full mt-[150px] justify-center items-center flex-col">
                <Spinner />
                <h1 className="text-lg text-base-content mt-5 mb-2">Loading...</h1>
                <h2 className="text-lg text-[#ABABAB]">Please Wait</h2>
              </div>
            ) : (
              <div className="ml-[54px] mr-[54px]">
                {data?.length > 0 || data !== undefined || data === null ? (
                  <>
                    {data?.map(function (receipt, id) {
                      return (
                        <div
                          tabIndex="0"
                          key={id}
                          className="mt-2 collapse border border-base-300 bg-base-100 rounded-box"
                        >
                          <div className="collapse-title text-xl font-medium dropcus pasdfsdf">
                            <div className="grid grid-cols-5 gap-4 mg-5">
                              <div className="text-left">
                                <div>
                                  <label className="flex items-center">
                                    <div className="pl-7">
                                      <span className="text-base">
                                        {toMonthName(
                                          receipt.deletedDate?.slice(5, 7)
                                        )}
                                      </span>
                                      <br />
                                      <span className="text-2xl font-bold">
                                        {receipt.deletedDate?.slice(8, 10)}
                                      </span>
                                    </div>
                                  </label>
                                </div>
                              </div>
                              <div className="text-center flex justify-center items-center cursor-pointer">
                                <div>
                                  {receipt.merchant.name == "Walmart" ? (
                                    <span className="relative top-3">
                                      <Image
                                        alt=""
                                        loading="eager"
                                        width="60"
                                        height="60"
                                        src="/images/Walmart.svg"
                                        className="pt-3"
                                      />
                                    </span>
                                  ) : receipt.merchant.name == "Tim Hortons" ? (
                                    <span className="relative top-3">
                                      <Image
                                        alt=""
                                        loading="eager"
                                        width="60"
                                        height="60"
                                        src="/images/Tim_hortons.svg"
                                        className="pt-3"
                                      />
                                    </span>
                                  ) : receipt.merchant.name == "Roy Rogers" ? (
                                    <span className="relative top-3">
                                      <Image
                                        alt=""
                                        loading="eager"
                                        width="60"
                                        height="60"
                                        src="/images/roy-rogers.png"
                                        className="pt-3"
                                      />
                                    </span>
                                  ) : receipt.merchant.name == "Starbucks" ? (
                                    <span className="relative top-3">
                                      <Image
                                        alt=""
                                        loading="eager"
                                        width="60"
                                        height="60"
                                        src="/images/Starbucks.svg"
                                        className="pt-3"
                                      />
                                    </span>
                                  ) : (
                                    <span>
                                      <Image
                                        alt=""
                                        loading="eager"
                                        width="70"
                                        height="70"
                                        src="/images/noimage.jpg"
                                        className="pt-3"
                                      />
                                    </span>
                                  )}

                                  <span className="ml-3 text-lg custom-position">
                                    {receipt.merchant.name}
                                  </span>
                                </div>
                              </div>
                              <div className="text-center flex justify-center items-center">
                                <div className="text-base ">
                                  {receipt.notes ? (
                                    <div>#{receipt.notes}</div>
                                  ) : (
                                    <div></div>
                                  )}
                                  <span className="text-[#ea3358]">
                                    {receipt.tags ? (
                                      <div>#{receipt.tags}</div>
                                    ) : (
                                      <div></div>
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="text-center">
                                <div>
                                  <Image
                                    alt=""
                                    loading="eager"
                                    width="88"
                                    height="53"
                                    src="/images/cardsgroup.svg"
                                  />
                                </div>
                              </div>
                              <div className="text-right flex justify-end items-center divide-x">
                                <div className="mr-7 flex">
                                  <span className="text-lg font-bold">
                                    {parseFloat(receipt.transactionTotal).toFixed(2)}
                                  </span>
                                </div>
                                <div className="pl-7 cursor-pointer" onClick={() => update(receipt.id)}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="none"
                                    viewBox="0 0 16 16"
                                  >
                                    <path
                                      fill="currentColor"
                                      fillRule="evenodd"
                                      d="M2.402 2.402a7.917 7.917 0 110 11.196.792.792 0 011.12-1.12 6.333 6.333 0 100-8.957c-.313.313-.822.866-1.263 1.352a130.598 130.598 0 00-.73.812l-.062.07-.592-.526-.592-.526.064-.071a122.756 122.756 0 01.739-.823c.438-.483.972-1.063 1.316-1.407zM.349 5.82a.792.792 0 01-.066-1.118l.592.526.592.525a.792.792 0 01-1.118.067z"
                                      clipRule="evenodd"
                                    ></path>
                                    <path
                                      fill="currentColor"
                                      fillRule="evenodd"
                                      d="M.875 1.27c.437 0 .792.355.792.792v2.375h2.375a.792.792 0 010 1.584H.875a.792.792 0 01-.792-.792V2.062c0-.437.355-.791.792-.791z"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="collapse-content bg-[#F9FAFF]">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="mt-5 mb-5">
                                <div>
                                  <h3 className="font-bold text-xl">Tags</h3>
                                  {receipt.tags ? (
                                    <div className="truncate">
                                      <div className="badge badge-outline badge-lg mr-2 mt-1 text-xs custom-border">
                                        <p>#{receipt.tags}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="p-3 "></div>
                                  )}
                                </div>
                                <div className="mt-4">
                                  <h3 className="font-bold text-xl">Notes</h3>
                                  <div className="form-control">
                                    <textarea
                                      className="textarea h-24 textarea-bordered"
                                      placeholder="Purchases for the #kids #birthday"
                                    ></textarea>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-5 col-span-2">
                                <div>
                                  <h3 className="font-bold text-xl">
                                    Items
                                    <div className="badge p-1 border-none zeebadge mr-[68%]">
                                      {receipt?.lineItems?.length}
                                    </div>
                                  </h3>

                                  <div className=" mt-2">
                                    <div className="grid grid-cols-2 gap-custom">
                                      {receipt?.lineItems?.length > 0 ? (
                                        receipt?.lineItems
                                          .slice(0, 6)
                                          .map(function (lineItems, id) {
                                            return (
                                              <div
                                                className="bgcolor flex mb-4 justify-between items-center"
                                                key={id}
                                              >
                                                <div className="flex items-center">
                                                  <div className="receiptimg">
                                                    {lineItems.imgUrl ? (
                                                      <Image
                                                        alt=""
                                                        loading="eager"
                                                        width="60"
                                                        height="60"
                                                        src={lineItems.imgUrl}
                                                      />
                                                    ) : (
                                                      <Image
                                                        alt=""
                                                        loading="eager"
                                                        width="60"
                                                        height="60"
                                                        src="/images/noimage.jpg"
                                                      />
                                                    )}
                                                  </div>
                                                  <div className="ml-4">
                                                    <h3 className="text-sm">
                                                      {lineItems.description}
                                                    </h3>
                                                  </div>
                                                </div>
                                                <div className="ml-5">
                                                  <p className="text-base font-bold">
                                                    {parseFloat(
                                                      lineItems.price
                                                    ).toFixed(2)}
                                                  </p>
                                                </div>
                                              </div>
                                            );
                                          })
                                      ) : (
                                        <div>
                                          <div className="bgcolor flex pt-2"></div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <div className="flex mt-3">
                                        <div>
                                          <p className="text-lg font-bold">Payment</p>
                                          <Image
                                            alt=""
                                            loading="eager"
                                            width="60"
                                            height="60"
                                            src="/images/minidebitcard.svg"
                                          />
                                        </div>
                                        <div>
                                          <p className="text-4xl font-bold mt-[30px]">
                                            {parseFloat(
                                              receipt.transactionTotal
                                            ).toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      {receipt?.lineItems?.length > 6 ? (
                                        <div className="mt-3   text-center">
                                          <p className="text-sm bg-white rounded-[6px] border-[#EEEEEE] text-[#EA3358] font-normal p-3 cursor-pointer">
                                            +{receipt.lineItems.length - 6} More Items
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="mt-3 bg-white text-center"></div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </div>
            )}
      </main>
      )}
    </>
  );
};

export default Deleted;
