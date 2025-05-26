import { Routes, Route, BrowserRouter } from 'react-router'
import { useContext, useState } from 'react'
import Register from './Register'
import './style.css'
import Header from './Header'
import UserPanel from './UserPanel'
import {RoleContext, optionContent} from './global'
import AuthProvider from './Auth'

function App() {
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const toggleSidebar = () => {
    console.log(`Setting sidebar to ${!sidebarToggled}`)
    setSidebarToggled(!sidebarToggled)
  };

  return (
    <AuthProvider>
        <BrowserRouter>
          <Header toggleSidebar={toggleSidebar}/>
          <Routes>
            <Route element={<UserPanel toggled={sidebarToggled} setToggled={setSidebarToggled}/>}>
              <Route index element={<p></p>}/>
              <Route key="/registro" path="/registro" element={<Register/>} />
              {Object.values(optionContent).map(({route, content}) => (
                <Route key={route} path={route} element={<div className="content-area">{content}</div>}/>
              ))}
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  )
}

export default App;
