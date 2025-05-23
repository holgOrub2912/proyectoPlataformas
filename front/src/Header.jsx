import { useState, useContext } from 'react'
import { Link } from 'react-router'
import { tiposUsuario, RoleContext } from './global'
import {  useAuth } from './Auth'

const Header = ({setRole}) => {
  const { user, logOut } = useAuth();
  const loginBtn = <Link className="button" to="/login">Iniciar Sesión</Link>;
  const logoutBtn = <button onClick={logOut}>Cerrar Sesión</button>

  return (
      <div className="header">
        {user
          ? <>
            <span>{user.nombre}</span>
            {user.role == 1 && <span>(Admin)</span>}
            {logoutBtn}
          </>
          : <>
            {loginBtn}
          </>}
      </div>
  );
}

export default Header;
