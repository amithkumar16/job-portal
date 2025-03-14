import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Recruiterlogin = () => {
    const [state, setstate] = useState('Login');
    const [name, setname] = useState('');
    const [password, setpassword] = useState('');
    const [email, setemail] = useState('');
    const [image, setimage] = useState(false);
    const [isnextdatasubmit, setisnextdatasubmit] = useState(false);

    const { setshowrecruiterlogin } = useContext(AppContext);

    // Prevent scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto'; 
        };
    }, []);

    const onsubmithandler = (e) => {
        e.preventDefault(); // Prevents page reload
        if (state === 'sign-up' && !isnextdatasubmit) {
            setisnextdatasubmit(true);
        }
    };

    return (
        <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop:blur-sm bg-black/30 flex justify-center items-center'>
            <form onSubmit={onsubmithandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter {state}</h1>
                <p className='text-sm text-blue-300'>Welcome back! Please sign in to continue</p>

                {state === 'sign-up' && isnextdatasubmit ? (
                    <>
                        {/* Image Upload */}
                        <div className='flex items-center gap-4 my-10'>
                            <label htmlFor="image-upload">
                                <img className='w-14 h-14 rounded-full cursor-pointer' 
                                     src={image ? URL.createObjectURL(image) : assets.upload_area} 
                                     alt="Upload" />
                                <input 
                                    onChange={e => setimage(e.target.files[0])} 
                                    type="file" 
                                    id='image-upload' 
                                    hidden 
                                />
                            </label>
                            <p>Upload Company <br /> logo</p>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Company Name Field (Only in Sign-Up) */}
                        {state !== 'Login' && (
                            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                <img src={assets.person_icon} alt="" />
                                <input className='outline-none' 
                                       onChange={e => setname(e.target.value)} 
                                       type="text" 
                                       placeholder='Company name' 
                                       required />
                            </div>
                        )}

                        {/* Email Field */}
                        <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                            <img src={assets.email_icon} alt="" />
                            <input className='outline-none' 
                                   onChange={e => setemail(e.target.value)} 
                                   type="email" 
                                   placeholder='Email ID' 
                                   required />
                        </div>

                        {/* Password Field */}
                        <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                            <img src={assets.lock_icon} alt="" />
                            <input className='outline-none' 
                                   onChange={e => setpassword(e.target.value)} 
                                   type="password" 
                                   placeholder='Password' 
                                   required />
                        </div>

                        {state === 'Login' && <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot Password?</p>}
                    </>
                )}

                {/* Button to proceed */}
                <button type='submit' className='w-full bg-blue-600 text-white py-2 rounded-full mt-2'>
                    {state === 'Login' ? 'Login' : isnextdatasubmit ? 'Create Account' : 'Next'}
                </button>

                {/* Toggle between login & sign-up */}
                <p 
                    className='text-sm text-center mt-4 text-blue-600 cursor-pointer' 
                    onClick={() => {
                        setstate(state === 'Login' ? 'sign-up' : 'Login');
                        setisnextdatasubmit(false); // Reset state on toggle
                    }}>
                    {state === 'Login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </p>
                
                {/* Close button */}
                <img 
                    onClick={() => {
                        setshowrecruiterlogin(false);
                        document.body.style.overflow = 'auto'; 
                    }} 
                    className='absolute top-5 right-5 cursor-pointer' 
                    src={assets.cross_icon} 
                    alt="Close" 
                />
            </form>
        </div>
    );
}

export default Recruiterlogin;
