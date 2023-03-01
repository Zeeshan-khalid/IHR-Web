import React, { useEffect, useState } from "react";

const TagsModal = ({ tag, id, handleCheck, type, currentSelecteds }) => {
  const [color, setColor] = useState("#FFFF");
  const [text, setText] = useState("base-content");
    useEffect(() => {
      if (currentSelecteds?.includes(tag)) {
        setColor("#F8EAFE");
        setText("[#2D007A]");
      } else {
        setColor("#FFFF");
        setText("base-content");
      }
    }, [currentSelecteds, tag]);

  return (
    <div
      className={`h-[40px] cursor-pointer flex items-center p-3`}
      id={id}
      style={{ backgroundColor: `${color}` }}
    >
      {" "}
      <input
        type="checkbox"
        className="checkbox custom-check"
        onChange={(event) => {
          handleCheck(event, "tagModal", tag);
        }}
      />{" "}
      <p className={`text-sm font-normal flex items-center text-${text}`}>{tag}</p>
    </div>
  );
};



export default TagsModal;
