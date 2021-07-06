# react-doge-numpad

Wow! Such component! Very react! So numpad!
[doge](https://github.com/ShawTim/react-doge-numpad/raw/master/react-doge-numpad.png)

This react component is created by a DOGE lover. No it's nth related to the component itself. I just want to share my love to DOGE to all of you.

[screenshot](https://github.com/ShawTim/react-doge-numpad/raw/master/screenshot.png)

This is a Numpad popup.

[![NPM](https://img.shields.io/npm/v/react-doge-numpad.svg)](https://www.npmjs.com/package/react-doge-numpad) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-doge-numpad
```

## Usage

```tsx
import React, { useState } from 'react'

import Numpad from 'react-doge-numpad'
import 'react-doge-numpad/dist/index.css'

const App = () => {
  const [value, setValue] = useState("");

  return (
    <Numpad
      label="Label"
      value={0}
      decimal={true}
      max={1000000000000}
      min={0}
      onChange={(value: number | string) => setValue(`${value}`)}>
      <input type="text" value={value} />
    </Numpad>
  );
}
```

## License

MIT © [ShawTim](https://github.com/ShawTim)
