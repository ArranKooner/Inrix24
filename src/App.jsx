import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {  Button  } from './Components/Button'
import { Textbox } from './Components/Textbox'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Textbox/>
      <Button text={"Analyze"} color={"#ADD8E6"}/>
    </>
  )
}

export default App
