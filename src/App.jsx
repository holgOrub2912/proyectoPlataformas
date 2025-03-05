import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './style.css'
import UserPanel from './UserPanel'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <UserPanel/>
    {/*
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>UwU</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          numerito es {count}
        </button>
        
      </div>
      <p className="read-the-docs">
        Hola Mundo, este es nuestro proyecto de plataformas.
      </p>
  */}
    </>
  )
}

export default App
