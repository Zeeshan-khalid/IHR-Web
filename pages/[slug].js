import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import HashLoader from "react-spinners/HashLoader";
import Navbar from "./navbar";
import Caution from "./icons/Caution";
import axios from "axios";
import useAuthContext from "../hooks/useAuth";
import Draft, { ContentState } from "draft-js";
import Datetimepicker from "./components/Datetimepicker";
import PaymentModal from "./components/PaymentModal";
import { isValidUrl } from "../utils/helpers";
import TagsModal from "./components/TagsModal";

const { CompositeDecorator, Editor, EditorState } = Draft;

export async function getServerSideProps(context) {
  const id = context.params.slug;
  return { props: { id } };
}

const Details = ({ id }) => {
  const router = useRouter();
  const [loading, setloading] = useState(true);
  const [data, setData] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [products, setProducts] = useState([]);
  const [date, setDate] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [saved, setSaved] = useState(false);
  const [noImage, setnoImage] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modal, setModal] = useState("invisible");
  const [tag, setTag] = useState([]);
  const [notes, setNotes] = useState("");
  const [addItems, setAddItems] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [cardId, setCardId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [src, setSrc] = useState("/images/macrodebitcard.svg");
  const [modal2, setModal2] = useState("invisible");
  const [modalId, setModalId] = useState("");
  const [tagModal, setTagModal] = useState([]);
  const [modalSearch, setModalSearch] = useState("");
  const [tooltip, setTooltip] = useState("close");
  const [show, setShow] = useState("invisible");
  const blankItem = {
    productName: "",
    description: "",
    notes: "",
    quantity: 1,
    pricePerUnit: 0,
    unit: 1,
    price: 0,
    categoryId: null,
    categoryName: null,
    blinkCategory: null,
    imgUrl: null,
    tags: null,
    index: products && products?.length + 1,
    productSKU: Math.floor(1000000000 * Math.random()).toString(),
    upc: Math.floor(1000000000 * Math.random()).toString(),
  };


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
        if (AuthContext?.encodedToken) {
          if (router.query.update) {
            setIsUpdate(true);
          }
          fetchData();
        }
      } catch (error) {
        console.log("SLUG: Error");
        console.log(error);
      }
    };
    getReceipt();
  }, [AuthContext?.encodedToken]);



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

  useEffect(() => {
    if (noImage === true) {
      setIsUpdate(false);
      setTimeout(() => {
        setnoImage(false);
      }, 5000);
    }

    if (saved === true) {
      setIsUpdate(false);
      setTimeout(() => {
        setSaved(false);
      }, 5000);
    }
  }, [saved, noImage]);

  useEffect(() => {
    if (modalSearch === "") {
      setShow("invisible");
    }
  }, [modalSearch]);

  const fetchData = async () => {
    var header = {
      headers: {
        "Content-Type": "application/json",
        bundleid: "com.ihatereceipts.web",
        "x-api-key": AuthContext?.apiKey,
        Authorization: "Bearer " + AuthContext?.encodedToken,
      },
    };

    const newsRes = await fetch(
      `${process.env.IHR_BASE_URL}/receipts/${id}`,
      header
    ).then((response) => response.json());

    setData(newsRes);
  };

  /**
   * DELETE receipt fetch endpoint
   */
  const onDelete = async () => {
    await fetch(`${process.env.IHR_BASE_URL}/receipts/${id}`, {
      method: "DELETE",
      headers: {
        bundleid: "com.ihatereceipts.web",
        "x-api-key": AuthContext?.apiKey,
        Authorization: "Bearer " + AuthContext?.encodedToken,
      },
    })
      .then(() => router.push("/home"))
      .catch((error) => console.log(error));
  };

  const update = async () => {

    const duplicateElements = toFindDuplicates(tag);
    if (duplicateElements?.length > 0) {
      tag.pop();
    }
    let newData;
    new Promise((resolve) => {
      resolve(
        (newData = {
          merchant: {
            name: data.merchant.name,
            street: data.merchant.street,
            secondaryAddress: data.merchant.secondaryAddress,
            city: data.merchant.city,
            state: data.merchant.state,
            zip: data.merchant.zip,
            phoneNumber: data.merchant.phoneNumber,
          },
          transactionDate: date,
          location: {
            lat: data.location?.lat,
            lng: data.location?.lng,
          },
          lineItems: products,
          transactionSubtotal: subtotal,
          tax: tax,
          transactionTotal: total,
          tip: data.tip,
          transactionGrandTotal: total,
          currency: data.currency,
          payment: {
            paymentTypeId: cardId,
            cardNumber: cardNum,
          },
          barcode: data.barcode,
          receiptType: data.receiptType,
          notes: notes,
          tags: tag,
          categoryId: data.categoryId,
          categoryName: data.categoryName,
          vaults: data.vaults,
          receiptMetadata: data.receiptMetadata,
          processingStatus: data.processingStatus,
          imagesUploadStatus: data.imagesUploadStatus,
          isTrashed: data.isTrashed,
        })
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
          body: JSON.stringify(newData),
        }
      )
        .then((response) => response.json())
        .catch((err) => {
          throw err;
        });
      setSaved(true);
      fetchData();
    });
  };

  const updateField = (index, type) => (e) => {
    const newArr = products?.map((item, i) => {
      if (index === i) {
        if (type === "description") {
          return { ...item, description: e.target.value };
        } else if (type === "notes") {
          return { ...item, notes: e.target.value };
        } else if (type === "price") {
          return {
            ...item,
            price: parseFloat(Number(e.target.value)).toFixed(2),
          };
        } else {
          return item;
        }
      } else {
        return item;
      }
    });
    setProducts(newArr);
  };

  const selectionItems = (event) => {
    const isSelectedAll = event.target.checked || false;
    if (isSelectedAll) {
      setSelectedItems(data?.lineItems);
    } else {
      setSelectedItems([]);
    }
  };

  const onSelectItem = (event, lineItems) => {
    let allElements = [...selectedItems];
    if (event.target.checked) {
      allElements.push(lineItems);
    } else {
      allElements = allElements.filter((item) => item !== lineItems);
    }
    setSelectedItems(allElements);
  };

  const deleteSingleItem = async (itemIndex) => {
    try {
      await fetch(
        `${process.env.IHR_BASE_URL}/receipts/${id}/items`,
        {
          method: "DELETE",
          headers: {
            bundleid: "com.ihatereceipts.web",
            "Content-Type": "application/json",
            "x-api-key": AuthContext?.apiKey,
            Authorization: "Bearer " + AuthContext?.encodedToken,
          },
          body: JSON.stringify({
            items: [itemIndex],
          }),
        }
      );
    } catch (error) {
      console.log("DELETE SINGLE ITEM");
      console.log(error);
    } finally {
      fetchData();
    }
  };

  /** Share receipt data */
  const shareReceipt = () => {
    /** When is selected just one receipt to share*/
    let newString = `${data.shortId}?a=1|0|0`;
    const encodedString = Buffer.from(newString).toString("base64");
    router.push(
      "https://share.staging.receiptserver.com/s/" +
      encodeURIComponent(encodedString)
    );
  };

  /** Share item data a*/
  const shareItem = (id) => {
    /** When is selected just one receipt to share*/
    let newString = `${data.shortId}?li=${id}`;
    const encodedString = Buffer.from(newString).toString("base64");
    router.push(
      "https://share.staging.receiptserver.com/s/" +
      encodeURIComponent(encodedString)
    );
  };

  /** POST Export PDF/CSV  */
  async function exportReceipt(exportType) {
    let ids = {
      receiptsIds: [id],
    };
    const resp = await fetch(
      `${process.env.IHR_BASE_URL}/receipts/pdf?exportType=${exportType}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": AuthContext?.apiKey,
          Authorization: "Bearer " + AuthContext?.encodedToken,
        },
        body: JSON.stringify(ids),
      }
    )
      .then((response) => response.json())
      .catch((error) => {
        throw error;
      });
    router.push(resp.message);
  }

  const viewOriginalReceipt = async () => {
    let newString = `${data.shortId}?a=1|0|0`;
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


    if (url == undefined) {
      setModal("invisible");
      setnoImage(true)
    } else {
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
    }





  };

  const handleChange = (editorState) => {
    setEditorState(editorState);
    const tags = editorState
      .getCurrentContent()
      .getPlainText("\u0001")
      .match(/#(\w+)/g);
    setNotes(editorState.getCurrentContent().getPlainText("\u0001"));
    if (tags) {
      setTag(tags.filter((tag) => tag).map((tag) => tag.substring(1)));
    }

    const duplicateElements = toFindDuplicates(tag);
    if (duplicateElements?.length > 0) {
      setTooltip("open");
      setIsUpdate(false);
      tag.pop();
    } else {
      setIsUpdate(true);
      setTooltip("close");
    }
  };

  const toFindDuplicates = (tag) =>
    tag?.filter((item, index) => tag.indexOf(item) !== index);

  const input = useRef(null);

  const onInputClick = () => {
    input.current.focus();
  };

  const handleCheck = (event, type, selectedValue) => {
    if (type === "tagModal") {
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

  useEffect(() => {
    if (isUpdate && isOrdering) {
      const orginalProducts = [...products];
      let orderedProducts = [];
      let newIndex = 1;
      orginalProducts.map((item) => {
        item = { ...item, ...{ index: newIndex } };
        newIndex++;
        orderedProducts.push(item);
      });
      setIsOrdering(false);
      setProducts(orderedProducts);
    }
    if (products.length) {
      const pricesArray = products?.map(item => item.price);
      const subtotalupdated = pricesArray.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue));
      setSubtotal(subtotalupdated);
      setTotal(parseFloat(subtotalupdated) + parseFloat(tax));

      setTotal(parseFloat(subtotalupdated) + parseFloat(tax));

    }
  }, [products, isOrdering, isUpdate, tax]);

  const deleteSingleItemOnEdit = (itemIndex) => {
    setIsOrdering(true);
    setProducts((item) => item.filter((item) => item.index !== itemIndex));
  };

  const addSingleItemOnEdit = () => {
    // setAddItems(true);
    let newsProducts = [...products];
    newsProducts.push(blankItem);
    setProducts(newsProducts);
  };

  const discardChanges = () => {
    setProducts(data.lineItems);
  };

  const handleClick = (id) => {
    setCardId(id);
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
        <meta name="description" content="I hate receipt" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? (
        <div className="loader">
          <HashLoader color={"#F37A24"} loading={loading} size={80} />
        </div>
      ) : (
        <main>
          <Navbar type={"/receipt"} route={"/receiptdetails"} />
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
                        className="h-5 w-5 relative top-[5px] left-[5px]"
                      >
                        <path
                          fill="#2D007A"
                          d="M5.583 3.833a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zm0 0a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zm17.395 7.677l-10.5-10.5a2.333 2.333 0 00-1.644-.677H2.667A2.333 2.333 0 00.333 2.667v8.166a2.333 2.333 0 00.689 1.657l.478.467a6.556 6.556 0 012.427-.864l-1.26-1.26V2.667h8.166l10.5 10.5-8.166 8.166-1.26-1.26a6.499 6.499 0 01-.864 2.427l.479.478a2.334 2.334 0 001.645.689 2.333 2.333 0 001.645-.689l8.167-8.166a2.333 2.333 0 00.688-1.645 2.33 2.33 0 00-.689-1.657zM5.584 3.833a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5zm4.084 16.334h-3.5v3.5H3.834v-3.5h-3.5v-2.334h3.5v-3.5h2.333v3.5h3.5v2.334z"
                        ></path>
                      </svg>
                    </label>
                  </div>
                  <div
                    className={`w-screen h-screen fixed z-[900000000] ${modal2} top-0 left-0`}
                    onClick={() => setModal2("invisible")}
                  ></div>
                  {modal2 === "visible" && modalId === id ? (
                    <div
                      className={`block fixed z-[900000001] w-[500px] h-[400px] bg-white shadow top-[30%] left-[20%] rounded-xl`}
                    >
                      <div className="flex justify-between p-5 rounded">
                        <p className="text-xl font-bold">Add Tags</p>
                        <h3
                          className="text-md text-[#EA3358] font-bold cursor-pointer"
                          onClick={() => {
                            update();
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
                        <div className="relative text-gray-600 focus-within:text-gray-400 ml-3 mr-3 mb-5">
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
                              if (!data.tags.includes(event.target.value)) {
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
                      </div>
                      <div className="block h-[300px] max-h-[300px] overflow-y-auto overflow-x-hidden">
                        {data?.tags
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
                            if (data.tags === null) {
                              data.tags = [];
                              setNotes("");
                              data.tags.push(modalSearch);
                              data.notes += ` #${modalSearch} `;
                              setNotes(data.notes);
                            } else {
                              data.tags.push(modalSearch);
                              data.notes += ` #${modalSearch} `;
                              setNotes(data.notes);
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
                </div>
                <div className="mt-4">
                  <h3 className="font-bold text-xl">Notes</h3>
                  <div
                    onClick={onInputClick}
                    className="form-control border-[1px] h-[90px] rounded mt-[10px] p-[10px]"
                  >
                    <div
                      className={`tooltip tooltip-${tooltip} tooltip-secondary`}
                      data-tip="this tag already exists"
                    >
                      {" "}
                    </div>
                    <Editor
                      editorState={editorState}
                      onChange={(editorState) => handleChange(editorState)}
                      spellCheck={true}
                      ref={input}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 padding">


                <p className="text-lg text-[#B4B4B4] font-medium mb-2">
                  Payment method
                </p>
                {isUpdate === true ? (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-lg text-[#B4B4B4]">Method</p>

                      <>
                        <PaymentModal
                          handleClick={handleClick}
                          cardName={cardName}
                        />
                      </>
                    </div>
                    {data.payment ? <div className="flex items-center justify-between mb-12">
                      <p className="text-lg text-[#B4B4B4]">4CC</p>

                      <input
                        className="text-3xl text-[#B4B4B4] border-b-[1px] w-3/4 ml-2 text-right"
                        defaultValue={data?.payment.cardNumber}
                        onChange={(e) => setCardNum(e.target.value)}
                        style={{ borderBottomColor: "#9E9E9E" }}
                      ></input>
                    </div> : ""}

                  </>
                ) : (
                  <>
                    <Image
                      alt=""
                      loading="eager"
                      width="258"
                      height="163"
                      src={src}
                    />
                  </>
                )}

                {data ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg text-[#B4B4B4]">Subtotal</p>
                      {isUpdate === true ? (
                        <input
                          className="text-3xl text-[#B4B4B4] border-b-[1px] w-3/4 ml-2 text-right"
                          defaultValue={parseFloat(
                            data?.transactionSubtotal
                            // subtotal
                          ).toFixed(2)}
                          onChange={(e) => setSubtotal(parseFloat(e.target.value))}
                          style={{ borderBottomColor: "#9E9E9E" }}
                        ></input>
                      ) : (
                        <p className="text-3xl text-[#B4B4B4]">
                          ${parseFloat(data.transactionSubtotal).toFixed(2)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-lg text-[#B4B4B4]">Tax</p>
                      {isUpdate === true ? (
                        <input
                          className="text-3xl text-[#B4B4B4] border-b-[1px] w-3/4 ml-2 text-right"
                          defaultValue={parseFloat(data?.tax).toFixed(2)}
                          onChange={(e) => setTax(parseFloat(e.target.value))}
                          style={{ borderBottomColor: "#9E9E9E" }}
                        ></input>
                      ) : (
                        <p className="text-3xl text-[#B4B4B4]">
                          ${parseFloat(data?.tax).toFixed(2)}
                        </p>
                      )}
                    </div>

                    <hr />

                    <div className="flex items-center justify-between">
                      <p className="text-lg text-[#000]">Total</p>
                      {/* {isUpdate === true ? (
                        <input
                          className="text-3xl font-bold text-[#000] border-b-[1px] w-3/4 ml-2 text-right"
                          defaultValue={parseFloat(data?.transactionTotal).toFixed(
                            2
                          )}
                          onChange={(e) => setTotal(parseFloat(e.target.value))}
                          style={{ borderBottomColor: "#9E9E9E" }}
                        ></input>
                      ) : ( */}
                      <p className="text-3xl font-bold text-[#000]">

                        ${(parseFloat(data?.transactionSubtotal) + parseFloat(data?.tax)).toFixed(2)}
                      </p>
                      {/* )} */}
                    </div>
                  </div>
                ) : (<p>Loading.....</p>)}
              </div>
            </div>
          </div>
          {data?.lineItems.length ?
            <div className="px-12 relative bottom-8 mb-[60px]">
              <div className="gap-4 mt-4 columns-5 text-center sharedetail flex items-center">
                <div
                  className="flex items-center cursor-pointer border-r-2 justify-center w-1/5"
                  onClick={() => setIsUpdate(true)}
                >
                  <div className="-space-x-5 avatar-group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <p className="text-regular">Edit Receipt</p>
                  </div>
                </div>

                <div
                  className="border-r-2 justify-center w-1/5 flex items-center cursor-pointer"
                  onClick={shareReceipt}
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
                  className="flex items-center cursor-pointer border-r-2 justify-center w-1/5"
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
                        Are you sure to delete this receipt?
                      </h3>
                    </div>

                    <label className="py-4">
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

                <div className="flex items-center">
                  <Image
                    alt=""
                    loading="eager"
                    width="4"
                    height="15"
                    src="/images/doted.png"
                  />
                  <span className="ml-3  top-[-3px]">
                    <span className="dropdown dropdown-end cursor-pointer">
                      <label tabIndex="1">
                        <p className="flex">More Actions</p>
                      </label>
                      <div
                        tabIndex="1"
                        className="mt-3 card card-compact dropdown-content w-60 bg-base-100 shadow"
                      >
                        <div
                          className="card-body cursor-pointer"
                          onClick={() => exportReceipt("PDF")}
                        >
                          <div className="flex items-center pb-4">
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
                              <p className="text-sm">Export to PDF</p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="card-body cursor-pointer"
                          onClick={() => exportReceipt("CSV")}
                        >
                          <div className="flex items-center pb-4">
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
                              <p className="text-sm">Export to CSV</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                  </span>
                </div>
              </div>
              <hr />
              <h2 className="text-3xl font-bold mt-3">
                Items
                <div className="badge p-1 border-none zeebadge">
                  {products?.length}
                </div>
              </h2>
              <div className="w-full mt-4 sharedetailtable">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={selectedItems.length === products?.length}
                            onChange={selectionItems}
                          />
                        </label>
                      </th>
                      <th>PHOTO</th>
                      <th>DESCRIPTION</th>
                      <th>NOTE AND TAGS</th>
                      <th className="text-center">PRICE</th>
                      <th className="text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map(function (lineItems, id) {
                      return (
                        <tr key={lineItems?.index}>
                          <th>
                            <label>
                              <input
                                type="checkbox"
                                className="checkbox"
                                checked={selectedItems.includes(lineItems)}
                                onChange={(event) => {
                                  onSelectItem(event, lineItems);
                                }}
                              />
                            </label>
                          </th>
                          <td>
                            <div className="flex items-center space-x-3">
                              {isUpdate === true ? (
                                <Image
                                  alt="modo edit"
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
                              ) : (
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
                              )}
                            </div>
                          </td>
                          <td>
                            {isUpdate === true ? (
                              <input
                                className="border-b-[1px] w-3/4 ml-2"
                                defaultValue={lineItems.description}
                                style={{ borderBottomColor: "#9E9E9E" }}
                                onChange={updateField(id, "description")}
                              ></input>
                            ) : (
                              <h3 className="text-sm">{lineItems.description}</h3>
                            )}
                          </td>
                          <td>
                            {isUpdate === true ? (
                              <input
                                className="border-b-[1px] w-3/4 ml-2"
                                defaultValue={lineItems.notes}
                                style={{ borderBottomColor: "#9E9E9E" }}
                                onChange={updateField(id, "notes")}
                              ></input>
                            ) : (
                              <h3 className="text-sm">{lineItems.notes}</h3>
                            )}
                          </td>
                          <th>
                            <div className="text-center">
                              {isUpdate === true ? (
                                <input
                                  type="number"
                                  className="text-lg font-bold border-b-[1px] w-1/2 text-center"
                                  defaultValue={parseFloat(
                                    lineItems.price
                                  ).toFixed(2)}
                                  style={{ borderBottomColor: "#9E9E9E" }}
                                  onChange={updateField(id, "price")}
                                ></input>
                              ) : (
                                <span className="text-lg font-bold">
                                  ${parseFloat(lineItems.price).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </th>
                          <td className="text-center">
                            <div>
                              <span className="dropdown dropdown-end">
                                <label tabIndex="1">
                                  <div className="flex">
                                    <Image
                                      alt=""
                                      loading="eager"
                                      width="30"
                                      height="30"
                                      src="/images/3dots.svg"
                                    />
                                  </div>
                                </label>
                                <div
                                  tabIndex="1"
                                  className="mt-3 card card-compact dropdown-content w-60 bg-base-100 shadow z-[2]"
                                >
                                  <div className="card-body">
                                    <div
                                      className="flex items-center notify pb-4 mt-3 cursor-pointer"
                                      onClick={() => shareItem(lineItems.index)}
                                    >
                                      <div className="-space-x-5 avatar-group">
                                        <Image
                                          alt=""
                                          loading="eager"
                                          width="18"
                                          height="18"
                                          src="/images/share.png"
                                        />
                                      </div>
                                      <div className="ml-3">
                                        <p className="text-sm">Share</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center pb-4 mt-3">
                                      <div className="-space-x-5 avatar-group">
                                        <Image
                                          alt=""
                                          loading="eager"
                                          width="20"
                                          height="20"
                                          src="/images/delete.png"
                                        />
                                      </div>
                                      <div
                                        className="ml-3 cursor-pointer"
                                        onClick={() => {
                                          if (isUpdate) {
                                            deleteSingleItemOnEdit(
                                              lineItems.index
                                            );
                                          } else {
                                            deleteSingleItem(lineItems.index);
                                          }
                                        }}
                                      >
                                        <p className="text-sm">Remove Item</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {isUpdate === true && addItems === false && (
                  <div className="flex h-[100px] w-full border-dashed border-2 border-primary">
                    <div className="w-full h-full flex justify-center items-center border-2 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#2D007A"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <label
                        className="text-primary cursor-pointer"
                        onClick={() => addSingleItemOnEdit()}
                      >
                        Add new item
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            : ""}


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
          {isUpdate === true ? (
            <div className="alert shadow-lg fixed bottom-4 z-[11]">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-primary flex-shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>You have unsaved changes</span>
              </div>
              <div className="flex-none">
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => {
                    setIsUpdate(false);
                    setAddItems(false);
                    discardChanges();
                  }}
                >
                  Discard
                </button>
                <button
                  className="btn btn-sm btn-primary text-white"
                  onClick={() => {
                    update();
                    setIsUpdate(false);
                    setAddItems(false);
                  }}
                >
                  Save changes
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
          {saved === true ? (
            <>
              <div className="alert bg-base-200 text-success-content shadow-lg fixed bottom-4 z-50">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="14"
                    fill="none"
                    viewBox="0 0 20 14"
                  >
                    <path
                      fill="currentColor"
                      d="M7.083 10.175l-4.27-4.106a1.654 1.654 0 00-.534-.344 1.707 1.707 0 00-1.796.344c-.31.297-.483.7-.483 1.12 0 .42.174.823.483 1.12l5.436 5.225c.153.147.334.265.534.345a1.7 1.7 0 001.797-.345L19.507 2.712c.155-.146.279-.32.363-.513a1.531 1.531 0 00-.352-1.735 1.654 1.654 0 00-.537-.344 1.706 1.706 0 00-1.267.004c-.2.08-.382.2-.535.348L7.083 10.175z"
                    ></path>
                  </svg>
                  <span>Your changes have been successfully saved!</span>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}


          <div>
            {noImage === true ? (
              <>
                <div className="alert justify-center bg-red-100 text-red-500 bg-base-200 shadow-lg fixed bottom-4 z-50">
                  <div>
                    {/* <svg class="fill-current h-5 w-5 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg> */}
                    <span class="font-bold">Notice!</span>
                    <span >This receipt doesn't have an image!</span>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
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
    fontFamily: "'Helvetica', sans-serif",
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

export default Details;
