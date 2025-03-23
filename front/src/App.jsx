import { Routes, Route, BrowserRouter } from 'react-router'
import { useContext, useState } from 'react'
import './style.css'
import Header from './Header'
import UserPanel from './UserPanel'
import {RoleContext, optionContent} from './global'

function App() {
  const [role, setRole] = useState(null);

  return (
    <RoleContext.Provider value={role}>
        <BrowserRouter>
          <Header setRole={setRole}/>
          <Routes>
            <Route element={<UserPanel/>}>
              <Route index element={<p></p>}/>
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
