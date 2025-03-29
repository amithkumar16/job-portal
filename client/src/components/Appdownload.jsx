import React from 'react'
import { assets } from '../assets/assets'

const Appdownload = () => {
    return (
        <div className='container px-4 2xl:px20 mx-auto my-20'>
            <div className='shadow-md relative bg-gradient-to-r from via-violet-200 to-purple-500 p-12 sm:p-24 lg:p-32 rounded-lg'>
                <div>
                    <h1 className='text-2xl sm:text-4xl font-bold mb-8 max-w-md'>downlaod mobile app for better experience</h1>
                    <div>
                        <a href="#" className='inline-block'>
                            <img className='h-12' src={assets.play_store} alt="" />
                        </a>
                        <a href="#" className='inline-block'>
                            <img className='h-12' src={assets.app_store} alt="" />

                        </a>
                    </div>
                </div>
                <img className='absolute w-80 right-0 bottom-0 mr-32 max-lg:hidden' src={assets.app_main_img} alt="" />
            </div>
        </div>
    )
}

export default Appdownload
