import React from "react";

function Spinner() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="none"
      viewBox="0 0 64 64"
      className="animate-spin"
    >
      <path
        fill="#2D007A"
        d="M32 6A26 26 0 006 32a3 3 0 11-6 0 32 32 0 1132 32 3 3 0 010-6 26 26 0 000-52z"
      ></path>
    </svg>
  );
}

export default Spinner;
