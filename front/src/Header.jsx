import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router'
import { tiposUsuario, RoleContext } from './global'
import {  useAuth } from './Auth'
import { Bars3Icon, ArrowUturnLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid'

const Header = ({setRole, toggleSidebar}) => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const logOutAndNav = () => {
    logOut();
    navigate("/");
  };
  const loginBtn = <Link className="button block md:ml-2" to="/login">
    <span className="hidden md:inline">Iniciar Sesión</span>
    <ArrowRightIcon className="inline md:ml-2 size-4"/>
  </Link>;
  const logoutBtn = <button onClick={logOutAndNav}>
    <span className="hidden md:inline">Cerrar Sesión</span>
    <ArrowUturnLeftIcon className="inline md:ml-2 size-4"/>
  </button>

  return (
      <div className="flex rounded-md bg-lime-100 flex-row mb-2 p-2 justify-between w-1.0">
        <div>
          <button className="md:hidden" onClick={toggleSidebar}>
            <Bars3Icon className="size-5"/>
          </button>
        </div>
        <div>
          {user
            ? <>
              <span className="m-3">
                <span className="m-1">{user.nombre}</span>
                {user.role == 1 && <span className="font-thin">(Admin)</span>}
              </span>
              {logoutBtn}
            </>
            : <>
              {loginBtn}
            </>}
        </div>
      </div>
  );
}

export default Header;
