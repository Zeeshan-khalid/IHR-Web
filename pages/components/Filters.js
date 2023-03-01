import React, { useEffect, useState } from 'react';

const Filters = ({ element, query, setSearchTerm, id, handleCheck, type, currentSelecteds }) => {
  const [color, setColor] = useState('#FFFF');
  const [text, setText] = useState('base-content');

  useEffect(() => {
    if (currentSelecteds?.includes(element)) {
      setColor('rgba(234, 51, 88, 0.06)');
      setText('[#2D007A]');
    } else {
      setColor('#FFFF');
      setText('base-content');
    }
  }, [currentSelecteds, element]);

  return (
    <div
      className={`h-[40px] cursor-pointer flex items-center `}
      key={id}
      style={{ backgroundColor: `${color}` }}
    >
      <input
        type="checkbox"
        className="checkbox custom-check"
        onChange={(event) => {
          handleCheck(event, type, element);
        }}
        checked={currentSelecteds?.includes(element)}
      />
      <p className={`text-sm font-normal flex items-center text-${text}`}>
        {element}
      </p>
    </div>
  );
};

export default Filters;
