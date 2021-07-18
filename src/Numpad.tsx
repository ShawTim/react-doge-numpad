import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
} from "@material-ui/core";

type NumPadContainerProps = React.PropsWithChildren<{
  label?: string,
  value?: number,
  decimal?: boolean,
  max?: number,
  min?: number,
  renderValue: (value: number | string) => string,
  onEnter: (value: number) => void,
}>;

const Numpad = React.forwardRef<HTMLDivElement, NumPadContainerProps>((props, ref) => {
  const {
    label = "",
    value = 0,
    decimal = true,
    max = 1000000000000,
    min = 0,
    renderValue = (value: number | string) => String(value),
    onEnter = () => false,
  } = props;

  const [tmpValue, setTmpValue] = useState<string>(`${Math.min(value ?? 0, max)}`);
  const [renderedValue, setRenderedValue] = useState<string>("");

  const onClickNum = useCallback((num: number) => setTmpValue(`${tmpValue}` === "0" ? `${num}` : `${tmpValue}${num}`), [tmpValue, setTmpValue]);
  const onClick0 = useCallback(() => onClickNum(0), [onClickNum]);
  const onClick1 = useCallback(() => onClickNum(1), [onClickNum]);
  const onClick2 = useCallback(() => onClickNum(2), [onClickNum]);
  const onClick3 = useCallback(() => onClickNum(3), [onClickNum]);
  const onClick4 = useCallback(() => onClickNum(4), [onClickNum]);
  const onClick5 = useCallback(() => onClickNum(5), [onClickNum]);
  const onClick6 = useCallback(() => onClickNum(6), [onClickNum]);
  const onClick7 = useCallback(() => onClickNum(7), [onClickNum]);
  const onClick8 = useCallback(() => onClickNum(8), [onClickNum]);
  const onClick9 = useCallback(() => onClickNum(9), [onClickNum]);
  const onClick00 = useCallback(() => setTmpValue(`${tmpValue}` === "0" ? "0" : `${tmpValue}00`), [tmpValue, setTmpValue]);
  const onClickDot = useCallback(() => decimal && tmpValue.indexOf(".") < 0 && setTmpValue(`${tmpValue}.`), [decimal, tmpValue, setTmpValue]);
  const onClickAllClear = useCallback(() => setTmpValue("0"), [setTmpValue]);
  const onClickClear = useCallback(() => tmpValue.length > 0 && setTmpValue(tmpValue.substr(0, tmpValue.length-1) || "0"), [tmpValue, setTmpValue]);
  const onClickEnter = useCallback(() => {
    const newValue = Number(decimal ? tmpValue.replace(/(\.\d\d)\d*/, "$1") : tmpValue); // to 2 decimal places
    const limitedValue = Math.max(min, Math.min(max, newValue));
    setTmpValue("0");
    onEnter(limitedValue);
  }, [decimal, min, max, tmpValue, setTmpValue]);

  const onKeyUp = useCallback((ev: React.KeyboardEvent) => {
    // only fire once
    const { key } = ev;
    switch (key) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        onClickNum(Number(key));
        break;
      case ".":
        onClickDot();
        break;
      case "Enter":
        onClickEnter();
        ev.preventDefault();
        break;
    }
  }, [onClickNum, onClickDot, onClickEnter]);
  const onKeyDown = useCallback((ev: React.KeyboardEvent) => {
    // user can press delete/backspace to delete multiple digits
    const { key } = ev;
    switch (key) {
      case "Delete":
      case "Backspace":
        onClickClear();
        break;
      case "Enter":
        // cancel default button action
        ev.preventDefault();
        break;
    }
  }, [onClickClear]);

  useEffect(() => {
    setTmpValue(`${value ?? 0}`);
  }, [value, setTmpValue]);

  useEffect(() => {
    setRenderedValue(renderValue(tmpValue));
  }, [renderValue, tmpValue, setRenderedValue]);

  return (
    <Card
      ref={ref}
      tabIndex={0}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}>
      {label && <CardHeader title={label} />}
      <CardContent className="doge-numpad-container">
        <TextField
          className="doge-display-container"
          type="text"
          value={renderedValue}
          variant="outlined"
          inputProps={{ readOnly: true }} />
        <div className="doge-button-container">
          <Button variant="outlined" onClick={onClick7}>7</Button>
          <Button variant="outlined" onClick={onClick4}>4</Button>
          <Button variant="outlined" onClick={onClick1}>1</Button>
          <Button variant="outlined" onClick={onClickDot} disabled={!decimal}>.</Button>
          <Button variant="outlined" onClick={onClick8}>8</Button>
          <Button variant="outlined" onClick={onClick5}>5</Button>
          <Button variant="outlined" onClick={onClick2}>2</Button>
          <Button variant="outlined" onClick={onClick0}>0</Button>
          <Button variant="outlined" onClick={onClick9}>9</Button>
          <Button variant="outlined" onClick={onClick6}>6</Button>
          <Button variant="outlined" onClick={onClick3}>3</Button>
          <Button variant="outlined" onClick={onClick00}>00</Button>
          <Button variant="outlined" onClick={onClickAllClear}>AC</Button>
          <Button variant="outlined" onClick={onClickClear}>C</Button>
          <Button variant="outlined" className="doge-enter" onClick={onClickEnter}>&#9166;</Button>
        </div>
      </CardContent>
    </Card>
  );
});

export default Numpad;