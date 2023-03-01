import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuthContext from "../hooks/useAuth";

const ItemTags = ({
  id,
  tag,
  setSelectedColor,
  setComponent,
  setSelectText,
  component,
}) => {
  const [color, setColor] = useState("#FFFF");
  const [idComponent, setIdComponent] = useState(null);
  const [text, setText] = useState(localStorage.getItem(tag) === 'true' ? '#FFFF' : 'base-content');
  const [svgClass, setSvgClass] = useState(localStorage.getItem(tag) === 'true' ? '#2D007A' : '#FFFF');


  const router = useRouter();

  useEffect(() => {
    setSelectedColor(color);
    setComponent(idComponent);
    setSelectText(text);
  }, [color, idComponent, text, setComponent, setSelectedColor, setSelectText]);
  const RouteTag = () => {
    router.push({
      pathname: "/receiptdetails",
      query: { tags: tag },
    });
  };

  return (
    <div className="flex flex-row w-2/12">
      <div
        className="mr-[70px]"
        // onClick={() => {
        //   if (color === "#2D007A") {
        //     setColor("#FFFF");
        //     setIdComponent(id);
        //     setText("base-content");
        //   } else {
        //     setColor("#2D007A");
        //     setIdComponent(id);
        //     setText("[#FFFFF]");
        //   }
        // }}


        onClick={() => {
          if (localStorage.getItem(tag) === 'true') {
            setColor("#FFFF");
            setIdComponent(id);
            setText("base-content");
            localStorage.setItem(tag, false)
            setSvgClass('#FFFF')
          } else {
            setColor("#2D007A");
            setIdComponent(id);
            setText("[#FFFFF]");
            localStorage.setItem(tag, true)
            setSvgClass('#2D007A')
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="20"
          fill={svgClass}
          viewBox="0 0 22 20"
          className={svgClass}
        >
          <path
            stroke="#262626"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 1C3.239 1 1 3.216 1 5.95c0 2.207.875 7.445 9.488 12.74a.985.985 0 001.024 0C20.125 13.395 21 8.157 21 5.95 21 3.216 18.761 1 16 1s-5 3-5 3-2.239-3-5-3z"
          ></path>
        </svg>
      </div>
      <div
        className={`badge badge-lg mr-2 text-regular text-${text} cursor-pointer `}
        key={id}
        style={{ backgroundColor: `${svgClass}` }}
        onClick={() => {
          RouteTag();
        }}
      > 
        #{tag}
      </div>
    </div>
  );
};

const ItemTagsDashboard = ({ id, tag, selectColor, component, selectText }) => {
  let color;
  const router = useRouter();
  const RouteTag = () => {
    router.push({
      pathname: "/receiptdetails",
      query: { tags: tag },
    });
  };
  if (component === id) {
    color = "#F8EAFE";
    selectText = "base-content";
  }

  return (
    <div
      className={`badge badge-outline badge-lg mr-2 text-regular !text-${selectText} cursor-pointer`}
      key={id}
      style={{ backgroundColor: `${color}` }}
      onClick={() => {
        RouteTag();
      }}
    >
      {window.localStorage.getItem('bgColor')}
      #{tag}
    </div>
  );
};

const Tags = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectColor, setSelectedColor] = useState("");
  const [selectText, setSelectText] = useState("");
  const [component, setComponent] = useState("");
  const [tag, setTag] = useState([]);
  const [input, setInput] = useState("");
  const router = useRouter();
  const AuthContext = useAuthContext();

  const removeItem = (id) => {
    setTag(tag.filter((item) => id !== tag.indexOf(item)));
  };

  useEffect(() => {
    setTimeout(() => {
      // setInput("");
    }, 5000);
  });

  useEffect(() => {
    const getTags = async () => {
      try {
        if (AuthContext?.encodedToken) {
          const header = {
            headers: {
              "x-api-key": AuthContext?.apiKey,
              Authorization: "Bearer " + AuthContext?.encodedToken,
            },
          };
          const newsRes = await fetch(
            `${process.env.IHR_BASE_URL}/tags`,
            header
          ).then((response) => response.json());
          setTag(newsRes.itemsList);
        }
      } catch (error) {
        console.log("TAGS: Error newsRes");
      }
    };
    getTags();
  }, [AuthContext?.encodedToken, AuthContext?.apiKey]);

  return (
    <div className="card w-12/12 bg-base-100 w-full mtl">
      <div className="card-body">
        <h1 className="card-title justify-between">
          <div>
            <span className="text-2xl">Tags</span>
            <span
              className="tooltip tooltip-right align-super text-sm"
              data-tip="Tap on a tag to browse all the receipts containing it. "
            >
              &#9432;
            </span>
          </div>
          <div className="card-actions">
            <label
              className="modal-button text-base cursor-pointer"
              onClick={() => router.push("/receiptdetails")}
            >
              View All
            </label>
          </div>
        </h1>

        <input type="checkbox" id="tags-modal" className="modal-toggle" />

        <label htmlFor="tags-modal" className="modal cursor-pointer">
          <label
            className="modal-box relative h-full w-11/12 max-w-7xl mt-[100px] overflow-hidden"
            htmlFor=""
          >
            <label
              htmlFor="tags-modal"
              className="modal-button btn btn-circle btn-sm absolute right-2"
            >
              ✕
            </label>

            <h1 className="text-2xl font-bold">
              Tags
              <span
                className="tooltip tooltip-right align-super text-base"
                data-tip="Tap on a tag to browse all the receipts containing it. "
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
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setInput(event.target.value);
                }}
                className="relative w-full rounded border bg-white px-3 py-3 pl-10 text-lg placeholder-slate-300 outline-none focus:outline-none focus:ring"
                value={input}
              />
            </div>

            <div className="flex text-left">
              <main className="h-3/4 !w-full">
                <div className="w-100 max-h-screen overflow-y-auto">
                  <table className="table w-full">
                    <thead className="block">
                      <tr>
                        <th className="w-2/12">
                          Favorite <label className="m-[30px]">Name</label>{" "}
                        </th>
                        <th className="w-2/12">Category</th>
                        <th className="w-2/12 text-center">
                          Items
                          <span className="bold brightness-150">&uarr;</span>
                        </th>
                        <th className="w-2/12 text-center">
                          Last Used
                          <span className="bold brightness-150">&darr;</span>
                        </th>
                        <th className="w-2/12 text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="block h-full overflow-y-auto overflow-x-hidden">
                      {tag && tag.length > 0 ? (
                        <>
                          {tag
                            ?.filter((item) => {
                              if (searchTerm === "") {
                                return item;
                              } else if (
                                item
                                  .toLocaleLowerCase()
                                  .includes(searchTerm.toLocaleLowerCase())
                              ) {
                                return item;
                              }
                            })
                            .map(function (tags, id) {
                              return (
                                <tr key={id}>
                                  <td className="w-1/12">
                                    <ItemTags
                                      tag={tags}
                                      id={id}
                                      setSelectedColor={setSelectedColor}
                                      setComponent={setComponent}
                                      setSelectText={setSelectText}
                                      component={component}
                                    />
                                  </td>
                                  <td className="w-[227px]">
                                    category for tagname
                                  </td>
                                  <td className="text-center font-mono w-[227px]">
                                    nn
                                  </td>
                                  <td className="text-center font-mono w-[227px]">
                                    mm-dd-yyyy
                                  </td>
                                  <td
                                    className="flex justify-center text-center w-[227px]"
                                    // onClick={() => removeItem(id)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      fill="#33333"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#33333"
                                        d="M5 11H19V13H5z"
                                      ></path>
                                    </svg>
                                  </td>
                                </tr>
                              );
                            })}
                        </>
                      ) : (
                        <>
                          <label>You dont have any tag</label>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </main>
            </div>
          </label>
        </label>
        <div>
          <div className="flex w-[96%]">
            {tag && tag.length > 0 ? (
              <div className="mb-4 flex flex-rows">
                {tag?.slice(0, 18).map((tag, id) => (
                  <ItemTagsDashboard
                    key={id}
                    tag={tag}
                    id={id}
                    selectColor={selectColor}
                    component={component}
                    selectText={selectText}
                  />
                ))}
                <label
                  htmlFor="tags-modal"
                  className="modal-button flex flex-grow cursor-pointer justify-end"
                >
                  <svg
                    className=""
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 14C17.4696 14 16.9609 13.7893 16.5858 13.4142C16.2107 13.0391 16 12.5304 16 12C16 11.4696 16.2107 10.9609 16.5858 10.5858C16.9609 10.2107 17.4696 10 18 10C18.5304 10 19.0391 10.2107 19.4142 10.5858C19.7893 10.9609 20 11.4696 20 12C20 12.5304 19.7893 13.0391 19.4142 13.4142C19.0391 13.7893 18.5304 14 18 14ZM12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14ZM6 14C5.46957 14 4.96086 13.7893 4.58579 13.4142C4.21071 13.0391 4 12.5304 4 12C4 11.4696 4.21071 10.9609 4.58579 10.5858C4.96086 10.2107 5.46957 10 6 10C6.53043 10 7.03914 10.2107 7.41421 10.5858C7.78929 10.9609 8 11.4696 8 12C8 12.5304 7.78929 13.0391 7.41421 13.4142C7.03914 13.7893 6.53043 14 6 14Z"
                      fill="#343434"
                    />
                  </svg>
                </label>
              </div>
            ) : (
              <>
                <label>You dont have any tag</label>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tags;
