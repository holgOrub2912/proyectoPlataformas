import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './style.css'
import Header from './Header'
import UserPanel from './UserPanel'

const tiposUsuario = {
  admin: ['Ver Reportes', 'Programacion', 'Configuración'],
  cliente: ['Mis rutas', 'Historial', 'Soporte'],
  invitado: ['Productos', 'Contacto']
};


function App() {
  const [count, setCount] = useState(0);
  const [role, setRole] = useState(null);
  const possible_roles = ["admin", "cliente", "invitado"];

  return (
    <>
    <Header setRole={setRole} possibleRoles={tiposUsuario}/>
    <UserPanel tiposUsuario={tiposUsuario} selectedTipoUsu={role}/>
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
