import { useState, useContext } from 'react'
import { Link } from 'react-router'
import { tiposUsuario, RoleContext } from './global'

const Header = ({setRole}) => {
    const [botonDespliegueActivo, setEstaBotonDespliegueActivo] = useState(false);
    const role = useContext(RoleContext);

    return (
        <div className="header">
          <button 
            onClick={() => setEstaBotonDespliegueActivo(!botonDespliegueActivo)}
            className="dropdown-toggle"
          >
            { role ? (<>Rol: <b>{role}</b></>) : (<>Seleccionar rol</>)}
          </button>
          
          {botonDespliegueActivo && (
            <div className="dropdown-menu">
              {Object.keys(tiposUsuario).map((usuTipoElegido) => (
                <Link to="/"
                  key={usuTipoElegido}
                  onClick={() => {
                    setRole(usuTipoElegido);
                    setEstaBotonDespliegueActivo(false);
                  }}
                  className="dropdown-item">
                    {usuTipoElegido.charAt(0).toUpperCase() + usuTipoElegido.slice(1)}
                </Link>
              ))}
            </div>
          )}
        </div>
    );
}

export default Header;
