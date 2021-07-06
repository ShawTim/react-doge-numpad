import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
} from "@material-ui/core";
import "./styles.scss";

export type NumPadProps = React.PropsWithChildren<{
  label?: string,
  value?: number,
  decimal?: boolean,
  max?: number,
  min?: number,
  onChange?: (value: number | string) => void,
}>;

const defaultProps = {
  label: "",
  value: 0,
  decimal: true,
  max: 1000000000000,
  min: 0,
  onChange: (value: number | string) => { value; },
};

const Numpad: React.FunctionComponent<NumPadProps & typeof defaultProps> = (props) => {
  const { label, value, decimal, max, min, onChange, children } = props;
  const [isOpen, setOpen] = useState(false);
  const [tmpValue, setTmpValue] = useState<string>(`${Math.min(value ?? 0, max)}`);
  const dialogRef = useRef<HTMLDivElement>(null);

  const onOpen = useCallback(() => setOpen(true), [setOpen]);
  const onKeyOpen = useCallback((ev: React.KeyboardEvent) => {
    const { keyCode } = ev;
    if ((keyCode >= 48 && keyCode <= 57) || keyCode === 190 || keyCode === 13 || keyCode === 32) {
      ev.preventDefault(); // prevent scrolling on hitting space, that's why we catch it on keydown
      onOpen();
    }
  }, [onOpen]);
  const onClose = useCallback(() => setOpen(false), [setOpen]);
  const onClickNum = useCallback((num: number) => setTmpValue(`${tmpValue}` === "0" ? `${num}` : `${tmpValue}${num}`), [tmpValue, setTmpValue]);
  const onClick00 = useCallback(() => setTmpValue(`${tmpValue}` === "0" ? "0" : `${tmpValue}00`), [tmpValue, setTmpValue]);
  const onClickDot = useCallback(() => decimal && tmpValue.indexOf(".") < 0 && setTmpValue(`${tmpValue}.`), [decimal, tmpValue, setTmpValue]);
  const onClickAllClear = useCallback(() => setTmpValue("0"), [setTmpValue]);
  const onClickClear = useCallback(() => tmpValue.length > 0 && setTmpValue(tmpValue.substr(0, tmpValue.length-1) || "0"), [tmpValue, setTmpValue]);
  const onClickEnter = useCallback(() => {
    const newValue = Number(decimal ? tmpValue.replace(/(\.\d\d)\d*/, "$1") : tmpValue); // to 2 decimal places
    const limitedValue = Math.max(min, Math.min(max, newValue));
    onChange(limitedValue);
    setTmpValue("0");
    setOpen(false);
  }, [decimal, min, max, onChange, tmpValue, setTmpValue, setOpen]);
  const onKeyUp = useCallback((ev: React.KeyboardEvent) => {
    // only fire once
    const { keyCode } = ev;
    switch (keyCode) {
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        onClickNum(keyCode-48);
        break;
      case 190:
        onClickDot();
        break;
      case 13:
        onClickEnter();
        ev.preventDefault();
        break;
    }
  }, [onClickNum, onClickDot, onClickEnter]);
  const onKeyDown = useCallback((ev: React.KeyboardEvent) => {
    // user can press delete/backspace to delete multiple digits
    const { keyCode } = ev;
    switch (keyCode) {
      case 8:
      case 46:
        onClickClear();
        break;
      case 13:
        // cancel default button action
        ev.preventDefault();
        break;
    }
  }, [onClickClear]);
  const focusDialog = useCallback(() => setTimeout(() => {
    if (dialogRef.current) {
      dialogRef?.current?.focus?.();
    } else {
      focusDialog(); // next try
    }
  }, 50), [dialogRef]);
  const render = (value = "") => value;
    //numeral(decimal ? value.replace(/(\.\d\d)\d*/, "$1") : value).format(decimal ? "0,0[.]00" : "0,0") || 0;

  useEffect(() => {
    isOpen && focusDialog();
  }, [isOpen, focusDialog]);

  useEffect(() => {
    setTmpValue(`${value ?? 0}`);
  }, [value, setTmpValue]);

  const childrenWithEvents = React.isValidElement(children) ? React.Children.map(children, (child, i) => React.cloneElement(child, {
    key: `child-${i}`,
    onClick: onOpen,
    onKeyDown: onKeyOpen,
    onInput: onOpen,
    tabIndex: 0,
    role: "button",
  })) : null;

  return (
    <div>
      {childrenWithEvents}
      <Dialog open={isOpen} onClose={onClose} className="doge-numpad">
        <Card
          ref={dialogRef}
          tabIndex={0}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}>
          {label && <CardHeader title={label} />}
          <CardContent className="doge-numpad-container">
            <TextField
              className="doge-display-container"
              type="text"
              value={render(tmpValue)}
              variant="outlined"
              inputProps={{ readOnly: true }} />
            <div className="doge-button-container">
              <Button variant="outlined" onClick={() => onClickNum(7)}>7</Button>
              <Button variant="outlined" onClick={() => onClickNum(4)}>4</Button>
              <Button variant="outlined" onClick={() => onClickNum(1)}>1</Button>
              <Button variant="outlined" onClick={onClickDot} disabled={!decimal}>.</Button>
              <Button variant="outlined" onClick={() => onClickNum(8)}>8</Button>
              <Button variant="outlined" onClick={() => onClickNum(5)}>5</Button>
              <Button variant="outlined" onClick={() => onClickNum(2)}>2</Button>
              <Button variant="outlined" onClick={() => onClickNum(0)}>0</Button>
              <Button variant="outlined" onClick={() => onClickNum(9)}>9</Button>
              <Button variant="outlined" onClick={() => onClickNum(6)}>6</Button>
              <Button variant="outlined" onClick={() => onClickNum(3)}>3</Button>
              <Button variant="outlined" onClick={onClick00}>00</Button>
              <Button variant="outlined" onClick={onClickAllClear}>AC</Button>
              <Button variant="outlined" onClick={onClickClear}>C</Button>
              <Button variant="outlined" className="doge-enter" onClick={onClickEnter}>&#9166;</Button>
            </div>
          </CardContent>
        </Card>
      </Dialog>
    </div>
  );
}

Numpad.defaultProps = defaultProps;

export default Numpad;
