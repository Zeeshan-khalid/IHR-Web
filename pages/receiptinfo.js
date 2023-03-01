import { useState, useEffect } from "react";
import Head from "next/head";
import JWT from "expo-jwt";
import Image from "next/image";
import { useRouter } from "next/router";
import Footer from "./footer";
import HashLoader from "react-spinners/HashLoader";
import Link from "next/link";
import Navbar from "./navbar";

const ReceiptInfo = () => {
  const apiKey = "Y7z7tGPZQq2hjD9lmE3BCapcSGxP0HeC6LhOrBVP";
  const apiV2EndPoint = "https://api.staging.receiptserver.com/api/v1/receipts";

  const key = "F29V4kTB3P9Khd935QjJXaCN6Q43KSvX2cU8NKlX";
  const data = {
    userId: "101359060766773967423",
    sub: "com.ihatereceipts.web",
  };

  const myEncodedToken = JWT.encode(data, key, {
    algorithm: "HS256",
  });

  const router = useRouter();
  const [getUserSesssionId, setUserSessionID] = useState("");
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
          <Navbar type={"receipt"} route={"/home"} />
          <div className="px-12 bg-[#F9FAFF]">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 mt-5 mb-24 border-rights">
                <div className="flex">
                  <div className="bg-white amazonpd">
                    <Image
                      alt=""
                      loading="eager"
                      width="80"
                      height="80"
                      src="/images/amazon.svg"
                    />
                  </div>
                  <div>
                    <p className="text-base">Oct 03, 2021, 11:00 AM</p>
                    <h1 className="text-4xl font-bold">Amazon</h1>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl mt-3">Tags</h3>
                  <div className="truncate">
                    <div className="badge badge-outline badge-lg mr-2 mt-1 text-xs custom-border">
                      <p>#kids</p>
                    </div>
                    <div className="badge badge-outline badge-lg mr-2 mt-1 text-xs custom-border">
                      <p>#birthdays</p>
                    </div>
                  </div>
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
              <div className="mt-5 padding">
                <p className="text-lg text-[#B4B4B4] font-medium mb-2">
                  Payment method
                </p>
                <Image
                  alt=""
                  loading="eager"
                  width="258"
                  height="163"
                  src="/images/macrodebitcard.svg"
                />

                <div className="flex items-center justify-between">
                  <p className="text-lg text-[#B4B4B4]">Subtotal</p>
                  <p className="text-3xl text-[#B4B4B4]">$830.00</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-lg text-[#B4B4B4]">Tax</p>
                  <p className="text-2xl text-[#B4B4B4]">$22.75</p>
                </div>

                <hr />

                <div className="flex items-center justify-between">
                  <p className="text-lg text-[#000]">Total</p>
                  <p className="text-2xl font-bold text-[#000]">$982.75</p>
                </div>
              </div>
            </div>
          </div>
          <div className="container px-12 relative bottom-8">
            <div className="mb-5 gap-4 columns-5 text-center sharedetails flex justify-around">
              <div className="relative top-1">
                <Image
                  alt=""
                  loading="eager"
                  width="15"
                  height="15"
                  src="/images/share.png"
                />
                <span className="ml-3 relative top-[-3px]">Share</span>
              </div>
              <div className="relative top-1">
                <Image
                  alt=""
                  loading="eager"
                  width="20"
                  height="20"
                  src="/images/export.png"
                />
                <span className="ml-3 relative top-[-3px]">Export to PDF</span>
              </div>
              <div className="relative top-1">
                <Image
                  alt=""
                  loading="eager"
                  width="20"
                  height="20"
                  src="/images/export.png"
                />
                <span className="ml-3 relative top-[-3px]">Export to CSV</span>
              </div>
              <div className="relative top-1">
                <Image
                  alt=""
                  loading="eager"
                  width="20"
                  height="20"
                  src="/images/delete.png"
                />
                <span className="ml-3 relative top-[-3px]">Remove</span>
              </div>

              <div className="relative top-1">
                <Image
                  alt=""
                  loading="eager"
                  width="4"
                  height="15"
                  src="/images/doted.png"
                />{" "}
                <span className="ml-3  top-[-3px]">
                  <span className="dropdown dropdown-end">
                    <label tabIndex="1">
                      <p className="flex">More Actions</p>
                    </label>
                    <div
                      tabIndex="1"
                      className="mt-3 card card-compact dropdown-content w-60 bg-base-100 shadow"
                    >
                      <div className="card-body">
                        <div className="flex items-center notify mt-3 pb-4">
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
                            <p className="text-sm">Edit Receipt</p>
                          </div>
                        </div>
                        <div className="flex items-center pb-4">
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
                            <p className="text-sm">View Original Receipt</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </span>
                </span>
              </div>
            </div>
            <hr />
            <h2 className="text-2xl font-bold mt-3">
              Items{" "}
              <span className="badge text-[#868686] bg-[#EBEEFF] border-none">
                8
              </span>
            </h2>
            <div className="overflow-x-auto overflow-y-hidden w-full mt-4 sharedetailtable">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
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
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3">
                        <Image
                          alt=""
                          loading="eager"
                          width="60"
                          height="60"
                          src="/images/watch.svg"
                        />
                      </div>
                    </td>
                    <td>
                      <h3 className="text-sm">
                        Timex Unisex Weekender 38mm Watch
                      </h3>
                    </td>
                    <td>
                      <div className="text-base ">
                        Some items for the{" "}
                        <span className="text-[#ea3358]">#kids #sports</span>
                      </div>
                    </td>
                    <th>
                      <div className="text-center">
                        <span className="text-lg font-bold">$86.75</span>
                      </div>
                    </th>
                    <td className="text-center">
                      {/* <Image
                                                alt=""
                                                loading="eager"
                                                width="30"
                                                height="30"
                                                src="/images/3dots.svg"
                                            /> */}
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
                            className="mt-3 card card-compact dropdown-content w-60 bg-base-100 shadow"
                          >
                            <div className="card-body">
                              <div className="flex items-center notify mt-3 pb-4">
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
                                  <p className="text-sm">Edit Note</p>
                                </div>
                              </div>
                              <div className="flex items-center notify pb-4 mt-3">
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
                                <div className="ml-3">
                                  <p className="text-sm">Add tags</p>
                                </div>
                              </div>
                              <div className="flex items-center notify pb-4 mt-3">
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
                                <div className="ml-3">
                                  <p className="text-sm">Buy Again</p>
                                </div>
                              </div>
                              <div className="flex items-center notify pb-4 mt-3">
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
                                <div className="ml-3">
                                  <p className="text-sm">Share</p>
                                </div>
                              </div>
                              <div className="flex items-center pb-4 mt-3">
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
                                <div className="ml-3">
                                  <p className="text-sm">Remove Item</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3">
                        <Image
                          alt=""
                          loading="eager"
                          width="60"
                          height="60"
                          src="/images/watch.svg"
                        />
                      </div>
                    </td>
                    <td>
                      <h3 className="text-sm">
                        Timex Unisex Weekender 38mm Watch
                      </h3>
                    </td>
                    <td>
                      <div className="text-base ">
                        Some items for the{" "}
                        <span className="text-[#ea3358]">#kids #sports</span>
                      </div>
                    </td>
                    <th>
                      <div className="text-center">
                        <span className="text-lg font-bold">$86.75</span>
                      </div>
                    </th>
                    <td className="text-center">
                      {/* <Image
                                                alt=""
                                                loading="eager"
                                                width="30"
                                                height="30"
                                                src="/images/3dots.svg"
                                            /> */}
                      <div>
                        <span className="dropdown dropdown-end">
                          <label tabIndex="1">
                            <p className="flex">
                              <Image
                                alt=""
                                loading="eager"
                                width="30"
                                height="30"
                                src="/images/3dots.svg"
                              />
                            </p>
                          </label>
                          <div
                            tabIndex="1"
                            className="mt-3 card card-compact dropdown-content w-60 bg-base-100 shadow"
                          >
                            <div className="card-body">
                              <div className="flex items-center notify mt-3 pb-4">
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
                                  <p className="text-sm">Edit Note</p>
                                </div>
                              </div>
                              <div className="flex items-center notify pb-4 mt-3">
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
                                <div className="ml-3">
                                  <p className="text-sm">Add tags</p>
                                </div>
                              </div>
                              <div className="flex items-center notify pb-4 mt-3">
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
                                <div className="ml-3">
                                  <p className="text-sm">Buy Again</p>
                                </div>
                              </div>
                              <div className="flex items-center notify pb-4 mt-3">
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
                                <div className="ml-3">
                                  <p className="text-sm">Share</p>
                                </div>
                              </div>
                              <div className="flex items-center pb-4 mt-3">
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
                                <div className="ml-3">
                                  <p className="text-sm">Remove Item</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3">
                        <Image
                          alt=""
                          loading="eager"
                          width="60"
                          height="60"
                          src="/images/watch.svg"
                        />
                      </div>
                    </td>
                    <td>
                      <h3 className="text-sm">
                        Timex Unisex Weekender 38mm Watch
                      </h3>
                    </td>
                    <td>
                      <div className="text-base ">
                        Some items for the{" "}
                        <span className="text-[#ea3358]">#kids #sports</span>
                      </div>
                    </td>
                    <th>
                      <div className="text-center">
                        <span className="text-lg font-bold">$86.75</span>
                      </div>
                    </th>
                    <td className="text-center">
                      {/* <Image
                                                alt=""
                                                loading="eager"
                                                width="30"
                                                height="30"
                                                src="/images/3dots.svg"
                                            /> */}
                      <div>
                        <span className="dropdown dropdown-end">
                          <label tabIndex="1">
                            <p className="flex">
                              <Image
                                alt=""
                                loading="eager"
                                width="30"
                                height="30"
                                src="/images/3dots.svg"
                              />
                            </p>
                          </label>
                          <div
                            tabIndex="1"
                            className="mt-3 card card-compact dropdown-content w-60 bg-base-100 shadow"
                          >
                            <div className="card-body">
                              <div className="flex items-center notify mt-3 pb-4">
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
                                  <p className="text-sm">Edit Receipt</p>
                                </div>
                              </div>
                              <div className="flex items-center pb-4">
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
                                  <p className="text-sm">
                                    View Original Receipt
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center space-x-3">
                        <Image
                          alt=""
                          loading="eager"
                          width="60"
                          height="60"
                          src="/images/watch.svg"
                        />
                      </div>
                    </td>
                    <td>
                      <h3 className="text-sm">
                        Timex Unisex Weekender 38mm Watch
                      </h3>
                    </td>
                    <td>
                      <div className="text-base ">
                        Some items for the{" "}
                        <span className="text-[#ea3358]">#kids #sports</span>
                      </div>
                    </td>
                    <th>
                      <div className="text-center">
                        <span className="text-lg font-bold">$86.75</span>
                      </div>
                    </th>
                    <td className="text-center">
                      {/* <Image
                                                alt=""
                                                loading="eager"
                                                width="30"
                                                height="30"
                                                src="/images/3dots.svg"
                                            /> */}
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
                            className="mt-3 card card-compact dropdown-content w-60 bg-base-100 shadow"
                          >
                            <div className="card-body">
                              <div className="flex items-center notify mt-3 pb-4">
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
                                  <p className="text-sm">Edit Receipt</p>
                                </div>
                              </div>
                              <div className="flex items-center pb-4">
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
                                  <p className="text-sm">
                                    View Original Receipt
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Footer />
        </main>
      )}
    </div>
  );
};
export default ReceiptInfo;
