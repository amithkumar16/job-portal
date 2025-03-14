import React, { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'


const Hero = () => {

    const {setsearchfilter,setissearched} = useContext(AppContext)

    const tittleref = useRef(null)
    const locationref = useRef(null)

    const onsearch=()=>{
        setsearchfilter({
            title:tittleref.current.value,
            location:locationref.current.value
        })

        setissearched(true)
        
    }

    return (
        <div className='container 2xl:px-20 mx-auto my-10'>
            <div className='bg-gradient-to-r from-purple-800 to-purple-950 text-white py-19 text-center mx-2 rounded-xl'>
                <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4'>Over 10,000 jobs to apply</h2>
                <p className='mb-8 max-w-xl mx-auto text-sm font font-light px-5'>your next big carrer move starts here - explore the first job opprutunity and take the first step towards your success</p>
                <div className='flex items-center bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto'>
                    <div className='flex items-center'>
                        <img className='h-4 sm:h-5' src={assets.search_icon} alt="" />
                        <input type="text"
                            placeholder='Search for jobs'
                            className='max-sm:text-xs p-2 rounded outline-none w-full  bg-white text-black'
                            ref={tittleref}
                       />
                    </div>
                    <div className='flex items-center'>
                        <img className='h-4 sm:h-5' src={assets.location_icon} alt="" />
                        <input type="text"
                            placeholder='location'
                            className='max-sm:text-xs p-2 rounded outline-none w-full  bg-white text-black'
                        ref={locationref}
                      />
                    </div>
                    <button onClick={onsearch} className='bg-blue-600 px-6 py-2 rounded text-white m-1'>Search</button>
                </div>
            </div>
            <div className='border border-gray-300 shadow-md mx-2 p-6 rounded-md flex my-10'>
                <div className='flex justify-center gap-10 lg:gap-16 flex-wrap'>
                   <p className='font-medium'>Trusted By</p>
                   <img className='h-6' src={assets.microsoft_logo} alt="" />
                   <img className='h-6' src={assets.walmart_logo} alt="" />
                   <img className='h-6' src={assets.accenture_logo} alt="" />
                   <img className='h-6' src={assets.samsung_logo} alt="" />
                   <img className='h-6' src={assets.amazon_logo} alt="" />
                   <img className='h-6' src={assets.adobe_logo} alt="" />
             </div>

            </div>
        </div>
    )
}

export default Hero
