import React, { useState } from 'react'

const UserPanel = ({selectedTipoUsu, tiposUsuario}) => {

    const [selectedOption, setSelectedOption] = useState(null);
  
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
    selectedTipoUsu && (
      <div className="panel-container">
        <div className="options-panel">
          <h3>Opciones para {selectedTipoUsu}</h3>
          {tiposUsuario[selectedTipoUsu].map((option) => (
            <button
              key={option}
              onClick={() => setSelectedOption(option)}
              className="option-button">
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
      </div>)
  );
}

export default UserPanel;