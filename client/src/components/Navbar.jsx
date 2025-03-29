import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
    const { openSignIn } = useClerk();
    const { user } = useUser();
    const navigate = useNavigate();
    const { setshowrecruiterlogin } = useContext(AppContext);

    return (
        <div className='shadow py-4'>
            <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
                <img
                    onClick={() => { navigate('/') }}
                    src={assets.logo} alt="Logo"
                    className='cursor-pointer'
                />

                {
                    user ? (
                        <div className='flex items-center gap-3'>
                            <Link to={'/applications'}>Applied jobs</Link>
                            <p>|</p>
                            <p className='max-sm:hidden'>Hi, {user.firstName + " " + user.lastName}</p>

                            {/* New Dashboard Button */}
                            <button 
                                onClick={() => navigate('/dashboard')} 
                                className='bg-green-600 text-white px-4 py-2 rounded-full'>
                                Dashboard
                            </button>

                            <UserButton />
                        </div>
                    ) : (
                        <div className='flex gap-4 max-sm:text-xs'>
                            <button className='text-gray-600' onClick={() => setshowrecruiterlogin(true)}>Recruiter Login</button>
                            <button onClick={() => openSignIn()} className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>Login</button>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Navbar;
