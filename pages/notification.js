import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Footer from "./footer";
import HashLoader from "react-spinners/HashLoader";
import Navbar from "./navbar";

const Notification = (News) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true);
    setTimeout(() => {
      setloading(false);
    }, 1000);
  }, []);

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
          <Navbar type={"notification"} route={"/home"} />
          <div className="receiptdetail container mx-auto px-24 mt-16 mb-16">
            <h1 className="text-3xl font-bold">Notification Vault</h1>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex">
                <div className="relative my-4 w-1/2">
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
                    className="notifyinput relative w-full rounded border bg-white px-3 py-3 pl-10 text-lg placeholder-slate-300 outline-none focus:outline-none focus:ring"
                  />
                </div>
                <div className="notifyicon my-4 ml-3">
                  <Image
                    alt=""
                    loading="eager"
                    width="22"
                    height="22"
                    src="/images/notification.svg"
                  />
                </div>
              </div>

              <div className="text-right my-4">
                <span className="markasread">Mark as read</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <div>
                <p className="mt-lg mb-[10px]">Select All</p>
              </div>
            </div>
            <hr />
            <div className="grid grid-cols-1 gap-1">
                   
              
              
              {News.News.News?.filter((News) => {
                if (searchTerm == "") {
                  return News;
                } else if (
                  News.title
                    .toLocaleLowerCase()
                    .includes(searchTerm.toLocaleLowerCase())
                ) {
                  return News;
                }
              }).map(function (News, id) {
                return (
                  <div className="grid grid-cols-2 gap-2 notifycuspad" key={id}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="checkbox custom-check"
                      />
                      <div className=" mr-3">
                        <Image
                          alt=""
                          loading="eager"
                          width="50"
                          height="50"
                          src="/images/ihrlogo.png"
                        />
                      </div>
                      <div>
                        <h1 className="text-base font-bold">{News.title}</h1>
                        <p className="text-xs font-normal">
                          {News.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#767676] relative top-[-10px]">
                        {News.created_at.slice(0, 11)}
                      </p>
                      <div className="relative top-[25px]">
                        <Image
                          alt=""
                          loading="eager"
                          width="15"
                          height="15"
                          src="/images/chevron.svg"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Footer />
        </main>
      )}
    </div>
  );
};

export default Notification;

export async function getStaticProps() {
  const News = require('./news.json');
  return {
    props: {News},
  };
}




// export async function getStaticProps() {
//   const [NewsRes] = await Promise.all([
//     fetch("https://ihr-cms.herokuapp.com/offers"),
//   ]);

//   const [News] = await Promise.all([NewsRes.json()]);
//   return {
//     props: { News },
//   };
// }
