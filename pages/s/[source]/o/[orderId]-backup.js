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
      setError("Your receipt generation is in progress.");
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

        {/* {!data ? (
          <main>
            <nav>
              <div className={`navbar bg-base-100 flex justify-around`} style={{
                borderBottomWidth: '0px',
                borderBottomColor: "#F4F4F4",
              }}>
                <div className="flex w-1/2 justify-center dropdown">
                  <Image className="cursor-pointer" alt="" loading="eager" height="45" width="100%" src="/images/newlogo.png" />
                </div>
              </div>
            </nav>
            <div className="notfound px-12 bg-[#F9FAFF] pt-[12vw] h-screen">
              <div className="notfound-404">
                <h1>Oops!</h1>
                <h2>{error}</h2>
              </div>
              <button href="javascript:void(0)">Come Back Later</button>
            </div>
          </main>
        ) : ( */}
        <div>

          <main>
            <nav>
              <div
                className={`navbar bg-base-100 flex justify-around`}
                style={{
                  borderBottomWidth: '0px',
                  borderBottomColor: "#F4F4F4",
                }}
              >
                <div className="flex w-1/2 justify-center dropdown">
                  <Image
                    className="cursor-pointer"
                    alt=""
                    loading="eager"
                    height="45"
                    width="100%"
                    src="/images/newlogo.png"
                  />
                </div>
              </div>
            </nav>

            <div>
              <div className="px-12 bg-[#F9FAFF] receiptinffo">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 mt-5 mb-24 border-rights">
                    <div className="flex">
                      <div className="bg-white amazonpd">
                        {data?.merchant?.name == "Walmart" ? (
                          <span>
                            <Image
                              alt=""
                              loading="eager"
                              width="80"
                              height="80"
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
                              width="80"
                              height="80"
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
                              width="80"
                              height="80"
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
                              width="80"
                              height="80"
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
                              width="80"
                              height="80"
                              src="/images/noimage.jpg"
                              className="pt-3"
                            />
                          </span>
                        )}
                      </div>
                      <div>
                        {isUpdate === true ? (
                          <>
                            <Datetimepicker
                              lift={liftState}
                              defaultValue={data?.transactionDate
                                ?.slice(0, 16)
                                .replace("T", " ")}
                              timeFormat={"HH:mm"}
                            />
                          </>
                        ) : (
                          <p className="text-base">
                            {data?.transactionDate?.slice(0, 16).replace("T", " ")}
                          </p>
                        )}

                        <h1 className="text-3xl font-bold">
                          {data?.merchant?.name}
                        </h1>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mt-3">Tags</h3>
                      <div className="flex flex-rows">
                        <div className="truncate">
                          {data?.tags?.map((data, id) => {
                            return (
                              <div
                                className="badge badge-outline badge-lg mr-2 mt-1 text-xs custom-border"
                                key={id}
                              >
                                <p>#{data}</p>
                              </div>
                            );
                          })}
                        </div>

                      </div>

                    </div>
                    <div className="mt-4">
                      <h3 className="font-bold text-xl">Notes</h3>
                      <div
                        className="form-control border-[1px] h-[90px] rounded mt-[10px] p-[10px]"
                      >
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 padding">
                    <p className="text-lg text-[#B4B4B4] font-medium mb-2">
                      Payment method
                    </p>
                    <Image
                      alt=""
                      loading="eager"
                      width="258"
                      height="163"
                      src={src}
                    />

                    {data ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-lg text-[#B4B4B4]">Subtotal</p>

                          <p className="text-3xl text-[#B4B4B4]">
                            ${parseFloat(data?.transactionSubtotal).toFixed(2)}
                          </p>

                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-lg text-[#B4B4B4]">Tax</p>

                          <p className="text-3xl text-[#B4B4B4]">
                            ${parseFloat(data?.tax).toFixed(2)}
                          </p>

                        </div>

                        <hr />

                        <div className="flex items-center justify-between">
                          <p className="text-lg text-[#000]">Total</p>

                          <p className="text-3xl font-bold text-[#000]">
                            ${parseFloat(data?.transactionTotal).toFixed(2)}
                          </p>

                        </div>
                      </div>
                    ) : (<p>Loading.....</p>)}

                  </div>
                </div>
              </div>
              <div className="px-12 relative bottom-8">
                <hr />
                <h2 className="text-3xl font-bold mt-3">
                  Items
                  <div className="badge p-1 border-none zeebadge">
                    {products?.length}
                  </div>
                </h2>

                {!data ? (
                  <div className="flex w-full mt-[100px] justify-center items-center flex-col">
                    <Spinner />
                    <h1 className="text-lg text-base-content mt-5 mb-2">Loading...</h1>
                    <h2 className="text-lg text-[#ABABAB]">Please Wait</h2>
                  </div>
                ) : (<>


                  <div className="w-full mt-4 sharedetailtable">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>PHOTO</th>
                          <th>DESCRIPTION</th>
                          <th>NOTE AND TAGS</th>
                          <th className="text-center">PRICE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products?.slice(0, 10).map(function (lineItems, id) {
                          return (
                            <tr key={lineItems?.index}>

                              <td>
                                <div className="flex items-center space-x-3">
                                  <Image
                                    alt="modo view"
                                    loading="eager"
                                    width="60"
                                    height="60"
                                    src={
                                      lineItems.imgUrl
                                        ? isValidUrl(lineItems.imgUrl)
                                          ? lineItems.imgUrl
                                          : `https://${lineItems.imgUrl}`
                                        : "/images/noimage.jpg"
                                    }
                                  />
                                </div>
                              </td>
                              <td>
                                <h3 className="text-sm">{lineItems.description}</h3>
                              </td>
                              <td>
                                <h3 className="text-sm">{lineItems.notes}</h3>
                              </td>
                              <th>
                                <div className="text-center">
                                  <span className="text-lg font-bold">
                                    ${parseFloat(lineItems.price).toFixed(2)}
                                  </span>
                                </div>
                              </th>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                  </div>
                </>)}
              </div>

              <div className="hidden alert alert-success shadow-sm w-[350px] fixed bottom-[10px] right-[15px] z-[100]">
                <div>
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Receipt deleted successfully!</span>
                </div>
              </div>

            </div>
          </main>
        </div>
        {/* )} */}
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
