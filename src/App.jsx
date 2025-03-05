import { Routes, Route, BrowserRouter } from 'react-router'
import { useContext, useState } from 'react'
import './style.css'
import Header from './Header'
import UserPanel from './UserPanel'
import {RoleContext} from './global'

function App() {
  const [role, setRole] = useState(null);

  return (
    <RoleContext.Provider value={role}>
      <Header setRole={setRole}/>
      <BrowserRouter>
        <Routes>
    	    <Route element={<UserPanel/>}>
    	     <Route index/>
    	    </Route>
  	    </Routes>
  	  </BrowserRouter>
    </RoleContext.Provider>
  )
}

export default App;
