import React, { useContext, useState } from 'react'
import { Outlet, Link } from 'react-router'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { RoleContext, tiposUsuario, optionContent } from './global'
import { useAuth } from './Auth'

const UserPanel = () => {
  const { user } = useAuth();
  
  return (
    <div className="panel-container">
        <Sidebar>
          <Menu>
            {tiposUsuario[user ? user.role : 2].map(opt => (
              <MenuItem key={opt} component={<Link to={optionContent[opt].route}/>}>{opt}</MenuItem>
            ))}
          </Menu>
        </Sidebar>
      <Outlet/>
      </div>
  );

}

export default UserPanel;