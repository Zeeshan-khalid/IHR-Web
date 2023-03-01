import Head from "next/head";
import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import Navbar from "./navbar";
import Footer from "./footer";
import PaymentType from "./paymenttype";
import Merchant from "./merchants";
import Favorite from "./Favorite";
import Purchase from "./purchaseinsight";
import Slideshow from "./slideshow";
import Link from "next/link";
import background from "./../public/images/background-news.png";
import Image from "next/image";
import Tags from "./tags";
import Receipts from "./receipts";
import DashboardAddReceipts from "./components/DashboardAddReceipts";
import useAuthContext from "../hooks/useAuth";
import { useRouter } from "next/router";

export default function Home({ News, banner }) {
  const [loading, setloading] = useState(true);
  const [receipt, setReceipt] = useState([]);
  const AuthContext = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const getReceipts = async () => {
      try {
        if (AuthContext?.encodedToken) {
          const header = {
            headers: {
              "x-api-key": AuthContext?.apiKey,
              Authorization: "Bearer " + AuthContext?.encodedToken,
            },
          };
          const newsRes = await fetch(
            `${process.env.IHR_BASE_URL}/receipts?offset=0&limit=9`,
            header
          ).then((response) => response.json());
          setReceipt(newsRes);
        }
      } catch (error) {
        console.log("HOME: Error newsRes");
      }
    };
    getReceipts();
  }, [AuthContext?.encodedToken, AuthContext?.apiKey]);

  return (
    <div>
      <Head>
        <title>I Hate Receipt</title>
        <meta name="description" content="I hHte receipt" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? (
        <div className="loader">
          <HashLoader color={"#F37A24"} loading={loading} size={80} />
        </div>
      ) : (
        <main>
          <Navbar News={News} type={"home"} route={"/"} />
          <div className="main">
            <div>
              <h1 className="text-2xl font-bold my-4">News and Offers</h1>
            </div>
            <div className="grid grid-cols-2 gap-2 my-4 newsoffer ">
              <div className="grid items-center">
                {banner?.slice(0, 1).map(function (banner, id) {
                  return (
                    <div className="grid grid-cols-2 gap-2" key={id}>
                      <div>
                        {banner.imageUrl ? (
                          <Image
                            alt=""
                            loading="eager"
                            height="228"
                            width="262"
                            src={background}
                            className="rounded-[15px]"
                          />
                        ) : (
                          <Image
                            alt=""
                            loading="eager"
                            height="228"
                            width="262"
                            src="/images/noimage.jpg"
                            className="rounded-[15px]"
                          />
                        )}
                      </div>
                      <div className="text-white desc" key={id}>
                        {banner.subtitle ? (
                          <h2 className="text-lg font-semibold w-[60%] truncate">
                            {banner.subtitle}
                          </h2>
                        ) : (
                          <h2 className="text-lg font-semibold"></h2>
                        )}
                        {banner.title ? (
                          <p>{banner.title.slice(0, 500)}</p>
                        ) : (
                          <p></p>
                        )}
                        <span>
                          <Link id="link" href={banner.buttonUrl}>
                            Read More
                          </Link>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div>
                <Slideshow banner={banner} />
              </div>
            </div>
            {/* {receipt?.length > 0 ? (<p>Print everything</p>) : (receipt?.length == '' ? (<p>print nothing</p>): '')} */}

       


            {receipt?.length > 0 ? (
              <>
                <div className="flex justify-center">
                  <Tags />
                </div>

                <div className="flex justify-center mt-4">
                  <Receipts receipt={receipt} />
                </div>

                <div className="flex justify-center mt-4">
                  <div className="card w-6/12 text-center">
                    <PaymentType />
                  </div>

                  <div className="card w-6/12 text-center">
                    <Merchant />
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Favorite />
                  <Purchase />
                </div>
              </>
            ) : (
              <div className="card bg-base-100 flex justify-center w-full h-[522px]">
                <input type="checkbox" id="uploads" className="modal-toggle" />
                <DashboardAddReceipts />
              </div>
            )}
          </div>
          <Footer />
        </main>
      )}
    </div>
  );
}

export async function getStaticProps() {
  const [BannerRes] = await Promise.all([
    fetch(
      "https://script.google.com/macros/s/AKfycbyr-ColPOypm6Q1LMBTZ1I93g1VrYwRmDOsiERk9unMzpaARTk/exec"
    ),
  ]);

  const [banner] = await Promise.all([BannerRes.json()]);
  return {
    props: { banner },
  };
}



// export async function getStaticProps() {
//   const [NewsRes, BannerRes] = await Promise.all([
//     fetch("https://ihr-cms.herokuapp.com/offers"),
//     fetch(
//       "https://script.google.com/macros/s/AKfycbyr-ColPOypm6Q1LMBTZ1I93g1VrYwRmDOsiERk9unMzpaARTk/exec"
//     ),
//   ]);

//   const [News, banner] = await Promise.all([NewsRes.json(), BannerRes.json()]);
//   return {
//     props: { News, banner },
//   };
// }