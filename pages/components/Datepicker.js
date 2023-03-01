import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useEffect, useState } from "react";

const Datepicker = (props) => {
  const [state, setState] = useState([
    {
      startDate: "",
      endDate: "",
      key: "selection",
    },
  ]);

  useEffect(() => {
    props.lift(state);
  }, [state, props]);

  const onChangeDate = (item) => {
    const startFirstHoursOfDay = item.selection.startDate.setHours(0, 0, 0);
    const endLastHoursOfDay = item.selection.endDate.setHours(23, 59, 59);
    const selectedRangeDate = { startDate: new Date(startFirstHoursOfDay), endDate: new Date(endLastHoursOfDay), key: 'selection' }
    setState([selectedRangeDate])
  }

  return (
    <>
      <DateRangePicker
        onChange={(item) => onChangeDate(item)}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
      />
    </>
  );
};

export default Datepicker;
