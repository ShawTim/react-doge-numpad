import React, { useState, useEffect, useRef, useCallback } from "react";
import { Dialog } from "@material-ui/core";
import Numpad from "./Numpad";
import "./styles.scss";

export type NumPadProps = React.PropsWithChildren<{
  inline?: boolean,
  label?: string,
  value?: number,
  decimal?: boolean,
  max?: number,
  min?: number,
  onChange?: (value: number | string) => void,
  renderValue?: (value: number | string) => string,
}>;

const NumpadApp: React.FunctionComponent<NumPadProps> = (props) => {
  const {
    inline = false,
    label = "",
    value = 0,
    decimal = true,
    max = 1000000000000,
    min = 0,
    onChange = () => false,
    renderValue = (value) => String(value),
    children,
  } = props;

  const [isOpen, setOpen] = useState(false);
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
  const onEnter = useCallback((value: number) => {
    onChange(value);
    setOpen(false);
  }, [onChange, setOpen]);
  const focusDialog = useCallback(() => setTimeout(() => {
    if (dialogRef.current) {
      dialogRef?.current?.focus?.();
    } else {
      focusDialog(); // next try
    }
  }, 50), [dialogRef]);
    //numeral(decimal ? value.replace(/(\.\d\d)\d*/, "$1") : value).format(decimal ? "0,0[.]00" : "0,0") || 0;

  useEffect(() => {
    isOpen && !inline && focusDialog();
  }, [isOpen, inline, focusDialog]);

  if (inline) {
    return (
      <Numpad
        label={label}
        value={value}
        decimal={decimal}
        min={min}
        max={max}
        renderValue={renderValue}
        onEnter={onEnter} />
    );
  }

  const childrenWithEvents = React.isValidElement(children) ? React.Children.map(children, (child, i) => React.cloneElement(child, {
    key: child.key ?? `doge-numpad-child-${i}`,
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
        <Numpad
          ref={dialogRef}
          label={label}
          value={value}
          decimal={decimal}
          min={min}
          max={max}
          renderValue={renderValue}
          onEnter={onEnter} />
      </Dialog>
    </div>
  );
}

export default NumpadApp;
