import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import HashLoader from "react-spinners/HashLoader";
import useAuthContext from "../../../../hooks/useAuth";
import Draft, { ContentState } from "draft-js";
import Datetimepicker from "../../../components/Datetimepicker";
import { isValidUrl } from "../../../../utils/helpers";
import Spinner from "../../../icons/Spinner";


const { CompositeDecorator, Editor, EditorState } = Draft;

const OderId = () => {
  const router = useRouter();
  const { source, orderId } = router.query;
  const [loading, setloading] = useState(true);
  const [data, setData] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [products, setProducts] = useState([]);
  const [date, setDate] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [tag, setTag] = useState([]);
  const [notes, setNotes] = useState("");
  const [cardId, setCardId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [src, setSrc] = useState("/images/macrodebitcard.svg");
  const [loader, setLoader] = useState(false);

  const [error, setError] = useState("");


  const AuthContext = useAuthContext();

  const liftState = (data) => {
    setDate(data);
  };

  const compositeDecorator = new CompositeDecorator([
    {
      strategy: handleStrategy,
      component: HandleSpan,
    },
    {
      strategy: hashtagStrategy,
      component: HashtagSpan,
    },
  ]);

  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(compositeDecorator)
  );

  useEffect(() => {
    const getReceipt = async () => {
      try {
        fetchData();
        if (AuthContext?.encodedToken) {
          if (router.query.update) {
            setIsUpdate(true);
          }
        }
      } catch (error) {
        console.log("SLUG: Error");
        console.log(error);
      }
    };
    getReceipt();
  }, [AuthContext?.encodedToken, router]);

  useEffect(() => {
    if (data) {
      setProducts(data.lineItems);
      setDate(data.createdDate);
      setSubtotal(data.transactionSubtotal);
      setTax(data.tax);
      setTotal(data.transactionTotal);
      setTag(data.tags);
      setNotes(data.notes);
      if (data.payment !== null) {
        setCardId(data.payment.paymentTypeId);
      }
      if (data.payment !== null) {
        setCardNum(data.payment.cardNum);
      }
      if (data.notes !== null) {
        const plainText = data.notes;
        const content = ContentState.createFromText(plainText);
        setEditorState(EditorState.createWithContent(content));
      }
      if (data.payment !== null) {
        if (
          data.payment.paymentTypeId === "2695ea37-c981-4d38-bac0-84dcd46a1ed9"
        ) {
          setCardName("Visa");
          setSrc("/images/card.png");
        } else {
          setCardName("MasterCard");
          setSrc("/images/macrodebitcard.svg");
        }
      }

    }
  }, [data]);

  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 1000);
  }, []);

  const fetchData = async () => {
    try {
      var header = {
        headers: {
          "Content-Type": "application/json",
          bundleid: "com.ihatereceipts.web",
          // "x-api-key": "Y7z7tGPZQq2hjD9lmE3BCapcSGxP0HeC6LhOrBVP",
          "x-api-key": AuthContext?.apiKey,
          Authorization: "Bearer " + AuthContext?.encodedToken,
          // Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJrMjZxcFFDRWFiVkNubWo4T284bXU1N0llbUUzIiwic3ViIjoiY29tLmloYXRlcmVjZWlwdHMud2ViIn0.zy5aiAgfPsJoMIkbhVQaLQQ14Z82V2NUVLCBDff0-Jg",
        },
      };
      const newsRes = await fetch(
        `${process.env.IHR_BASE_URL}/digital-receipts/public/${source}__${orderId}`,
        header
      ).then((response) => response.json());
      setData(newsRes);

      setError("");
    } catch (error) {
      setError("Receipt does not exist.");
      setLoader(true);
    }
  };


  return (
    <div>
      <Head>
        <title>I Hate Receipt</title>
        <meta name="description" content="I Hate receipt" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? (
        <div className="loader">
          <HashLoader color={"#F37A24"} loading={loading} size={80} />
        </div>
      ) : (<div>


        <div>

          <main className="ordermain">


            <div>
              <div className="bg-[#F9FAFF]">
                <div className="order-header">
                  <div className="pt-5">
                    {data?.merchant?.name == "Walmart" ? (
                      <span>
                        <Image
                          alt=""
                          loading="eager"
                          width="60"
                          height="40"
                          src="/images/walmart.png"
                          objectFit="contain"
                          className="pt-3"
                        />
                      </span>
                    ) : data?.merchant?.name == "Tim Hortons" ? (
                      <span>
                        <Image
                          alt=""
                          loading="eager"
                          width="60"
                          height="40"
                          src="/images/timhortons.png"
                          objectFit="contain"
                          className="pt-3"
                        />
                      </span>
                    ) : data?.merchant?.name == "Roy Rogers" ? (
                      <span>
                        <Image
                          alt=""
                          loading="eager"
                          width="60"
                          height="40"
                          src="/images/roy-rogers.png"
                          objectFit="contain"
                          className="pt-3"
                        />
                      </span>
                    ) : data?.merchant?.name == "Starbucks" ? (
                      <span>
                        <Image
                          alt=""
                          loading="eager"
                          width="60"
                          height="40"
                          src="/images/starbucks.png"
                          objectFit="contain"
                          className="pt-3"
                        />
                      </span>
                    ) : (
                      <span>
                        <Image
                          alt=""
                          loading="eager"
                          width="100"
                          height="60"
                          src="/images/V-logo.png"
                          className="pt-3"
                        />
                      </span>
                    )}
                  </div>
                  <div>
                    {/* {data ? <>
                      <h1 className="text-2xl font-medium uppercase tracking-[0.5em]">
                        {data?.merchant?.name}
                      </h1>
                    </> : "Loading..."} */}
                    {!data ? (
                      error == "Receipt does not exist." ?
                        <div>
                          <h1>No record found</h1>
                        </div> :
                        <h1>
                          Loading...
                        </h1>
                    ) :
                      <>
                        <h1 className="text-2xl font-medium uppercase tracking-[0.5em]">
                          {data?.merchant?.name}
                        </h1>
                      </>}

                    <div className="flex mt-2 pb-5 justify-center">
                      <a href="#" className="storebtn-left">Store Map</a>
                      <a href="https://ihrweb.staging.receiptserver.com/" className="storebtn-right">Website</a>
                    </div>

                  </div>
                </div>


                {!data ? (
                  error == "Receipt does not exist." ?
                    <div className="flex w-full mt-[100px] justify-center items-center flex-col">
                      <h1 className="text-lg text-base-content mt-5 mb-2">No record found</h1>
                    </div> :
                    <div className="flex w-full mt-[100px] justify-center items-center flex-col">
                      <Spinner />
                      <h1 className="text-lg text-base-content mt-5 mb-2">Loading...</h1>
                      <h2 className="text-lg text-[#ABABAB]">Please Wait</h2>
                    </div>
                ) : (
                  <div>
                    <div className="text-center mt-5">
                      <p className="text-md font-bold text-[#838383]">
                        {data?.transactionDate?.slice(0, 16).replace("T", " ")}
                      </p>
                      <hr />
                    </div>

                    <div className=" mt-10 mb-[100px] relative bottom-8">

                      {data?.lineItems.length ? <>
                        <h2 className="text-1xl font-bold mt-3 text-center">
                          Items
                          <div className="badge p-1 border-none badge">
                            {products?.length}
                          </div>
                        </h2>
                      </> : ""}

                      {data?.lineItems.length ? <>
                        <div className="mt-4 sharedetailtable">
                          <div className="flex flex-col">
                            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                              <div className="overflow-hidden">
                                <table className="min-w-full">
                                  <thead>
                                    <tr>
                                      <th scope="col" className="text-sm text-center font-medium text-gray-900 px-6 py-4 text-left">
                                        PHOTOS
                                      </th>
                                      <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                        DESCRIPTION
                                      </th>
                                      <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                        NOTES AND TAGS
                                      </th>
                                      <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                        PRICE
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {products?.slice(0, 10).map(function (lineItems, id) {
                                      return (
                                        <>
                                          <tr key={lineItems?.index}>
                                            <td className="text-center px-2 py-4 text-sm">
                                              <Image
                                                alt="modo view"
                                                loading="eager"
                                                width="30"
                                                height="30"
                                                src={
                                                  lineItems.imgUrl
                                                    ? isValidUrl(lineItems.imgUrl)
                                                      ? lineItems.imgUrl
                                                      : `https://${lineItems.imgUrl}`
                                                    : "/images/noimage.jpg"
                                                }
                                              />
                                            </td>
                                            <td>
                                              <h3 className="text-sm text-gray-900 px-2 py-4">{lineItems.description}</h3>
                                            </td>
                                            <td>
                                              <h3 className="text-sm text-gray-900 px-2 py-4">{lineItems.notes}</h3>
                                            </td>
                                            <td className="text-md font-bold text-gray-900 px-2 py-4">
                                              ${parseFloat(lineItems.price).toFixed(2)}
                                            </td>
                                          </tr>
                                        </>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </> : ""}

                      {data?.transactionSubtotal == null || data?.transactionSubtotal == 0 ? "" :
                        <>

                          <div className="px-5 pt-3 pb-2 flex items-center justify-between">
                            <p className="text-md font-bold text-[#838383]">Subtotal:</p>
                            <p className="text-md font-bold text-gray-900">
                              ${parseFloat(data?.transactionSubtotal).toFixed(2)}
                            </p>
                          </div>
                          <hr />
                        </>}
                      {data?.tax == null || data?.tax == 0 ? "" :
                        <>
                          <div className="px-5 pt-3 pb-2 flex items-center justify-between">
                            <p className="text-md font-bold text-[#838383]">Sales Tax:</p>
                            <p className="text-md font-bold text-gray-900">
                              ${parseFloat(data?.tax).toFixed(2)}
                            </p>
                          </div>
                          <hr />
                        </>
                      }
                      {data?.tip == null || data?.tip == 0 ? "" :
                        <>
                          <div className=" px-5 pt-3 pb-2 flex items-center justify-between">
                            <p className="text-md font-bold text-[#838383]">Tip:</p>
                            <p className="text-md font-bold text-gray-900">
                              ${parseFloat(data?.tip).toFixed(2)}
                            </p>
                          </div>
                          <hr />
                        </>
                      }
                      {data?.transactionTotal == null || data?.transactionTotal == 0 ? "" :
                        <>
                          <div className=" px-5 pt-3 pb-2 flex items-center justify-between">
                            <p className="text-md font-bold text-[#838383]">Total:</p>
                            <p className="text-xl font-bold text-gray-900">
                              ${parseFloat(data?.transactionTotal).toFixed(2)}
                            </p>
                          </div>
                          <hr />
                        </>
                      }

                    </div>
                  </div>
                )}

              </div>
            </div>


            <nav>
              <div
                className={`navbar bg-base-100 flex justify-center`}
              >
                <div className="dropdown">
                  <p className="text-center text-[#6a6868] text-sm font-medium ">HD Receipt by:</p>
                  <Image
                    className="cursor-pointer"
                    alt=""
                    loading="eager"
                    height="31"
                    width="200"
                    src="/images/ihr-newlogo.png"
                  />
                </div>
              </div>
            </nav>

          </main>
        </div>

      </div>
      )}
    </div>
  );
};

const HANDLE_REGEX = /@[\w]+/g;
const HASHTAG_REGEX = /#[\w\u0590-\u05ff]+/g;
function handleStrategy(contentBlock, callback, contentState) {
  findWithRegex(HANDLE_REGEX, contentBlock, callback);
}
function hashtagStrategy(contentBlock, callback, contentState) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}
function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}
const HandleSpan = (props) => {
  return (
    <span style={styles.handle} data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
};
const HashtagSpan = (props) => {
  return (
    <span style={styles.hashtag} data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
};
const styles = {
  root: {
    fontFamily: "forma-djr-banner",
    padding: 20,
    width: 600,
  },
  editor: {
    border: "1px solid #ddd",
    cursor: "text",
    fontSize: 16,
    minHeight: 40,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: "center",
  },
  handle: {
    color: "rgba(98, 177, 254, 1.0)",
    direction: "ltr",
    unicodeBidi: "bidi-override",
  },
  hashtag: {
    color: "rgba(45, 0, 122, 1.0)",
  },
};

export default OderId;
