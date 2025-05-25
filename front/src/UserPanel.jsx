import React, { useContext, useState } from 'react'
import { Outlet, Link } from 'react-router'
import { sidebarClasses, Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import { RoleContext, tiposUsuario, optionContent } from './global'
import { useAuth } from './Auth'

const UserPanel = ({toggled, setToggled}) => {
  const { user } = useAuth();
  console.log(toggled);
  const untoggle = () => {
    console.log("untoggling?");
    setToggled(false);
  };

  return (
    <div onClick={untoggle} className="flex w-screen p-2">
        <Sidebar
          toggled={toggled}
          breakPoint="md"
          rootStyles={{
            [`.${sidebarClasses.container}`]: {
              backgroundColor: '#FEFEFE',
            },
          }}
        >
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