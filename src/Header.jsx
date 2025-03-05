import { useState } from 'react'
import { Link } from 'react-router'
import { tiposUsuario } from './global'

const Header = ({setRole}) => {
    const [botonDespliegueActivo, setEstaBotonDespliegueActivo] = useState(false);

    return (
        <div className="dropdown">
          <button 
            onClick={() => setEstaBotonDespliegueActivo(!botonDespliegueActivo)}
            className="dropdown-toggle"
          >
            Selecciona tu tipo de usuario
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
