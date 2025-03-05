import { Routes, Route, BrowserRouter } from 'react-router'
import { useContext, useState } from 'react'
import './style.css'
import Header from './Header'
import UserPanel from './UserPanel'
import RoleContext from './RoleConfig'

const tiposUsuario = {
  admin: ['Ver Reportes', 'Programacion', 'Configuración'],
  cliente: ['Mis rutas', 'Historial', 'Soporte'],
  invitado: ['Productos', 'Contacto']
};

function App() {
  const [role, setRole] = useState(null);

  return (
    <RoleContext.Provider value={role}>
			<Header setRole={setRole} possibleRoles={tiposUsuario}/>
	    <UserPanel tiposUsuario={tiposUsuario}/>
    </RoleContext.Provider>
  )
}

export default App;
