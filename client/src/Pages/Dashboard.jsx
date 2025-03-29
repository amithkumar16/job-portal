import React, { useContext,useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Dashboard = () => {

  const navigate = useNavigate()
  const {companydata,setCompanydata,setCompanyToken} = useContext(AppContext)

  //function with logout for company
  const logout = () => {
    setCompanyToken(null);
    localStorage.removeItem('companyToken');
    navigate('/');
  }
  useEffect(() => {
    if(companydata){
      navigate('/dashboard/managejobs')
    }
  }, [companydata])
  
  return (
    <div className='min-h-screen'>
      {/* navbar for recruiter login */}
      <div className='shadow py-4'>
        <div className='px-5 flex justify-between items-center'>
          <img onClick={e => navigate('/')} className='max-sm:w-32 cursor-pointer' src={assets.logo} alt="" />
          {companydata && ( <div className='flex items-center gap-3'>
            <p className='max-sm:hidden'>Welcome, {companydata.name}</p>
            <div className='relative group:'>
              <img className='border w-8 rounded-full' src={companydata.image} alt="" />
              <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm'>
                  <li onClick={logout} className='py-1 px-2  cursor-pointer pr-10'>Logout</li>
                </ul>
              </div>
            </div>
          </div>)}
         
        </div>
      </div>
      <div className='flex items-start'>
        <div className='inline-block min-h-screen border-r-2'>
          <ul className='flex flex-col items-start pt-5 text-gray-800'>
            <NavLink className={({isActive})=>`flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && `bg-blue-100 border-r-4 border-blue-500`}`} to={'/dashboard/addjob'}>
              <img className='min-w-4' src={assets.add_icon} alt="" />
              <p className='max-sm:hidden'>Add job</p>
            </NavLink>
            <NavLink className={({isActive})=>`flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && `bg-blue-100 border-r-4 border-blue-500`}`} to={'/dashboard/managejobs'}>
            <img className='min-w-4' src={assets.home_icon} alt="" />
            <p className='max-sm:hidden'>Manage job</p>
            </NavLink>
            <NavLink className={({isActive})=>`flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && `bg-blue-100 border-r-4 border-blue-500`}`} to={'/dashboard/viewapplications'}>
            <img className='min-w-4' src={assets.person_tick_icon} alt="" />
            <p className='max-sm:hidden'>view applications</p>
            </NavLink>

          </ul>
        </div>
        <div>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
