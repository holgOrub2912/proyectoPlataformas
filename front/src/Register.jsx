import { useState, useEffect, useId } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from './api'

const Register = () => {
  const [nombre, setNombre] = useState('')
  const [cedula, setCedula] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState('')

  const navigate = useNavigate();

  const setCedulaIfInt = (val) => {
    // Deliberately using == instead of === to ignore type checking
    setCedula(val === '' || val == parseInt(val) ? val : cedula)
  }

  const post_user = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: nombre,
          cedula: cedula,
          password: password,
          role: (isAdmin ? 1 : 0)
        })
      })
      if (response.ok)
        navigate('/login')
    } catch (e) {
      console.log(e)
    }
  }

  const isAdminId = useId();

  return <div className="flex flex-col w-full items-center">
    <h2 className="text-xl font-thin text-center">
      Registrar un nuevo usuario
    </h2>
    <input className="m-2" placeholder="Nombre" type="text" value={nombre} onChange={e => setNombre(e.target.value)}/>
    <input className="m-2" placeholder="Cédula" type="cedula" value={cedula} onChange={e => setCedulaIfInt(e.target.value)}/>
    <input className="m-2" placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
    <label className="m-2" htmlFor={isAdminId}>Administrador: 
      <input id={isAdminId} className="m-2" value={isAdmin} onChange={e => setIsAdmin(e.target.value)} type="checkbox"/>
    </label>
    <button onClick={post_user}>Registrarse</button>
  </div>
  
}
export default Register;
