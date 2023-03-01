import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Slider from "@mui/material/Slider";
import HashLoader from "react-spinners/HashLoader";
import Spinner from "./icons/Spinner";
import Link from "next/link";
import Navbar from "./navbar";
import Filters from "./components/Filters";
import Datepicker from "./components/Datepicker";
import CardFilters from "./components/CardFilters";
import Caution from "./icons/Caution";
import axios from "axios";
import useAuthContext from "../hooks/useAuth";
import { isValidUrl } from "../utils/helpers";
import FilterPaginator from "./components/FilterPaginator";
import TagsModal from "./components/TagsModal";

const Receiptdetail = () => {
  const router = useRouter();
  const AuthContext = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [loading, setloading] = useState(true);
  const [tagColor, setTagColor] = useState("#F9FAFF");
  const [active, setActive] = useState(false);
  const [checked, setChecked] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [merchantColor, setMerchantColor] = useState("#F9FAFF");
  const [receipt, setReceipt] = useState();
  const [lowValue, setLowValue] = useState(0);
  const [topValue, setTopValue] = useState(1000);
  const [priceColor, setPriceColor] = useState("#F9FAFF");
  const [dateColor, setDateColor] = useState("#F9FAFF");
  const [paymentColor, setPaymentColor] = useState("#F9FAFF");
  const [textColor, setTextColor] = useState("[#838383]");
  const [textColor2, setTextColor2] = useState("[#838383]");
  const [textColor3, setTextColor3] = useState("[#838383]");
  const [val, setVal] = useState([]);
  const [textTags, setTextTags] = useState("[#838383]");
  const [textMerchant, setTextMerchant] = useState("[#838383]");
  const [date, setDate] = useState([
    {
      startDate: "",
      endDate: "",
      key: "selection",
    },
  ]);
  const [receipts, setReceipts] = useState([]);
  const [tags, setTags] = useState([]);
  const [merchant, setMerchant] = useState([]);
  const [payment, setPayment] = useState([]);
  const [idd, setId] = useState([]);
  const [click, setClick] = useState(false);
  const [receiptId, setReceiptId] = useState("");
  const [shortId, setShortId] = useState([]);
  const [modal, setModal] = useState("invisible");
  const [inde, setIndex] = useState([]);
  const [modal2, setModal2] = useState("invisible");
  const [modalId, setModalId] = useState("");
  const [tagModal, setTagModal] = useState([]);
  const [modalSearch, setModalSearch] = useState("");
  const [currentDropdown, setCurrentDropdown] = useState(0);
  const [show, setShow] = useState("invisible");
  const [loader, setLoader] = useState(true);


 

  function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("en-US", {
      month: "short",
    });
  }

  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    setTagModal(checked);
  }, [checked]);

  useEffect(() => {
    if (modalSearch === "") {
      setShow("invisible");
    }
  }, [modalSearch]);

  useEffect(() => {
    const getReceiptsDetails = async () => {
      try {
        if (AuthContext?.userId) {
          initialFetchData().then((data) => {
            setReceipts(data.receipt);
          });
        }
      } catch (error) {
        console.log("RECEIPTSDETAILS: Error newsRes");
      }
    };
    getReceiptsDetails();
  }, [AuthContext?.userId]);

  useEffect(() => {
    if (router.query.merchant && active === false) {
      setSearchTerm(router.query.merchant);
      setMerchantColor("#2D007A");
      setTextMerchant("white");
    } else if (router.query.payment && active === false) {
      setSearchTerm(router.query.payment);
      setPaymentColor("#2D007A");
      setTextColor3("white");
    } else if (router.query.tags && active === false) {
      setSearchTerm(router.query.tags);
      setTagColor("#2D007A");
      setTextTags("white");
    } else if (lowValue > 1 || topValue < 1000) {
      setPriceColor("#2D007A");
      setTextColor("white");
    } else if (date[0].startDate !== "") {
      setDateColor("#2D007A");
      setTextColor2("white");
    } else if (val.length > 0 && active === false) {
      setPaymentColor("#2D007A");
      setTextColor3("white");
    }
  }, [router.query.merchant, router.query.payment, router.query.tags, active, lowValue, topValue, date, val.length]);

  /**
   * Fetch the API and update the DOM when the states change
   */
  useEffect(() => {
    if (val.length > 0) {
      setPaymentColor("#2D007A");
      setTextColor3("white");
    } else {
      setPaymentColor("#F9FAFF");
      setTextColor3("[#838383]");
    }

    if (AuthContext?.userId) {
      searchHandler();
    }
  }, [checked, merchants, lowValue, topValue, date, val, AuthContext?.userId]);

  /**
   * Object with the data to be POST to the API
   */
  var items = {
    offset: 0,
    limit: 100,
    merchants: merchants,
    tags: checked,
    priceMin: lowValue,
    priceMax: topValue,
    startDate: date[0].startDate,
    endDate: date[0].endDate,
    paymentFilters: val,
  };

  const handleCheck = (event, type, selectedValue) => {
    let myPromise = new Promise(function (resolve, reject) {
      resolve(letData(event, type, selectedValue));
    });
  };

  /**
   * Set states with current target value
   */
  const letData = (event, type, selectedValue) => {
    if (type === "merchant") {
      var updatedMerchantList = [...merchants];
      if (event.target.checked) {
        updatedMerchantList.push(selectedValue);
      } else {
        const index = merchants.indexOf(selectedValue);
        if (index > -1) {
          updatedMerchantList.splice(index, 1);
        }
      }
      setMerchants(updatedMerchantList);
    } else if (type === "tags") {
      var updatedTagsList = [...checked];
      if (event.target.checked) {
        updatedTagsList.push(selectedValue);
      } else {
        const index = checked.indexOf(selectedValue);
        if (index > -1) {
          updatedTagsList.splice(index, 1);
        }
      }
      setChecked(updatedTagsList);
    } else if (type === "payment") {
      const IdCard = selectedValue;
      const cardObject = {
        paymentId: IdCard[1],
        cardNumber: IdCard[0],
      };
      let allCardsFilters = [...val];
      if (event.target.checked) {
        allCardsFilters.push(cardObject);
      } else {
        const index = val.indexOf(cardObject);
        if (index === -1) {
          allCardsFilters = allCardsFilters.filter(
            (card) => card.cardNumber !== cardObject.cardNumber
          );
        }
      }
      setVal(allCardsFilters);
    } else if (type === "tagModal") {
      var updatedTagsList = [...tagModal];
      if (event.target.checked) {
        updatedTagsList.push(selectedValue);
      } else {
        const index = tagModal.indexOf(selectedValue);
        if (index > -1) {
          updatedTagsList.splice(index, 1);
        }
      }
      setTagModal(updatedTagsList);
    }
  };

  /**
   * Set body request
   * Fetch data to API --> POST filters
   */
  async function searchHandler() {
    try {
      const resp = await fetch(
        "https://api.staging.receiptserver.com/api/v4/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            bundleid: "com.ihatereceipts.web",
            "x-api-key": AuthContext?.apiKey,
            Authorization: "Bearer " + AuthContext?.encodedToken,
          },
          body: JSON.stringify(items),
        }
      ).then((response) => response.json());

      setReceipt(resp);
    } catch (error) {
      console.log("ERROR searchHandler");
    }
  }
  /**
   * DELETE receipt fetch endpoint
   */
  const onDelete = async () => {
    if (idd.length > 0) {
      for (const key of Object.keys(idd)) {
        const response = await fetch(
          `${process.env.IHR_BASE_URL}/receipts/${idd[key]}`,
          {
            method: "DELETE",
            headers: {
              bundleid: "com.ihatereceipts.web",
              "x-api-key": AuthContext?.apiKey,
              Authorization: "Bearer " + AuthContext?.encodedToken,
            },
          }
        )
          .then((response) => response.json())
          .catch((err) => console.log(err));

        setReceipts((prev) => prev.filter((data) => data.id !== idd[key]));
        setId((prev) => prev.filter((data) => idd[key] === data.id));
        searchHandler();
      }
    }
  };
  /** POST Export PDF/CSV  */
  async function exportReceipt(exportType) {
    if (idd.length > 0) {
      let ids = {
        receiptsIds: idd,
      };
      const resp = await fetch(
        `${process.env.IHR_BASE_URL}/receipts/pdf?exportType=${exportType}`,

        {
          method: "POST",
          headers: {
            "x-api-key": AuthContext?.apiKey,
            Authorization: "Bearer " + AuthContext?.encodedToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ids),
        }
      )
        .then((response) => response.json())
        .catch((err) => {
          throw err;
        });
      router.push(resp.message);
    } else {
      //Handling error
    }
  }

  /**
   * Method to view the original receipt --> GET
   */
  const viewOriginalReceipt = async () => {
    if (idd.length === 1) {
      let newString = `${shortId[0]}?a=1|0|0`;
      const encodedString = Buffer.from(newString).toString("base64");
      let receiptdetail = await fetch(
        `${process.env.IHR_BASE_URL}/receipts/share?p=${encodedString}`,
        {
          headers: {
            "x-api-key": AuthContext?.apiKey,
            Accept: "application/json",
          },
        }
      ).then((response) => response.json());
      let url = receiptdetail.sharedReceipts[0].images[0];
      let images = "";

      let resp = axios.get(url, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
        data: {},
        responseType: "blob",
        timeout: 15000,
      });

      Promise.all([resp]).then((response) => {
        images = new Blob([response[0].data], { type: "image/png" });
        let objectURL = URL.createObjectURL(images);
        document.getElementById(
          "receipt-image"
        ).innerHTML = `<img alt='${objectURL}' src='${objectURL}'>`;
      });
    } else {
      //throw error
    }
  };

  /**
   * Component: Slider range
   * changes the values and the sets to the state
   */
  const handleChange = (event, newValue) => {
    setLowValue(newValue[0]);
    setTopValue(newValue[1]);
    searchHandler();
  };

  function valuetext(value) {
    return `${value}°C`;
  }

  /**
   * Component: Datepicker
   *  This function lifts the state from Datepicker component*/
  const liftState = (data) => {
    setDate(data);
  };

  const selectionItems = (event) => {
    const isSelectedAll = event.target.checked || false;
    if (isSelectedAll) {
      if (receipts?.length) {
        const allSelectedItems = receipts?.map(
          (receipt) => receipt.id
        );

        const allIds = receipts?.map((receipt) => receipt.shortId);
        let allIndex = [];
        for (let x in receipts) {
          if (x !== undefined) {
            allIndex.push(parseInt(x));
          }
        }
        setShortId(allIds);
        setId(allSelectedItems);
        setIndex(allIndex);
      }
    } else {
      setId([]);
      setShortId([]);
      setIndex([]);
    }
  };

  const onSelectItem = (event, id, short, idi) => {
    let allElements = idd;
    let allIds = shortId;
    let ind = inde;
    setReceiptId(id);
    setClick(!click);
    if (event.target.checked) {
      allElements.push(id);
      allIds.push(short);
      ind.push(idi);
    } else {
      const index = idd.indexOf(id);
      if (index > -1) {
        
        allElements.splice(index, 1);
        allIds.splice(index, 1);
        ind.splice(index, 1);
      }
    }
    setIndex(ind);
    setId(allElements);
    setShortId(allIds);
  };

  /** Share receipt data */
  const shareReceipt = () => {
    if (shortId.length === 0) {
      //Throw error
    } else if (shortId.length === 1) {
      /** When is selected just one receipt to share*/
      let newString = `${shortId[0]}?a=1|0|0`;
      const encodedString = Buffer.from(newString).toString("base64");
      router.push(
        "https://share.staging.receiptserver.com/s/" +
          encodeURIComponent(encodedString)
      );
    } else {
      /** When is selected more than one receipt to share*/
      let newString = shortId.toString().replace(/,/g, "|");
      let allIds = `${newString}?a=1|0|0`;
      const encodedString = Buffer.from(allIds).toString("base64");
      router.push(
        "https://share.staging.receiptserver.com/s/" +
          encodeURIComponent(encodedString)
      );
    }
  };

  const updateReceipt = async (receipt) => {
    await fetch(
      `${process.env.IHR_BASE_URL}/receipts/${receipt.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          bundleid: "com.ihatereceipts.web",
          "x-api-key": AuthContext?.apiKey,
          Authorization: "Bearer " + AuthContext?.encodedToken,
        },
        body: JSON.stringify(receipt),
      }
    )
      .then((response) => response.json())
      .catch((err) => {
        throw err;
      });
  };

  const initialFetchData = async () => {
    var header = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": AuthContext?.apiKey,
        Authorization: "Bearer " + AuthContext?.encodedToken,
      },
    };
    const receipt = await fetch(
      `${process.env.IHR_BASE_URL}/receipts?offset=0&limit=100`,
      header
    ).then((response) => response.json());
    setLoader(false);
    fetchTagsFilters(0);
    fetchMerchantsFilters(0);
    fetchPaymentsFilters(0);

    return { receipt };
  };

  const fetchTagsFilters = async (page) => {
    const header = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": AuthContext?.apiKey,
        Authorization: "Bearer " + AuthContext?.encodedToken,
      },
    };
    const result = await fetch(
      `${process.env.IHR_BASE_URL}/tags?page=${page}&size=5`,
      header
    ).then((response) => response.json());

    setTags(result);
  };

  const fetchMerchantsFilters = async (page) => {
    const header = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": AuthContext?.apiKey,
        Authorization: "Bearer " + AuthContext?.encodedToken,
      },
    };
    const result = await fetch(
      `${process.env.IHR_BASE_URL}/merchants?page=${page}&size=5`,
      header
    ).then((response) => response.json());

    setMerchant(result);
  };

  const fetchPaymentsFilters = async (page) => {
    const header = {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": AuthContext?.apiKey,
        Authorization: "Bearer " + AuthContext?.encodedToken,
      },
    };
    const result = await fetch(
      `https://api.staging.receiptserver.com/api/v2/paymenttypes?page=${page}&size=5`,
      header
    ).then((response) => response.json());

    setPayment(result);
  };

  const modalHandler = (item) => {
    if (item.includes(modalSearch)) {
      return true;
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
      ) : (
        <main>
          <Navbar type={"receipt"} route={"/home"} />

          <div className="receiptdetail container mx-auto px-24 mt-16 mb-16">
            <h1 className="text-3xl font-bold ml-2">Recently Added</h1>
            <div className="flex justify-center mt-4 receiptdetails">
            {loader === true ? (
              <div className="flex w-full justify-center items-center flex-col">
                <Spinner />
                <h1 className="text-lg text-base-content mt-5 mb-2">Loading...</h1>
                <h2 className="text-lg text-[#ABABAB]">Please Wait</h2>
              </div>
            ) : (<>
                {receipts?.slice(0, 3).map(function (receipt, id) {
                  return (
                    <div className="card w-4/12 bg-bazse-100 border" key={id}>
                      <Link href={`/${receipt.id}`}>
                        <div>
                          <div className="flex mb-4 justify-between items-center">
                            <div className="flex">
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
                                  <p className="text-xs opacity-70 font-semibold"></p>
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
                            <div>
                              <h3 className="text-xs text-right opacity-60">
                                Total
                              </h3>

                              {receipt.transactionTotal ? (
                                <p className="text-2xl font-bold">
                                  $
                                  {parseFloat(receipt.transactionTotal).toFixed(
                                    2
                                  )}
                                </p>
                              ) : (
                                <p className="text-2xl font-bold"></p>
                              )}
                            </div>
                          </div>
                          <hr />
                          <div className="min-h-[120px]">
                            <div className="flex mt-4">
                              {receipt?.lineItems
                                ?.slice(0, 4)
                                .map(function (lineItems, id) {
                                  return (
                                    <div className="receiptimg mr-2" key={id}>
                                      {lineItems.imgUrl ? (
                                        <Image
                                          alt=""
                                          loading="eager"
                                          width="46"
                                          height="46"
                                          src={
                                            isValidUrl(lineItems.imgUrl)
                                              ? lineItems.imgUrl
                                              : `https://${lineItems.imgUrl}`
                                          }
                                        />
                                      ) : (
                                        <Image
                                          alt=""
                                          loading="eager"
                                          width="46"
                                          height="46"
                                          src="/images/noimage.jpg"
                                        />
                                      )}
                                    </div>
                                  );
                                })}

                              {receipt?.lineItems?.length > 4 ? (
                                <div className="nineitems">
                                  <p className="text-sm text-primary">
                                    +{receipt.lineItems.length - 4} Items
                                  </p>
                                </div>
                              ) : (
                                <div></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </>)}
            </div>

            <h1 className="text-3xl font-bold ml-2 mt-4">Receipts</h1>
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
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
                className="relative w-full rounded border bg-white px-3 py-3 pl-10 text-lg placeholder-slate-300 outline-none focus:outline-none focus:ring"
              />
            </div>

            <hr />

            <div className="taggs dropdown dropdown-end ml-5 mt-5">
              <label
                tabIndex="1"
                className={`tags`}
                onClick={() => {
                  setCurrentDropdown(0);
                }}
              >
                {date[0].startDate !== "" ? (
                  <p
                    className={`flex text-${textColor2}`}
                    style={{ backgroundColor: `${dateColor}` }}
                  >
                    {date[0].startDate.getMonth() +
                      "/" +
                      date[0].startDate.getDate() +
                      "/" +
                      date[0].startDate.getFullYear()}{" "}
                    -{" "}
                    {date[0].endDate.getMonth() +
                      "/" +
                      date[0].endDate.getDate() +
                      "/" +
                      date[0].endDate.getFullYear()}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </p>
                ) : (
                  <p
                    className={`flex text-${textColor2}`}
                    style={{ backgroundColor: `${dateColor}` }}
                  >
                    Date
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </p>
                )}
              </label>
              <div
                tabIndex="1"
                className="mt-3 card card-compact dropdown-content w-[920px] bg-base-100 shadow"
              >
                <div className="card-body">
                  <div className="mb-3 flex flex-col">
                    <div className="flex items-center w-[920px]">
                      <p className="text-sm">Date to</p>
                      <div className="flex flex-row items-center absolute right-10">
                        <p className="bg-secondary rounded-2xl text-white max-w-[12px] max-h-[12px] text-tiny flex justify-center items-center mr-1 ml-3">
                          ✕
                        </p>
                        <p
                          className="text-md cursor-pointer text-secondary w-[16px] "
                          onClick={() => {
                            setSearchTerm("");
                            setActive(true);
                            setDateColor("#F9FAFF");
                            setTextColor2("[#838383]");
                            setDate([
                              {
                                startDate: "",
                                endDate: "",
                                key: "selection",
                              },
                            ]);
                            handleCheck();
                          }}
                        >
                          Clear
                        </p>
                      </div>
                    </div>
                    <div>
                      <Datepicker lift={liftState} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`taggs dropdown dropdown-end ml-5 mt-5 ${
                currentDropdown === 1 ? "dropdown-open" : ""
              }`}
            >
              <label
                tabIndex="1"
                className={`tags`}
                onClick={() => {
                  setCurrentDropdown(1);
                }}
              >
                {checked.length > 0 ? (
                  <p className={`flex text-white bg-primary`}>
                    {checked.length === 1 ? (
                      <> {`#${checked[0]}`}</>
                    ) : (
                      <> {`#${checked[0]} (+${checked.length - 1} more)`}</>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </p>
                ) : (
                  <p
                    className={`flex text-${textTags}`}
                    style={{ backgroundColor: `${tagColor}` }}
                  >
                    Tag
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </p>
                )}
              </label>
              <div
                tabIndex="1"
                className="mt-3 card card-compact dropdown-content w-80 bg-base-100 shadow"
                onMouseLeave={() => {
                  setCurrentDropdown(0);
                }}
                onMouseEnter={() => {
                  setCurrentDropdown(1);
                }}
              >
                <div className="card-body flex justify-center">
                  <div className=" flex items-center">
                    <p className="text-xl font-bold">Filter by tag</p>
                    <h3
                      className="text-md text-[#EA3358] font-bold cursor-pointer"
                      onClick={() => {
                        setCurrentDropdown(0);
                      }}
                    >
                      Save
                    </h3>
                  </div>
                  <div>
                    <form method="GET">
                      <div className="relative text-gray-600 focus-within:text-gray-400">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                          <button
                            type="submit"
                            className="p-1 focus:outline-none focus:shadow-outline"
                          >
                            <svg
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              className="w-4 h-4"
                            >
                              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                          </button>
                        </span>
                        <input
                          type="search"
                          name="q"
                          className="solosearch py-2 bg-base-200 text-sm text-base-content rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
                          placeholder="Search Tags"
                          autoComplete="off"
                          onChange={(event) => {
                            setFilterSearch(event.target.value);
                          }}
                        />
                      </div>
                    </form>
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-start">
                    <p className="bg-[#6A2FE8] rounded-2xl text-white max-w-[12px] max-h-[12px] text-tiny flex justify-center items-center mr-1 ml-3">
                      ✕
                    </p>
                    <p
                      className="text-md cursor-pointer text-[#6A2FE8] max-w-[70px]"
                      onClick={() => {
                        setTagColor("#F9FAFF");
                        setTextTags("[#838383]");
                        setSearchTerm("");
                        setActive(true);
                        setChecked([]);
                        handleCheck();
                      }}
                    >
                      Clear All
                    </p>

                    {checked.map((item, id) => (
                      <div
                        className=" flex justify-center text-primary rounded-[15px] mr-2 border-primary border-2 p-0.5 cursor-pointer"
                        key={id}
                        onClick={() => {
                          setSearchTerm("");
                          let updatedTagsList = [...checked];
                          const index = checked.indexOf(item);
                          if (index > -1) {
                            updatedTagsList.splice(index, 1);
                          }
                          setChecked(updatedTagsList);
                        }}
                      >
                        <p className="mr-1 text-sm ">{item}</p>x
                      </div>
                    ))}
                  </div>

                  <div className="flex items-left flex-col notify pb-4 mt-3">
                    {tags?.itemsList
                      ?.filter((item) => {
                        if (
                          item
                            .toLowerCase()
                            .includes(filterSearch.toLowerCase())
                        ) {
                          return item;
                        }
                      })
                      .map((tag, id) => (
                        <Filters
                          element={tag}
                          query={router.query.tags}
                          id={id}
                          setSearchTerm={setSearchTerm}
                          key={id}
                          handleCheck={handleCheck}
                          type={"tags"}
                          currentSelecteds={checked}
                        />
                      ))}
                  </div>
                  <div className="btn-group flex justify-center">
                    {tags && (
                      <FilterPaginator
                        currentPage={tags.currentPage}
                        totalPageCount={tags.totalPageCount}
                        changePage={fetchTagsFilters}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`taggs dropdown dropdown-end ml-5 mt-5 ${
                currentDropdown === 2 ? "dropdown-open" : ""
              }`}
            >
              <label
                tabIndex="1"
                className={`tags`}
                onClick={() => {
                  setCurrentDropdown(2);
                }}
              >
                {merchants.length > 0 ? (
                  <p className={`flex text-white bg-primary`}>
                    {merchants.length === 1 ? (
                      <> {`#${merchants[0]}`}</>
                    ) : (
                      <> {`#${merchants[0]} (+${merchants.length - 1} more)`}</>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </p>
                ) : (
                  <p
                    className={`flex text-${textMerchant}`}
                    style={{ backgroundColor: `${merchantColor}` }}
                  >
                    Merchant
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </p>
                )}
              </label>
              <div
                tabIndex="1"
                className="mt-3 card card-compact dropdown-content w-80 bg-base-100 shadow"
                onMouseLeave={() => {
                  setCurrentDropdown(0);
                }}
                onMouseEnter={() => {
                  setCurrentDropdown(2);
                }}
              >
                <div className="card-body flex justify-center">
                  <div className=" flex items-center">
                    <p className="text-xl font-bold">Filter by Merchant</p>
                    <h3
                      className="text-md text-[#EA3358] font-bold cursor-pointer"
                      onClick={() => {
                        setCurrentDropdown(0);
                      }}
                    >
                      Save
                    </h3>
                  </div>
                  <div>
                    <form method="GET">
                      <div className="relative text-gray-600 focus-within:text-gray-400">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                          <button
                            type="submit"
                            className="p-1 focus:outline-none focus:shadow-outline"
                          >
                            <svg
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              className="w-4 h-4"
                            >
                              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                          </button>
                        </span>
                        <input
                          type="search"
                          name="q"
                          className="solosearch py-2 bg-base-200 text-sm text-base-content rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
                          placeholder="Search Merchants"
                          autoComplete="off"
                          onChange={(event) => {
                            setFilterSearch(event.target.value);
                          }}
                        />
                      </div>
                    </form>
                  </div>
                  <div className="flex flex-row items-center justify-start">
                    <p className="bg-[#6A2FE8] rounded-2xl text-white max-w-[12px] max-h-[12px] text-tiny flex justify-center items-center mr-1 ml-3">
                      ✕
                    </p>
                    <p
                      className="text-md cursor-pointer text-[#6A2FE8] max-w-[70px]"
                      onClick={() => {
                        setMerchants([]);
                        setSearchTerm("");
                        setActive(true);
                        handleCheck();
                        setTextMerchant("[#838383]");
                        setMerchantColor("#F9FAFF");
                      }}
                    >
                      Clear All
                    </p>
                    {merchants.map((item, id) => (
                      <div
                        className=" flex justify-center text-primary rounded-[15px] mr-2 border-primary border-2 p-0.5 cursor-pointer"
                        key={id}
                        onClick={() => {
                          setSearchTerm("");
                          let updatedMerchantList = [...merchants];
                          const index = merchants.indexOf(item);
                          if (index > -1) {
                            updatedMerchantList.splice(index, 1);
                          }
                          setMerchants(updatedMerchantList);
                        }}
                      >
                        <p className="mr-1 text-sm">{item}</p>x
                      </div>
                    ))}
                  </div>

                  <div className="flex items-left flex-col notify pb-4 mt-3">
                    {merchant?.itemsList
                      ?.filter((item) => {
                        if (
                          item
                            .toLowerCase()
                            .includes(filterSearch.toLowerCase())
                        ) {
                          return item;
                        }
                      })
                      .map((store, id) => (
                        <Filters
                          element={store}
                          query={router.query.tags}
                          id={id}
                          setSearchTerm={setSearchTerm}
                          key={id}
                          handleCheck={handleCheck}
                          type={"merchant"}
                          currentSelecteds={merchants}
                        />
                      ))}
                  </div>
                  <div className="btn-group flex justify-center ">
                    {merchant && (
                      <FilterPaginator
                        currentPage={merchant.currentPage}
                        totalPageCount={merchant.totalPageCount}
                        changePage={fetchMerchantsFilters}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`taggs dropdown dropdown-end ml-5 mt-5 ${
                currentDropdown === 3 ? "dropdown-open" : ""
              }`}
            >
              <label
                tabIndex="1"
                className={`tags`}
                onClick={() => {
                  setCurrentDropdown(3);
                }}
              >
                {checked.length > 0 && checked[0] === "7644" ? (
                  <p className={`flex text-white bg-primary`}>
                    {checked.length === 1 ? (
                      <> {`#${checked[0]}`}</>
                    ) : (
                      <> {`#${checked[0]} (+${checked.length - 1} more)`}</>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </p>
                ) : (
                  <p
                    className={`flex text-${textColor3}`}
                    style={{ backgroundColor: `${paymentColor}` }}
                  >
                    Payment
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </p>
                )}
              </label>
              <div
                tabIndex="1"
                className="mt-3 card card-compact dropdown-content w-80 bg-base-100 shadow"
                onMouseLeave={() => {
                  setCurrentDropdown(0);
                }}
                onMouseEnter={() => {
                  setCurrentDropdown(3);
                }}
              >
                <div className="card-body flex justify-center">
                  <div className=" flex items-center">
                    <p className="text-xl font-bold">Filter by Payment</p>
                    <h3
                      className="text-md text-[#EA3358] font-bold cursor-pointer"
                      onClick={() => {
                        setCurrentDropdown(0);
                      }}
                    >
                      Save
                    </h3>
                  </div>
                  <div>
                    <form method="GET">
                      <div className="relative text-gray-600 focus-within:text-gray-400">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                          <button
                            type="submit"
                            className="p-1 focus:outline-none focus:shadow-outline"
                          >
                            <svg
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              className="w-4 h-4"
                            >
                              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                          </button>
                        </span>
                        <input
                          type="search"
                          name="q"
                          className="solosearch py-2 bg-base-200 text-sm text-base-content rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
                          placeholder="Search Payments"
                          autoComplete="off"
                          onChange={(event) => {
                            setFilterSearch(event.target.value);
                          }}
                        />
                      </div>
                    </form>
                  </div>
                  <div className="flex flex-row items-center justify-start">
                    <p className="bg-[#6A2FE8] rounded-2xl text-white max-w-[12px] max-h-[12px] text-tiny flex justify-center items-center mr-1 ml-3">
                      ✕
                    </p>
                    <p
                      className="text-md cursor-pointer text-[#6A2FE8] max-w-[70px]"
                      onClick={() => {
                        setSearchTerm("");
                        setVal([]);
                        setActive(true);
                        setPaymentColor("#F9FAFF");
                        setTextColor3("[#838383]");
                      }}
                    >
                      Clear All
                    </p>
                    {val.map((item, id) => (
                      <div
                        className=" flex justify-center text-primary rounded-[15px] mr-2 border-primary border-2 p-0.5 cursor-pointer"
                        key={id}
                        onClick={() => {
                          setSearchTerm("");
                          let allCardsFilters = [...val];
                          const cardObject = {
                            paymentId: item.paymentId,
                            cardNumber: item.cardNumber,
                          };
                          const index = val.indexOf(cardObject);
                          if (index === -1) {
                            allCardsFilters = allCardsFilters.filter(
                              (card) => card.cardNumber !== item.cardNumber
                            );
                          }
                          setVal(allCardsFilters);
                        }}
                      >
                        <p className="mr-1 text-sm">
                          {item.cardNumber.substring(0, 8)}
                        </p>
                        x
                      </div>
                    ))}
                  </div>

                  <div className="flex items-left flex-col notify pb-4 mt-3">
                    {payment?.itemsList
                      ?.filter((item) => {
                        if (
                          item.cardNumber
                            .toLowerCase()
                            .includes(filterSearch.toLowerCase())
                        ) {
                          return item.cardNumber;
                        }
                      })
                      .map((card, id) => (
                        <CardFilters
                          element={card.cardNumber}
                          card={card.paymentTypeId}
                          query={router.query.payment}
                          id={id}
                          setSearchTerm={setSearchTerm}
                          key={id}
                          handleCheck={handleCheck}
                          type={"payment"}
                          currentSelecteds={val}
                        />
                      ))}
                  </div>
                  <div className="btn-group flex justify-center ">
                    {payment && (
                      <FilterPaginator
                        currentPage={payment.currentPage}
                        totalPageCount={payment.totalPageCount}
                        changePage={fetchPaymentsFilters}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="taggs dropdown dropdown-end ml-5 mt-5">
              <label
                tabIndex="1"
                className={`tags`}
                onClick={() => {
                  setCurrentDropdown(0);
                }}
              >
                <p
                  className={`flex text-${textColor}`}
                  style={{ backgroundColor: `${priceColor}` }}
                >
                  Price
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-3 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </p>
              </label>
              <div
                tabIndex="1"
                className="mt-3 card card-compact dropdown-content w-80 bg-base-100 shadow"
              >
                <div className="card-body">
                  <div className="mb-3">
                    <div className="flex flex-row items-center">
                      <p className="bg-[#6A2FE8] rounded-2xl text-white max-w-[12px] max-h-[12px] text-tiny flex justify-center items-center mr-1">
                        ✕
                      </p>
                      <p
                        className="text-md cursor-pointer text-[#6A2FE8] max-w-[70px]"
                        onClick={() => {
                          setLowValue(0);
                          setTopValue(1000);
                          setPriceColor("#F9FAFF");
                          setTextColor("[#838383]");
                        }}
                      >
                        Clear All
                      </p>
                    </div>
                    <div className="flex flex-row items-center">
                      <input
                        type="search"
                        name="w"
                        className="solosearch py-2 bg-base-200 text-sm text-base-content rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
                        placeholder="$ 0"
                        autoComplete="off"
                        onChange={(e) => setLowValue(e.target.value)}
                        value={lowValue}
                      />{" "}
                      -
                      <input
                        type="search"
                        name="z"
                        className="solosearch py-2 bg-base-200 text-sm text-base-content rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
                        placeholder="$ 1000"
                        autoComplete="off"
                        onChange={(e) => setTopValue(e.target.value)}
                        value={topValue}
                      />
                    </div>
                    <div>
                      <Slider
                        getAriaLabel={() => "Temperature range"}
                        value={[lowValue, topValue]}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={1000}
                        getAriaValueText={valuetext}
                        color="secondary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {idd?.length > 0 ? (
              <div className="gap-4 mt-4 columns-5 text-center sharedetail flex items-center">
                <div
                  className="border-r-2 justify-center w-1/5 flex items-center cursor-pointer"
                  onClick={() => shareReceipt()}
                >
                  <Image
                    alt=""
                    loading="eager"
                    width="18"
                    height="18"
                    src="/images/share.png"
                  />
                  <span className="ml-3 relative text-regular">
                    Share receipt
                  </span>
                </div>
                <div
                  className="flex items-center cursor-pointer border-r-2 justify-center w-1/5 cursor-pointer"
                  onClick={() => {
                    viewOriginalReceipt();
                    setModal("visible");
                  }}
                >
                  <div className="-space-x-5 avatar-group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="19"
                      fill="none"
                      viewBox="0 0 15 19"
                    >
                      <path
                        fill="#262626"
                        d="M13.406.313H1.594A1.314 1.314 0 00.28 1.625v16.406a.656.656 0 00.656.657h.657a.654.654 0 00.525-.263L3.562 16.5l1.444 1.925a.68.68 0 001.05 0L7.5 16.5l1.444 1.925a.68.68 0 001.05 0l1.444-1.925 1.443 1.925a.655.655 0 00.525.262h.656a.656.656 0 00.657-.656V1.625A1.314 1.314 0 0013.406.312zm0 16.624l-1.444-1.925a.68.68 0 00-1.05 0L9.47 16.938l-1.444-1.925a.68.68 0 00-1.05 0l-1.444 1.925-1.443-1.925a.68.68 0 00-1.05 0l-1.444 1.925V1.625h11.812v15.312z"
                      ></path>
                    </svg>
                  </div>
                  <div className="ml-2">
                    <p className="text-regular">View original receipt</p>
                  </div>
                </div>
                <div
                  className="flex items-center cursor-pointer border-r-2 justify-center w-1/5 cursor-pointer"
                  onClick={() => exportReceipt("PDF")}
                >
                  <div className="flex items-center">
                    <div className="-space-x-5 avatar-group">
                      <Image
                        alt=""
                        loading="eager"
                        width="20"
                        height="20"
                        src="/images/export.png"
                      />
                    </div>
                    <div className="ml-2">
                      <p className="text-regular">Export to PDF</p>
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-center cursor-pointer border-r-2 justify-center w-1/5 cursor-pointer"
                  onClick={() => exportReceipt("CSV")}
                >
                  <div className="flex items-center">
                    <div className="-space-x-5 avatar-group">
                      <Image
                        alt=""
                        loading="eager"
                        width="20"
                        height="20"
                        src="/images/export.png"
                      />
                    </div>
                    <div className="ml-2">
                      <p className="text-regular">Export to CSV</p>
                    </div>
                  </div>
                </div>
                <label
                  className="cursor-pointer border-r-2 flex justify-center items-center w-1/5"
                  htmlFor="delete-modal"
                >
                  <Image
                    alt=""
                    loading="eager"
                    width="20"
                    height="20"
                    src="/images/delete.png"
                  />
                  <span className="ml-3 justify-center">Remove</span>
                </label>
                <input
                  type="checkbox"
                  id="delete-modal"
                  className="modal-toggle"
                />
                <div className="modal">
                  <div className="modal-box w-[480px] h-[310px]">
                    <div className="w-full flex justify-center mb-[10px]">
                      <Caution />
                    </div>
                    <div className="flex justify-center">
                      <h3 className="font-bold text-lg text-primary max-w-[280px]">
                        Are you sure you want to remove the selected receipts?
                      </h3>
                    </div>

                    <label className="py-4">
                      <p className="text-secondary">
                        {idd.length} selected receipts
                      </p>{" "}
                      will be removed and moved into the vault.
                    </label>
                    <div className="modal-action flex justify-center">
                      <label
                        className="flex justify-center items-center text-base-300 bg-base-100 border-2 border-base-200 w-[150px] mr-[10px] rounded-lg cursor-pointer"
                        htmlFor="delete-modal"
                      >
                        Cancel
                      </label>
                      <label
                        className="btn btn-primary ml-[10px]"
                        onClick={onDelete}
                        htmlFor="delete-modal"
                      >
                        Remove
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}

            <div className="text-left">
              <div className="grid grid-cols-5 gap-4 mg-5">
                <div>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox custom-check"
                      checked={idd.length === receipts?.length}
                      onChange={selectionItems}
                    />
                  </label>
                  <span className="text-sm font-bold text-primary">DATE</span>
                  <span className="pl-3 bold brightness-150 text-primary">
                    &darr;
                  </span>
                </div>
                <div>
                  <p className="bg-white text-center text-sm font-bold text-[#838383]">
                    MERCHANT
                    <span className="pl-3 bold brightness-150">&darr;</span>
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
                    <span className="pl-3 bold brightness-150">&darr;</span>
                  </p>
                </div>
                <div>
                  <p className="bg-white text-right text-sm font-bold text-[#838383]">
                    TOTAL
                    <span className="pl-3 bold brightness-150">&darr;</span>
                  </p>
                </div>
              </div>
              {searchTerm === "" ? (
                <>
                  {receipts?.map(function (receipt, id) {
                    return (
                    <>
                      <Products
                        receipt={receipt}
                        id={id}
                        idd={idd}
                        toMonthName={toMonthName}
                        onSelectItem={onSelectItem}
                        inde={inde}
                        key={id}
                        setModal2={setModal2}
                        setModalId={setModalId}
                        modalSearch={modalSearch}
                      />
                      <div
                        className={`w-screen h-screen fixed z-[900000000] ${modal2} top-0 left-0`}
                        onClick={() => setModal2("invisible")}
                      ></div>
                      {modal2 === "visible" && modalId === id ? (
                        <div className="block fixed z-[900000001] w-[500px] h-[400px] bg-white shadow top-[30%] left-[20%] rounded-xl">
                          <div className="flex justify-between p-5 rounded">
                            <p className="text-xl font-bold">Add Tags</p>
                            <h3
                              className="text-md text-[#EA3358] font-bold cursor-pointer"
                              onClick={() => {
                                updateReceipt(receipt);
                                setModal2("invisible");
                              }}
                            >
                              Save
                            </h3>
                          </div>
                          <div
                            className={`${modal2}`}
                            onClick={() => setModal2("visible")}
                          >
                            <div className="relative text-gray-600 focus-within:text-gray-400 ml-3 mr-3">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                <button
                                  type="submit"
                                  className="p-1 focus:outline-none focus:shadow-outline"
                                >
                                  <svg
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    className="w-4 h-4"
                                  >
                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                  </svg>
                                </button>
                              </span>
                              <input
                                type="search"
                                name="q"
                                className="solosearch py-2 bg-base-200 text-sm text-base-content rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
                                placeholder="Search Tags"
                                autoComplete="off"
                                onChange={(event) => {
                                  setModalSearch(event.target.value);
                                  if (
                                    !receipt?.tags?.includes(event.target.value)
                                  ) {
                                    setShow("visible");
                                  } else if (modalSearch === "") {
                                    setShow("invisible");
                                  } else {
                                    setShow("invisible");
                                  }
                                }}
                                defaultValue={""}
                                value={modalSearch}
                              />
                            </div>

                            {receipt?.tags
                              ?.filter((item) => {
                                if (modalHandler(item.toLowerCase()) === true) {
                                  return item;
                                }
                              })
                              .map((data, id) => {
                                return (
                                  <>
                                    <TagsModal
                                      tag={data}
                                      id={id}
                                      type={"tags"}
                                      currentSelecteds={tagModal}
                                      handleCheck={handleCheck}
                                    />
                                  </>
                                );
                              })}
                            <label
                              className={`flex flex-rows p-5 cursor-pointer ${show}`}
                              onClick={() => {
                                if (receipt.tags === null) {
                                  receipt.tags = [];
                                  receipt.notes = "";
                                  receipt.tags.push(modalSearch);
                                  receipt.notes += `#${modalSearch} `;
                                } else {
                                  receipt.tags.push(modalSearch);
                                  receipt.notes += `#${modalSearch} `;
                                }

                                setModalSearch("");
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {`Add #${modalSearch} as a tag`}
                            </label>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                    )
                  })}
                </>
              ) : (
                <>
                  {receipt?.itemsList
                    ?.filter((item) => {
                      if (item.tags?.includes(searchTerm)) {
                        return item;
                      } else if (searchTerm == "") {
                        return item;
                      } else if (item.tags?.includes(searchTerm)) {
                        return item;
                      } else if (
                        item.merchant?.name
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      ) {
                        return item;
                      } else if (item.notes?.includes(searchTerm)) {
                        return item;
                      } else if (
                        item.payment.cardNumber?.includes(searchTerm)
                      ) {
                        return item;
                      }
                    })
                    .map(function (receipt, id) {
                      return (
                        <div
                          tabIndex="0"
                          key={id}
                          className="mt-2 collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
                        >
                          <div className="collapse-title text-xl font-medium dropcus pasdfsdf">
                            <div className="grid grid-cols-5 gap-4 mg-5">
                              <div className="text-left">
                                <div>
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      className="checkbox custom-check"
                                    />
                                    <div>
                                      <span className="text-base">
                                        {toMonthName(
                                          receipt.createdDate.slice(5, 7)
                                        )}
                                      </span>
                                      <br />
                                      <span className="text-2xl font-bold">
                                        {receipt.createdDate.slice(8, 10)}
                                      </span>
                                    </div>
                                  </label>
                                </div>
                              </div>
                              <div
                                className="text-center flex justify-center items-center cursor-pointer"
                                onClick={() => router.push(`/${receipt.id}`)}
                              >
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
                              <div className="text-right flex justify-end items-center">
                                <div>
                                  <span className="text-lg font-bold">
                                    {parseFloat(
                                      receipt.transactionTotal
                                    ).toFixed(2)}
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
                                    <div className="flex flex-wrap w-[200px]">
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
                                      defaultValue={receipt.notes}
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
                                    <div
                                      className="btn btnlightblue rounded-xl font-normal bg-[#8A86F2]"
                                      onClick={() =>
                                        router.push(`/${receipt.id}`)
                                      }
                                    >
                                      Open full details
                                    </div>
                                  </h3>

                                  <div className=" mt-2">
                                    <div className="grid grid-cols-2 gap-custom">
                                      {receipt?.lineItems?.length > 0 ? (
                                        receipt?.lineItems.map(function (
                                          lineItems,
                                          id
                                        ) {
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
                                      {receipt?.lineItems?.length > 6 ? (
                                        <div className="mt-3   text-center">
                                          <p
                                            className="text-sm bg-white rounded-[6px] border-[#EEEEEE] text-[#EA3358] font-normal p-3 cursor-pointer"
                                            onClick={() =>
                                              router.push(`/${receipt.id}`)
                                            }
                                          >
                                            +{receipt.lineItems.length - 6} More
                                            Items
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
              )}
            </div>
          </div>
        </main>
      )}
      <div
        className={`flex justify-center fixed items-center ${modal} z-[9000000] top-0 w-full h-full backdrop-blur-sm`}
        onClick={() => setModal("invisible")}
      >
        <span
          className="absolute w-8 top-0 right-1 rounded py-3 pl-3 z-[9000001]"
          onClick={() => setModal("invisible")}
        >
          <label
            htmlFor="merchant"
            className="modal-button btn btn-circle btn-sm absolute right-2 top-2"
          >
            ✕
          </label>
        </span>
        <div id="receipt-image" className="shadow-2xl"></div>
      </div>
    </div>
  );
};

const Products = ({
  receipt,
  idd,
  id,
  toMonthName,
  onSelectItem,
  inde,
  setModal2,
  setModalId,
}) => {
  let border, base;
  const index = inde.indexOf(id);
  if (index !== -1) {
    if (id === inde[index]) {
      border = "primary";
      base = "base-200";
    } else {
      border = "base-300";
      base = "primary-content";
    }
  } else {
    border = "base-300";
    base = "primary-content";
  }
  const router = useRouter();

  return (
    <div
      tabIndex="0"
      key={id}
      className={`mt-2 collapse collapse-arrow border border-${border} bg-${base} rounded-box`}
    >
      <div className="collapse-title text-xl font-medium dropcus pasdfsdf">
        <div className="grid grid-cols-5 gap-4 mg-5">
          <div className="text-left">
            <div className="flex items-center">
              <label>
                <input
                  type="checkbox"
                  className="checkbox custom-check"
                  checked={idd.includes(receipt.id)}
                  onChange={(event) => {
                    onSelectItem(event, receipt.id, receipt.shortId, id);
                  }}
                />
              </label>
              <div>
                  <span className="text-base">
                    {toMonthName(receipt.createdDate.slice(5, 7))}
                  </span>
                  <br />
                  <span className="text-2xl font-bold">
                    {receipt.createdDate.slice(8, 10)}
                  </span>
                </div>
            </div>
          </div>
          <div
            className="text-center flex justify-center items-center cursor-pointer"
            onClick={() => router.push(`/${receipt.id}`)}
          >
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
              {receipt.notes ? <div>{receipt.notes}</div> : <div></div>}
              <span className="text-primary">
                {receipt.tags ? (
                  <>
                    {receipt.tags.map((tag, id) => {
                      return <div key={id}>#{tag}</div>;
                    })}
                  </>
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
                {parseFloat(receipt.transactionTotal).toFixed(2)}
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

              <>
                <div className="truncate flex flex-rows">
                  {receipt?.tags?.slice(0, 3).map((data, id) => {
                    return (
                      <div
                        className="badge badge-outline badge-lg mr-2 mt-1 text-xs custom-border"
                        key={id}
                      >
                        <p>#{data}</p>
                      </div>
                    );
                  })}
                  <label
                    className="cursor-pointer"
                    onClick={() => {
                      setModal2("visible");
                      setModalId(id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#2D007A"
                        d="M5.583 3.833a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zm0 0a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zm17.395 7.677l-10.5-10.5a2.333 2.333 0 00-1.644-.677H2.667A2.333 2.333 0 00.333 2.667v8.166a2.333 2.333 0 00.689 1.657l.478.467a6.556 6.556 0 012.427-.864l-1.26-1.26V2.667h8.166l10.5 10.5-8.166 8.166-1.26-1.26a6.499 6.499 0 01-.864 2.427l.479.478a2.334 2.334 0 001.645.689 2.333 2.333 0 001.645-.689l8.167-8.166a2.333 2.333 0 00.688-1.645 2.33 2.33 0 00-.689-1.657zM5.584 3.833a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zm4.084 16.334h-3.5v3.5H3.834v-3.5h-3.5v-2.334h3.5v-3.5h2.333v3.5h3.5v2.334z"
                      ></path>
                    </svg>
                  </label>
                </div>
              </>
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-xl">Notes</h3>
              <div className="form-control">
                <textarea
                  className="textarea h-24 textarea-bordered"
                  placeholder="Purchases for the #kids #birthday"
                  value={receipt.notes}
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
                <div
                  className="btn btnlightblue rounded-xl font-normal bg-[#8A86F2]"
                  onClick={() => router.push(`/${receipt.id}`)}
                >
                  Open full details
                </div>
              </h3>

              <div className=" mt-2">
                <div className="grid grid-cols-2 gap-custom">
                  {receipt?.lineItems?.length > 0 ? (
                    receipt?.lineItems
                      ?.slice(0, 6)
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
                                    src={
                                      isValidUrl(lineItems.imgUrl)
                                        ? lineItems.imgUrl
                                        : `https://${lineItems.imgUrl}`
                                    }
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
                                {parseFloat(lineItems.price).toFixed(2)}
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
                        {parseFloat(receipt.transactionTotal).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  {receipt?.lineItems?.length > 6 ? (
                    <div className="mt-3   text-center">
                      <p
                        className="text-sm bg-white rounded-[6px] border-[#EEEEEE] text-[#EA3358] font-normal p-3 cursor-pointer"
                        onClick={() => router.push(`/${receipt.id}`)}
                      >
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
};

export default Receiptdetail;
