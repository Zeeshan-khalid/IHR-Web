import React, { useEffect, useState } from "react";
import Image from "next/image";
import Visa from "../icons/Visa";

const CardFilters = ({
  element,
  query,
  setSearchTerm,
  id,
  handleCheck,
  type,
  card,
  currentSelecteds
}) => {
  const [color, setColor] = useState("#FFFF");
  const [text, setText] = useState("base-content");
  const [cards, setCards] = useState("");

  useEffect(() => {
    if (card === "2695ea37-c981-4d38-bac0-84dcd46a1ed9") {
      setCards("Visa");
    } else if (card === "7f0256ce-bca3-41e7-b076-f45c2a46f1fb") {
      setCards("Mastercard");
    } else {
      setCards('Others');
    }
  }, [card]);

  useEffect(() => {
    if (currentSelecteds?.find(x => x.cardNumber === element) ? true : false) {
      setColor("rgba(248, 234, 254, 0.6)");
      setText("[#2D007A]");
    } else {
      setColor("#FFFF");
      setText("base-content");
    }
  }, [currentSelecteds, element]);

  return (
    <div
      className={`h-[40px] cursor-pointer flex items-center `}
      key={id}
      style={{ backgroundColor: `${color}` }}
    >
      {" "}
      <input
        type="checkbox"
        className="checkbox custom-check"
        onChange={(event) => {
          handleCheck(event, type, [element, card]);
        }}
        checked={currentSelecteds?.find(x => x.cardNumber === element) ? true : false}
      />{" "}
      {card === "2695ea37-c981-4d38-bac0-84dcd46a1ed9" ? (
        <Visa />
      ) : (<>
        {card === "7f0256ce-bca3-41e7-b076-f45c2a46f1fb" ? (
          <Image
          alt=""
          loading="eager"
          width="30"
          height="30"
          src={"/images/visa.png"}
          objectFit="contain"
          className="mr-1"
        />
        ) : (<>
          <h1>Others</h1>
        </>)}
      </>
      )}
      <p className={`text-sm font-normal flex items-center text-${text} ml-1`}>
        {cards} {element}
      </p>
    </div>
  );
};

export default CardFilters;
