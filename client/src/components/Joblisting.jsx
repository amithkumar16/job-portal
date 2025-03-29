import React, { useContext, useState,useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import Jobcard from './Jobcard'

const Joblisting = () => {

    const { issearched, searchfilter, setsearchfilter, jobs } = useContext(AppContext)

    const [showfilter, setshowfilter] = useState(true)
    const [currentpage, setcurrentpage] = useState(1)
    const [selectedcategory, setselectedcategory] = useState([])
    const [selectedlocation, setselectedlocation] = useState([])
    const [filteredjobs, setfilteredjobs] = useState(jobs)

    const handlecategorychange=(category)=>{
        setselectedcategory(prev =>prev.includes(category)?prev.filter(c => c!== category):[...prev,category])
    }
    const handlelocationchange=(location)=>{
        setselectedlocation(prev =>prev.includes(location)?prev.filter(c => c!== location):[...prev,location])
    }

    useEffect(() => {
        const matchescategory = job => selectedcategory.length === 0 || selectedcategory.includes(job.category);
      
        const matcheslocation = job => selectedlocation.length === 0 || selectedlocation.includes(job.location);
      
        const matchestitle = job => searchfilter.title === "" || job.title.toLowerCase().includes(searchfilter.title.toLowerCase());
      
        const matchessearchlocation = job => searchfilter.location === "" || job.location.toLowerCase().includes(searchfilter.location.toLowerCase());
      
        const newfilteredjobs = jobs.slice().reverse().filter(
          job => matchescategory(job) && matcheslocation(job) && matchestitle(job) && matchessearchlocation(job)
        );
      
        setfilteredjobs(newfilteredjobs);
        setcurrentpage(1);
      }, [jobs, selectedcategory, selectedlocation, searchfilter]);
      

    return (

        

        <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8'>
            {/* //sidebar */}

            <div className='w-full lg:w-1/4 bg-white px-4'>
                {/* search filter from hero component*/}
                {
                    issearched && (searchfilter.title !== "" || searchfilter.location !== "") && (
                        <>
                            <h3 className='font-medium text-lg mb-4'>current search</h3>
                            <div className='mb-4 text-gray-600'>
                                {searchfilter.title && (
                                    <span className='inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
                                        {searchfilter.title}
                                        <img onClick={e => setsearchfilter(prev => ({ ...prev, title: "" }))} className='cursor-pointer' src={assets.cross_icon} alt="" />
                                    </span>
                                )}
                                {
                                    searchfilter.location && (
                                        <span className='ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded'>
                                            {searchfilter.location}
                                            <img onClick={e => setsearchfilter(prev => ({ ...prev, location: "" }))} className='cursor-pointer' src={assets.cross_icon} alt="" />
                                        </span>
                                    )
                                }
                            </div>
                        </>
                    )

                }


                <button onClick={e => setshowfilter(prev => !prev)} className='px-6  py-1.5 rounded border border-gray-400 lg:hidden'>
                    {showfilter ? "close" : "filters"}
                </button>
                {/* category filter */}
                <div className={showfilter ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4'>search by categories</h4>
                    <ul className='space-y-4 text-gray-600'>
                        {
                            JobCategories.map((category, index) => (
                                <li className='flex gap-3 items-center' key={index}>
                                    <input 
                                    onChange={()=> handlecategorychange(category)}
                                    checked = {selectedcategory.includes(category)}
                                    className='scale-125' type="checkbox" name='' id='' />
                                    {category}
                                </li>
                            ))
                        }
                    </ul>
                </div>
                {/* location filter */}
                <div className={showfilter ? "" : "max-lg:hidden"}>
                    <h4 className='font-medium text-lg py-4 pt-14'>search by location</h4>
                    <ul className='space-y-4 text-gray-600'>
                        {
                            JobLocations.map((location, index) => (
                                <li className='flex gap-3 items-center' key={index}>
                                    <input 
                                     onChange={()=> handlelocationchange(location)}
                                     checked = {selectedlocation.includes(location)}
                                    className='scale-125' type="checkbox" name='' id='' />
                                    {location}
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
            {/* job listing */}
            <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
                <h3 className='font-medium text-3xl py-2'>Latest jobs</h3>
                <p className='mb-8'>Get your desired job from top companies</p>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                    {filteredjobs.slice((currentpage-1)*6,currentpage*6).map((job, index) => (
                        <Jobcard key={index} job={job} />
                    ))}
                </div>
                {/* pagination */}
                {filteredjobs.length > 0 && (
                    <div className='flex items-center justify-center space-x-2 mt-10'>
                        <a href="#job-list">
                            <img onClick={()=> setcurrentpage(Math.max(currentpage-1),1)} src={assets.left_arrow_icon} alt="" />
                        </a>
                        {
                            Array.from({ length: Math.ceil(filteredjobs.length / 6) }).map((_, index) => (
                                <a key={index} href="#job-list">
                                    <button onClick={()=>setcurrentpage(index+1)} className={`w-10 h-10 flex items-center justify-center border border-gray-300 ${currentpage === index + 1 ? 'bg-blue-100 text-blue-500' : 'text-gray-500'}`}>
                                        {index + 1}
                                    </button>

                                </a>
                            ))
                        }
                        <a href="#job-list">
                            <img onClick={()=> setcurrentpage(Math.min(currentpage+1),Math.ceil(filteredjobs.length/6))} src={assets.right_arrow_icon} alt="" />
                        </a>
                    </div>
                )}

            </section>
        </div>
    )
}

export default Joblisting
