import { useEffect, useState } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

const Datetimepicker = (props) => {
  const [state, setState] = useState();

  useEffect(() => {
    if (state !== undefined && state !== null) {
      props.lift(state);
    }
  }, [state, props]);

  const onChangeDatetime = (item) => {
    setState(item)
  }

  const renderInput = (datetimePickerProps) => {
    return (<input {...datetimePickerProps} readOnly />);
  }

  return (
    <>
      <Datetime
        renderInput={renderInput}
        initialValue={props?.defaultValue}
        onChange={onChangeDatetime}
        closeOnClickOutside={true}
        dateFormat={props?.dateFormat ? props?.dateFormat : 'YYYY-MM-DD'}
        timeFormat={props?.timeFormat ? props?.timeFormat : false}
        inputProps={props?.className ? {
          className: props?.className
        } : 'input'}
      />
    </>
  );
};

export default Datetimepicker;
