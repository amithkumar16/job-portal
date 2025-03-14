import React, { useContext } from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './Pages/Home'
import ApplyJob from './Pages/ApplyJob'
import Applications from './Pages/Applications'
import Recruiterlogin from './components/Recruiterlogin'
import { AppContext } from './context/AppContext'
import Dashboard from './Pages/Dashboard'
import Addjob from './Pages/Addjob'
import Managejobs from './Pages/Managejobs'
import Viewapplications from './Pages/Viewapplications'
import 'quill/dist/quill'
const App = () => {
  const {showrecruiterlogin} = useContext(AppContext)

  return (
    <div>
      {showrecruiterlogin && <Recruiterlogin/>}
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/apply-job/:id' element={<ApplyJob />}></Route>
        <Route path='/applications' element={<Applications />}></Route>
        <Route path='/dashboard' element={<Dashboard />}>
        <Route path='addjob' element={<Addjob/>}/>
        <Route path='managejobs' element={<Managejobs/>}/>
        <Route path='viewapplications' element={<Viewapplications/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
