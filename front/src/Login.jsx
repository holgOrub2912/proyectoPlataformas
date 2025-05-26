import { useState } from 'react';
import { Link } from 'react-router'
import API_URL from './api'
import { useAuth } from './Auth'

const Login = () => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');

  const { logIn } = useAuth();

  return (<div className="login flex flex-col w-full items-center justify-center">
    <div className="flex flex-col w-75">
      <h2 className="text-xl font-thin text-center">Iniciar Sesión</h2>
      <div className="flex flex-col w-75">
        <input className="m-2" value={nombre} placeholder="Nombre" onChange={e => setNombre(e.target.value)} type="text"/>
        <input className="m-2" type='password' placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)}/>
      </div>
      <button onClick={() => logIn(nombre, password)}>Iniciar Sesión</button>
      <Link className="text-lime-400 font-bold m-2 text-center hover:text-gray-400" to="/registro">Registrarse</Link>
    </div>
  </div>)
}

export default Login;
