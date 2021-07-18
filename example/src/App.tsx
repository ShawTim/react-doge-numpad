import React, { useState } from 'react'

import Numpad from 'react-doge-numpad'
import 'react-doge-numpad/dist/index.css'

const App = () => {
  const [value, setValue] = useState("");

  return (
    <Numpad
      onChange={(value: number | string) => setValue(`${value}`)}>
      <input type="text" value={value} />
    </Numpad>
  )

}

export default App
