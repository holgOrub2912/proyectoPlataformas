import React, { useContext, useState } from 'react'
import { Outlet, Link } from 'react-router'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { RoleContext, tiposUsuario, optionContent } from './global'

const UserPanel = ({tiposUsuario}) => {
  
  const selectedTipoUsu = useContext(RoleContext);
  console.log(selectedTipoUsu)
  const [selectedOption, setSelectedOption] = useState(null);
  
  return (
    selectedTipoUsu && (
      <div>
        <Sidebar>
          <Menu>
            <MenuItem component={<Link to="/reportes"/>}>Reportes</MenuItem>
          </Menu>
        </Sidebar>
        <Outlet/>
      </div>
  ));

  /*
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
  */
}

export default UserPanel;