import { useState } from 'react';
import { Link } from 'react-router'
import API_URL from './api'
import { useAuth } from './Auth'

const Login = () => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');

  const { logIn } = useAuth();

  return (<div className="login">
    <h2>Iniciar Sesión</h2>
    <input value={nombre} onChange={e => setNombre(e.target.value)} type="text"/>
    <input type='password' value={password} onChange={e => setPassword(e.target.value)}/>
    <button onClick={() => logIn(nombre, password)}>Iniciar Sesión</button>
    <Link to="/registro">Registrarse</Link>
  </div>)
}

export default Login;
