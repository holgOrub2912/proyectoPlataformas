import { useState } from 'react';
import { Link } from 'react-router'
import API_URL from './api'

const Login = () => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');

  const loginAttempt = async () => {
    const formData = new FormData();
    formData.append("username", nombre);
    formData.append("password", password);

    try {
      const response = await fetch(`${API_URL}/token`,  {
        method: 'POST',
        mode: 'cors',
        body: formData
      })
      if (response.ok){
        localStorage.setItem("auth_token", (await response.json()).access_token)
        alert("Sesión iniciada correctamente")
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (<div className="login">
    <h2>Iniciar Sesión</h2>
    <input value={nombre} onChange={e => setNombre(e.target.value)} type="text"/>
    <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>
    <button onClick={loginAttempt}>Iniciar Sesión</button>
    <Link to="/registro">Registrarse</Link>
  </div>)
}

export default Login;
