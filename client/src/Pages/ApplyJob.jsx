import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { assets } from '../assets/assets';
import kconvert from 'k-convert'
import moment from 'moment';
import Jobcard from '../components/Jobcard';

const ApplyJob = () => {

  const { id } = useParams(); // Get job ID from URL
  const { jobs } = useContext(AppContext); // Get jobs from context
  const [jobdata, setjobdata] = useState(null);

  const fetchjob = async () => {
    const data = jobs.filter(job => job._id === id);
    if (data.length !== 0) {
      setjobdata(data[0])
      console.log(data[0])
    }

  };
  useEffect(() => {
    if (jobs.length > 0) {
      fetchjob();
    }
  }, [id, jobs]);

  return jobdata ? (
    <>
      <Navbar />
      <div className='container min-h-screen flex flex-col py-10 px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full'>
          <div className='flex justify-center md:justify-between  flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-600 rounded-xl'>
            <div className='flex flex-col md:flex-row items-center'>
              <img className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border' src={jobdata.companyId.image} alt="" />
              <div className='text-center md:text-left text-neutral-700'>
                <h1 className='text-2xl sm:text-4xl font-medium mb-1'>{jobdata.title}</h1>
                <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-4'>
                  <span className='flex items-center gap-1'>
                    <img src={assets.suitcase_icon} alt="" />
                    {jobdata.companyId.name}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.location_icon} alt="" />
                    {jobdata.location}

                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.person_icon} alt="" />
                    {jobdata.level}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.money_icon} alt="" />
                    CTC:{kconvert.convertTo(jobdata.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center text-sm max-md:mx-auto max-md:text-center'>
              <button className='bg-blue-600 p-2.5 px-10 text-white rounded'>
                Apply now
              </button>
              <p className='mt-1 text-gray-600'>Posted {moment(jobdata.date).fromNow()}</p>

            </div>

          </div>

          <div className='flex flex-col lg:flex-row justify-between items-start'>
            <div className='w-full lg:w-2/3'>
              <h2 className='font-bold text-2xl mb-4'>
                Job description
              </h2>
              <div
                className="rich-text text-gray-800 text-base leading-7 mt-6 p-1 bg-white rounded-lg
             prose prose-lg prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: jobdata.description }}>
              </div>



              <button className='bg-blue-600 p-2.5 mt-2 px-10 text-white rounded'>
                Apply now
              </button>
            </div>

            {/* {right section for more jobs} */}
            <div className='w-full lg:w-1/3 mt-8 lg:ml-8 space-y-5'>

              <h2>
                More Jobs from {jobdata.companyId.name} </h2>
                {jobs.filter(job => job._id !== jobdata._id && job.companyId._id === jobdata.companyId._id).filter(job => true).slice(0,4).map((job,index) => <Jobcard key={index} job={job}/>)}
             
            </div>
          </div>

        </div>
      </div>
       <Footer/>
    </>
  ) : (
    <Loading />
  )
}

export default ApplyJob
