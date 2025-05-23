import { useState, useEffect } from 'react'
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

  return <div>
    <input placeholder="Nombre" type="text" value={nombre} onChange={e => setNombre(e.target.value)}/>
    <input placeholder="cedula" type="cedula" value={cedula} onChange={e => setCedulaIfInt(e.target.value)}/>
    <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
    <input value={isAdmin} onChange={e => setIsAdmin(e.target.value)} type="checkbox"/>
    <button onClick={post_user}>Registrarse</button>
  </div>
  
}
export default Register;
