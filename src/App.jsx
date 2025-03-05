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
  const [role, setRole] = useState(null);
  const possible_roles = ["admin", "cliente", "invitado"];

  return (
    <>
			<Header setRole={setRole} possibleRoles={tiposUsuario}/>
	    <UserPanel tiposUsuario={tiposUsuario} selectedTipoUsu={role}/>
    </>
  )
}

export default App
