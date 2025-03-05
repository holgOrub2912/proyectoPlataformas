import { useState } from 'react'
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
                <button
                  key={usuTipoElegido}
                  onClick={() => {
                    setRole(usuTipoElegido);
                    setEstaBotonDespliegueActivo(false);
                    // setSelectedOption(null);
                  }}
                  className="dropdown-item"
                >
                  {usuTipoElegido.charAt(0).toUpperCase() + usuTipoElegido.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
    );
}

export default Header;
