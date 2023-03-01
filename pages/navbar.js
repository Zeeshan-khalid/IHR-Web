import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AddReceipts from './components/AddReceipts';
import { getAuth } from 'firebase/auth';
import { ref, getStorage, getDownloadURL } from 'firebase/storage';
import useAuthContext from '../hooks/useAuth';
import { isUrlRegex } from '../utils/helpers';
import { News } from './news.json'

const Navbar = ({ type, route }) => {
  const [Notification, setNotification] = useState();
  const [photo, setPhoto] = useState('/images/noimage.jpg');
  const [border, setBorder] = useState('0');
  const auth = getAuth();
  const router = useRouter();
  const AuthContext = useAuthContext();
  const storage = getStorage();

  const isUrl = (url) => {
    return isUrlRegex.test(url);
  }

  const logOut = () => {
    AuthContext.clear().then(() => {
      router.push('/');
    });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/');
      }
    });

    unsubscribe();
  }, [auth, router]);

  

  const changeBorder = () => {
    if (window.scrollY >= 30) {
      setBorder('2px');
    } else {
      setBorder('0');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', changeBorder);
    // async function fetchData() {
    //   const newsRes = await fetch('https://ihr-cms.herokuapp.com/offers').then(
    //     (response) => response.json()
    //   );
    //   setNotification(newsRes);
    // }
    // fetchData();
    setNotification(News)
  }, []);

  useEffect(() => {
    async function renderPhoto() {
      if (AuthContext.user?.avatarPath) {
        if (isUrl(AuthContext.user?.avatarPath)) {
          setPhoto(AuthContext.user?.avatarPath);
        } else {
          const avatarRef = ref(storage, AuthContext.user?.avatarPath);
          const avatarURL = await getDownloadURL(avatarRef);
          setPhoto(avatarURL);
        }
      }
    }
    renderPhoto();
  }, [AuthContext, storage]);

  return (
    <div>
      <nav>
        <div
          className={`navbar bg-base-100 flex justify-around`}
          style={{
            borderBottomWidth: `${border}`,
            borderBottomColor: "#F4F4F4",
          }}
        >
          {type !== "home" ? (
            <div className="flex-1">
              <a
                href={route}
                className="flex text-lg items-center justify-center font-semibold ml-4"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <p className="ml-2">Back</p>
              </a>
            </div>
          ) : (
            <div className="flex-1">
              <a
                href={route}
                className="text-lg items-center justify-center font-semibold ml-4 hidden"
              ></a>
            </div>
          )}

          <div className="flex justify-flext-start pl-[15%] w-1/2  dropdown">
            <Image
              onClick={() => router.push("/home")}
              className="cursor-pointer"
              alt=""
              loading="eager"
              height="45"
              width="100%"
              src="/images/newlogo.png"
            />
            <label tabIndex="0" className="btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#4B4B4B]"
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
            </label>
            <div
              tabIndex="0"
              className="maindropdown mt-5 card card-compact dropdown-content w-80 bg-base-100 shadow right-80 top-10"
            >
              <div className="card-body">
                <div className="mb-3">
                  <p className="font-bold text-xl ml-2">Services</p>
                </div>

                <div
                  className="flex items-center notify pb-4 cursor-pointer"
                  onClick={() => router.push("/receiptdetails")}
                >
                  <div className="ml-2">
                    <label
                      htmlFor="receipt"
                      className="modal-button text-sm cursor-pointer"
                    >
                      <p className="text-sm  font-400">Receipts</p>
                    </label>
                  </div>
                </div>
                <div className="flex items-center notify pb-4 cursor-pointer">
                  <div className="ml-2">
                    <label
                      htmlFor="favorites"
                      className="modal-button text-sm cursor-pointer"
                    >
                      <p className="text-sm font-400">
                        Favorites <em className="text-[#919191] text-xs capitalize font-semibold">Future</em>
                      </p>
                    </label>
                  </div>
                </div>

                <div className="flex items-center notify pb-4 cursor-pointer">
                  <div className="ml-2">
                    <p className="text-sm font-400">
                      Purchase Insights{" "}
                      <em className="text-[#919191] text-xs capitalize font-semibold">Future</em>
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center notify pb-4 cursor-pointer"
                  onClick={() => router.push("/profile")}
                >
                  <div className="ml-2">
                    <p className="text-sm  font-400">Account Info</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-none gap-2">
            <div className="card-actions">
              <label
                htmlFor="uploads"
                className="modal-button btn bg-secondary text-white text-lg"
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
                </svg>{" "}
                Add a Receipt
              </label>
            </div>

            <input type="checkbox" id="uploads" className="modal-toggle" />
            <AddReceipts />

            <button
              className="btn btn-ghost btn-circle"
              onClick={() => router.push("/receiptdetails")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <div className="dropdown dropdown-end">
              <label tabIndex="0" className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#2D007A"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="badge badge-sm indicator-item bg-primary">
                    5
                  </span>
                </div>
              </label>
              <div
                tabIndex="0"
                className="mt-3 card card-compact dropdown-content w-80 bg-base-100 shadow "
              >
                <div className="card-body">
                  <div className="flex">
                    <p className="font-bold text-lg text-xl">Notifications <em className="text-[#919191] text-xs capitalize font-semibold">Future</em></p>
                    <Link href="/notification">
                      <p className="text-right text-[#ea3358] cursor-pointer">
                        View all
                      </p>
                    </Link>
                  </div>

                  {Notification !== "" ? (
                    type === "home" ? (
                      Notification?.slice(0, 5).map((data, id) => {
                        return (
                          <div
                            className="flex items-center notify pb-4"
                            key={id}
                          >
                            <div className="-space-x-5 avatar-group">
                              <div className="avatar">
                                <div className="w-10 h-10">
                                  <Image
                                    alt=""
                                    loading="eager"
                                    width="100%"
                                    height="100%"
                                    src="/images/ihrlogo.png"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-md font-bold newstruncate">
                                {data.title}
                              </p>
                              <p className="newstruncate">{data.description}</p>
                            </div>
                            <div className="ml-8 text-right">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      Notification?.slice(0, 5).map((data, id) => {
                        return (
                          <div
                            className="flex items-center notify pb-4"
                            key={id}
                          >
                            <div className="-space-x-5 avatar-group">
                              <div className="avatar">
                                <div className="w-10 h-10">
                                  <Image
                                    alt=""
                                    loading="eager"
                                    width="100%"
                                    height="100%"
                                    src="/images/ihrlogo.png"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-md font-bold newstruncate">
                                {data.title}
                              </p>
                              <p className="newstruncate">{data.description}</p>
                            </div>
                            <div className="ml-8 text-right">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        );
                      })
                    )
                  ) : (
                    <></>
                  )}

                  {Notification?.length > 6 ? (
                    <Link href="/notification">
                      <div className="mt-1 bg-white text-center cursor-pointer">
                        <p className="text-sm text-[#343434] opacity-[0.3]">
                          +{Notification?.length} More Items
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div className="mt-1 bg-white text-center">
                      <p className="text-sm text-[#343434] opacity-[0.3]"></p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="dropdown dropdown-end">
              <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <Image
                    alt=""
                    loading="eager"
                    width="50"
                    height="50"
                    src={photo}
                  // objectFit="cover"
                  />
                </div>
              </label>
              <div
                tabIndex="0"
                className="mt-3 card card-compact dropdown-content w-80 bg-base-100 shadow"
              >
                <div className="card-body">
                  <div className="mb-3">
                    <p className="font-bold text-lg text-xl">My IHR</p>
                  </div>
                  <div className="flex items-center notify pb-4">
                    <div className="-space-x-5 avatar-group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <a href="./profile">
                        <p className="text-base font-normal">Account Info</p>
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center notify pb-4">
                    <div className="-space-x-5 avatar-group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-2 cursor-pointer" onClick={() => router.push("/deleted")}>
                      <p className="text-base font-normal">Deleted Receipts</p>
                    </div>
                  </div>
                  <div className="mt-2 mb-4">
                    <p className="font-bold text-lg text-xl">Support <em className="text-[#919191] text-xs capitalize font-semibold">Future</em></p>
                  </div>
                  <div className="flex items-center notify pb-4">
                    <div className="-space-x-5 avatar-group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <p className="text-base">Guide to IHR</p>
                    </div>
                  </div>
                  <div className="flex items-center notify pb-4">
                    <div className="-space-x-5 avatar-group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <p className="text-base">FAQS</p>
                    </div>
                  </div>
                  <div className="flex items-center notify pb-4">
                    <div className="-space-x-5 avatar-group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <p className="text-base">Terms of Services</p>
                    </div>
                  </div>
                  <div className="flex items-center notify pb-4">
                    <div className="-space-x-5 avatar-group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <p className="text-base">Privacy Policy</p>
                    </div>
                  </div>
                  <div className="flex items-center notify pb-4">
                    <div className="-space-x-5 avatar-group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <p className="text-base">Send Feedback</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between notify pb-4">
                    <div className="ml-3">
                      <p className="text-2xl font-bold">{AuthContext.user?.nickname?.slice(0, 14).concat("...")}</p>
                      <p className="text-[grey] text-sm">{AuthContext.user?.email?.slice(0, 22).concat("...")}</p>
                    </div>
                    <div className="ml-8 text-right">
                      <button onClick={logOut}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-[#ea3358] h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
export default Navbar;
