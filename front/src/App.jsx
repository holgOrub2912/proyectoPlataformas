import { Routes, Route, BrowserRouter } from 'react-router'
import { useContext, useState } from 'react'
import Register from './Register'
import './style.css'
import Header from './Header'
import UserPanel from './UserPanel'
import {RoleContext, optionContent} from './global'

function App() {
  const [role, setRole] = useState('cliente');
  const [user, setUser] = useState(null);

  return (
    <RoleContext.Provider value={role}>
        <BrowserRouter>
          <Header setRole={setRole}/>
          <Routes>
            <Route element={<UserPanel/>}>
              <Route index element={<p></p>}/>
              <Route key="/registro" path="/registro" element={<Register/>} />
              {Object.values(optionContent).map(({route, content}) => (
                <Route key={route} path={route} element={<div className="content-area">{content}</div>}/>
              ))}
            </Route>
          </Routes>
        </BrowserRouter>
      </RoleContext.Provider>
  )
}

export default App;
