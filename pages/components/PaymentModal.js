import { useState } from "react";
import Image from "next/image";

const PaymentModal = ({ handleClick, cardName }) => {
  const PaymentTypes = [
    {
      value: "American Express",
      icon: "/images/visa.png",
      id: "7f0256ce-bca3-41e7-b076-f45c2a46f1fb",
    },
    {
      value: "Cash",
      icon: "/images/visa.png",
      id: "7f0256ce-bca3-41e7-b076-f45c2a46f1fb",
    },
    {
      value: "Check",
      icon: "/images/visa.png",
      id: "7f0256ce-bca3-41e7-b076-f45c2a46f1fb",
    },
    {
      value: "Discover",
      icon: "/images/visa.png",
      id: "7f0256ce-bca3-41e7-b076-f45c2a46f1fb",
    },
    {
      value: "Gift Card",
      icon: "/images/visa.png",
      id: "7f0256ce-bca3-41e7-b076-f45c2a46f1fb",
    },
    {
      value: "MasterCard",
      icon: "/images/visa.png",
      id: "7f0256ce-bca3-41e7-b076-f45c2a46f1fb",
    },
      {
      value: "Others",
      icon: "/images/visa.png",
      id: "7f0256ce-bca3-41e7-b076-f45c2a46f1fb",
    },
     {
      value: "Paypal",
      icon: "/images/visa.png",
      id: "7f0256ce-bca3-41e7-b076-f45c2a46f1fb",
    },
    {
      value: "Visa",
      icon: "/images/Visa.svg",
      id: "2695ea37-c981-4d38-bac0-84dcd46a1ed9",
    },
  ];
    const [name, setName] = useState(cardName);
  
  return (
    <>
      <span className="dropdown dropdown-end flex justify-end border-b-[1px] w-3/4 ml-2 text-right bg-white h-[30px]">
        <label className="text-[#B4B4B4] mr-3" >{name}</label>
        <label tabIndex="1">
          <div className="flex">
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
          </div>
        </label>
        <div
          tabIndex="1"
          className="mt-3 card card-compact dropdown-content w-60 bg-base-100 shadow z-[2]"
        >
          <div className="card-body">
            {PaymentTypes.map((payment, id) => {
              return (
                <div className="flex items-center notify mt-3 pb-4" key={id}>
                  <input
                    type="checkbox"
                    className="checkbox custom-check"
                          onChange={() => { handleClick(payment.id);  setName(payment.value)}}
                  ></input>
                  <div className="-space-x-5 avatar-group">
                    <img src={payment.icon} alt="" />
                  </div>
                  <div className="ml-2">
                    <p className="text-sm">{payment.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </span>
    </>
  );
};

export default PaymentModal;