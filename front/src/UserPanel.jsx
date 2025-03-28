import React, { useContext, useState } from 'react'
import { Outlet, Link } from 'react-router'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { RoleContext, tiposUsuario, optionContent } from './global'

const UserPanel = () => {
  const selectedTipoUsu = useContext(RoleContext);
  
  return (
    <div className="panel-container">
    {selectedTipoUsu && (
        <Sidebar>
          <Menu>
            {tiposUsuario[selectedTipoUsu].map(opt => (
              <MenuItem key={opt} component={<Link to={optionContent[opt].route}/>}>{opt}</MenuItem>
            ))}
          </Menu>
        </Sidebar>
      )}
      <Outlet/>
      </div>
  );

}

export default UserPanel;