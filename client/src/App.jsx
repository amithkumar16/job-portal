import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import Home from './Pages/Home';
import ApplyJob from './Pages/ApplyJob';
import Applications from './Pages/Applications';
import Recruiterlogin from './components/Recruiterlogin';
import Dashboard from './Pages/Dashboard';
import Addjob from './Pages/Addjob';
import Managejobs from './Pages/Managejobs';
import Viewapplications from './Pages/Viewapplications';
import { Outlet } from 'react-router-dom'; // ✅ Import Outlet
import 'quill/dist/quill.snow.css'; // ✅ Corrected Quill import

const App = () => {
  const { showrecruiterlogin, companyToken } = useContext(AppContext);

  return (
    <div>
      {showrecruiterlogin && <Recruiterlogin />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Nested Routes under Dashboard */}
          {companyToken && (
            <>
              <Route path="addjob" element={<Addjob />} />
              <Route path="managejobs" element={<Managejobs />} />
              <Route path="viewapplications" element={<Viewapplications />} />
            </>
          )}
        </Route>
      </Routes>
    </div>
  );
};

export default App;
