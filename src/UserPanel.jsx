import React, { useState } from 'react'

const UserPanel = () => {

    const [selectedTipoUsu, setSelectedTipoUsu] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [botonDespliegueActivo, setEstaBotonDespliegueActivo] = useState(false);
  
    const tiposUsuario = {
      admin: ['Ver Reportes', 'Programacion', 'Configuración'],
      cliente: ['Mis rutas', 'Historial', 'Soporte'],
      invitado: ['Productos', 'Contacto']
    };

    const optionContent = {
        'Ver Reportes': 'Reportes del sistema',
        'Programacion': 'Panel de administración de fletes',
        'Configuración': 'Ajustes del sistema',
        'Mis rutas': 'Tus rutas recientes',
        'Historial': 'Historial de actividades',
        'Soporte': 'Formulario de soporte técnico',
        'Productos': 'Catálogo de informacion',
        'Contacto': 'Información de contacto'
      };


  return (
    <div className="container">
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
                setSelectedTipoUsu(usuTipoElegido);
                setEstaBotonDespliegueActivo(false);
                setSelectedOption(null);
              }}
              className="dropdown-item"
            >
              {usuTipoElegido.charAt(0).toUpperCase() + usuTipoElegido.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>

    {selectedTipoUsu && (
      <div className="panel-container">
        <div className="options-panel">
          <h3>Opciones para {selectedTipoUsu}</h3>
          {tiposUsuario[selectedTipoUsu].map((option) => (
            <button
              key={option}
              onClick={() => setSelectedOption(option)}
              className="option-button"
            >
              {option}
            </button>
          ))}
        </div>

        <div className="content-area">
          {selectedOption ? (
            <h2>{optionContent[selectedOption]}</h2>
          ) : (
            <p>Selecciona una opción del panel owo</p>
          )}
        </div>
      </div>
    )}
  </div>
  );
}

export default UserPanel