import { useEffect, useState } from "react";
import Image from "next/image";
import Spinner from "./icons/Spinner";
import { useRouter } from "next/router";
import Head from "next/head";
import Delete from "./icons/Delete";
import useAuthContext from "../hooks/useAuth";

const Upload = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [click, setClick] = useState(false);
  const [id, setId] = useState([]);

  const router = useRouter();
  const AuthContext = useAuthContext();

  function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("en-US", {
      month: "short",
    });
  }

  useEffect(() => {
    setTimeout(() => setLoading(true), 5000);
  });

  useEffect(() => {
    const val = sessionStorage.getItem("data");
    if (val && val.length > 0) {
      setData(JSON.parse(val));
    }
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      sessionStorage.removeItem("data");
    }
  }, [data]);


  // const getid = async () => {
  //   {data?.map(function (receipt, id) { 
  //     setId(receipt.id)
  //     console.log(id);
     
  //       if (id.length > 0) {
  //         for (const key of Object.keys(id)) {
  //           fetch(
  //             `https://api.staging.receiptserver.com/api/v1/receipts/${id[key]}`,
  //             {
  //               method: "DELETE",
  //               headers: {
  //                 bundleid: "com.ihatereceipts.web",
  //                 "Access-Control-Allow-Origin": "*",
  //                 "x-api-key": AuthContext?.apiKey,
  //                 Authorization: "Bearer " + AuthContext?.encodedToken,
  //               },
  //             }
  //           )
  //             .then((response) => response.json())
  //             .catch((err) => console.log(err));
    
  //           setData((prev) => prev.filter((data) => data.id !== id[key]));
  //           setId((prev) => prev.filter((id) => id === data.id));
  //         }
  //       }
      
  //   })}
  // }

  const onDelete = async () => {
    if (id.length > 0) {
      for (const key of Object.keys(id)) {
        const response = await fetch(
          `${process.env.IHR_BASE_URL}/receipts/${id[key]}`,
          {
            method: "DELETE",
            headers: {
              bundleid: "com.ihatereceipts.web",
              "Access-Control-Allow-Origin": "*",
              "x-api-key": AuthContext?.apiKey,
              Authorization: "Bearer " + AuthContext?.encodedToken,
            },
          }
        )
          .then((response) => response.json())
          .catch((err) => console.log(err));

        setData((prev) => prev.filter((data) => data.id !== id[key]));
        setId((prev) => prev.filter((id) => id === data.id));
      }
    }
  };

  return (
    <>
      <Head>
        <title>Upload receipt</title>
        <meta name="description" content="I Hate receipt" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading === false ? (
        <div className="flex w-full h-screen justify-center items-center flex-col">
          <Spinner />
          <h1 className="text-lg text-base-content mt-5 mb-2">Uploading...</h1>
          <h2 className="text-lg text-[#ABABAB]">Please Wait</h2>
        </div>
      ) : (
        <main className="flex flex-col">
          <div className="flex w-full h-[200px] justify-between">
            <h1 className="text-4xl text-base-content mt-[48px] ml-[50px] font-bold">
              Receipts
            </h1>
            <div
              className="flex h-[61px] w-[127px] bg-base-100 border-[#EEEEE] border-2 justify-center items-center mr-[70px] mt-[39px] rounded-xl"
              onClick={onDelete}
            >
              <Delete />
              <span className="ml-3 text-sm text-error font-bold cursor-pointer">
                Remove
              </span>
            </div>
          </div>

          <div className="text-left ml-[54px]">
            <div className="grid grid-cols-5 gap-4 mg-5">
              <div>
                <label>
                  <input type="checkbox" className="checkbox custom-check" />
                </label>
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
          <div className="ml-[54px] mr-[54px]">
            {data?.length > 0 || data !== undefined || data === null ? (
              <>
                {data?.map(function (receipt, id) {
                  return (
                    <div
                      tabIndex="0"
                      key={id}
                      className="mt-2 collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
                    >
                      <div className="collapse-title text-xl font-medium dropcus pasdfsdf">
                        <div className="grid grid-cols-5 gap-4 mg-5">
                          <div className="text-left">
                            <div className="flex items-center">
                              <label>
                                <input
                                  type="checkbox"
                                  className="checkbox custom-check"
                                  onChange={(event) => {
                                    setClick(!click);
                                    if (event.target.checked) {
                                      setId((prev) => [...prev, receipt.id]);
                                    } else {
                                      setId((prev) =>
                                        prev.filter(
                                          (item) => item === receipt.id
                                        )
                                      );
                                    }
                                  }}
                                />
                                </label>
                                <div>
                                  <span className="text-base">
                                    {toMonthName(
                                      receipt.transactionDate.slice(5, 7)
                                    )}
                                  </span>
                                  <br />
                                  <span className="text-2xl font-bold">
                                    {receipt.transactionDate.slice(8, 10)}
                                  </span>
                                </div>
                              
                            </div>
                          </div>
                          <div className="text-center flex justify-center items-center cursor-pointer">
                            <div className="flex items-center">
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
                          <div className="text-right flex justify-end items-center">
                            <div>
                              <span className="text-lg font-bold">
                                {parseFloat(receipt.transactionTotal).toFixed(
                                  2
                                )}
                              </span>
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
                                  {receipt.lineItems.length}
                                </div>
                              </h3>

                              <div className=" mt-2">
                                <div className="grid grid-cols-2 gap-custom">
                                  {receipt.lineItems.length > 0 ? (
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
                                      <p className="text-lg font-bold">
                                        Payment
                                      </p>
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
                                  {receipt.lineItems.length > 6 ? (
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
          <div className="flex h-[100px] w-full fixed bottom-0 bg-white justify-between items-center border-y-2 border-[#EEEEE]">
            <h1 className="flex ml-[50px] text-primary text-lg">
              {data?.length > 1 ? (`${data.length} Receipts Uploaded`) : `${data.length} Receipt Uploaded` }
            </h1>
            <div>
              <button
                className="btn btn-ghost w-[150px]"
                onClick={() => router.push("/home")}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary text-white w-[150px] mr-[40px] ml-[20px]"
                onClick={() => {
                  router.push("receiptdetails");
                }}
              >
                Save Receipts
              </button>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Upload;
