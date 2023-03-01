import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useAuthContext from "../hooks/useAuth";
const Items = ({ id, item }) => {
  const router = useRouter();
  return (
    <div
      className="badges cursor-pointer"
      key={id}
      onClick={() =>
        router.push({ pathname: "/receiptdetails", query: { merchant: item } })
      }
    >
      <p>{item}</p>
    </div>
  );
};
const Merchant = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [merchant, setMerchant] = useState([]);
  const router = useRouter();
  const AuthContext = useAuthContext();
  useEffect(() => {
    const getMerchant = async () => {
      try {
        if (AuthContext?.encodedToken) {
          const header = {
            headers: {
              "x-api-key": AuthContext?.apiKey,
              Authorization: "Bearer " + AuthContext?.encodedToken,
            },
          };
          const newsRes = await fetch(
            `${process.env.IHR_BASE_URL}/merchants`,
            header
          ).then((response) => response.json());
          setMerchant(newsRes);
        }
      } catch (error) {
        console.log("MERCHANTS: Error newsRes");
      }
    };
    getMerchant();
  }, [AuthContext?.encodedToken, AuthContext?.apiKey]);
  return (
    <div className="">
      <div className="card-body bg-base-100  mtl">
        <h1 className="card-title justify-between">
          <div className="">
            <span className="ml-3 text-2xl">Top Merchants</span>
            <span
              className="tooltip tooltip-right align-super text-sm"
              data-tip="Tap on any merchant to see all the receipts from it."
            >
              &#9432;
            </span>
          </div>
          <div className="card-actions">
            <label
              // htmlFor="merchant"
              className="modal-button text-base cursor-pointer"
              onClick={() => router.push("/receiptdetails")}
            >
              View All
            </label>
          </div>
        </h1>
        <input type="checkbox" id="merchant" className="modal-toggle" />
        <label htmlFor="merchant" className="modal cursor-pointer">
          <label
            className="modal-box relative w-11/12 h-full max-w-7xl mt-[100px]"
            htmlFor=""
          >
            <label
              htmlFor="merchant"
              className="modal-button btn btn-circle btn-sm absolute right-2 top-2"
            >
              ✕
            </label>
            <h1 className="text-2xl font-bold">
              Top Merchants
              <span
                className="tooltip tooltip-right align-super text-sm"
                data-tip="Tap on any merchant to see all the receipts from it."
              >
                &#9432;
              </span>
            </h1>
            <div className="relative my-4 w-full">
              <span className="absolute z-10 w-8 items-center justify-center rounded py-3 pl-3 text-center text-slate-300">
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
            <main className="flex flex-row h-3/4">
              <div className="w-100 max-h-screen overflow-y-auto">
                <div className="overflow-x-auto text-left h-full ">
                  <div className="merchant flex flex-row flex-wrap h-full content-start">
                    {merchant?.itemsList
                      ?.filter((item) => {
                        if (searchTerm == "") {
                          return item;
                        } else if (
                          item
                            .toLocaleLowerCase()
                            .includes(searchTerm.toLocaleLowerCase())
                        ) {
                          return item;
                        }
                      })
                      .map(function (item, id) {
                        return (
                          <div
                            className="badges mr-4 cursor-pointer"
                            key={id}
                            onClick={() =>
                              router.push({
                                pathname: "/receiptdetails",
                                query: { merchant: item },
                              })
                            }
                          >
                            <p>{item}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </main>
            <div className="alert w-[97%] fixed bottom-7 shadow-lg">
              <div>
                <span>&#9432;</span>
                <span>Press on any merchant to get a filtered view.</span>
              </div>
            </div>
          </label>
        </label>
        <div className="flex">
          <div className="merchanttruncate merchant flex flex-row">
            {merchant?.itemsList?.slice(0, 3).map(function (item, id) {
              return <Items key={id} id={id} item={item} />;
            })}
          </div>
          <label
            htmlFor="merchant"
            className="modal-button flex flex-grow cursor-pointer items-end"
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
      </div>
    </div>
  );
};
export default Merchant;
