import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { assets } from '../assets/assets';
import kconvert from 'k-convert';
import moment from 'moment';
import Jobcard from '../components/Jobcard';
import { useAuth } from '@clerk/clerk-react';

const ApplyJob = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const { getToken } = useAuth();
  const { jobs, backendurl, userdata, userapplications, fetchuserapplications } = useContext(AppContext);
  
  const [jobdata, setjobdata] = useState(null);
  const [alreadyapplied, setalreadyapplied] = useState(false); // ✅ State variable to track application status

  const fetchjob = async () => {
    if (!id) return;
    try {
      const { data } = await axios.get(`${backendurl}/api/jobs/${id}`);
      if (data.success) {
        setjobdata(data.job);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
      console.error(error);
    }
  };

  const applyhandler = async () => {
    try {
      if (!userdata) {
        alert("Please log in to apply for this job.");
        return;
      }
      
      if (!userdata.resume) {
        navigate('/applications');
        alert("Please upload your resume before applying.");
        return;
      }

      const token = await getToken();

      const { data } = await axios.post(
        `${backendurl}/api/user/apply`,
        { jobId: jobdata._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        alert(data.message);
        fetchuserapplications(); // ✅ Refresh applications after applying
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const checkalreadyapplied = () => {
    if (jobdata && userapplications.length > 0) {
      const applied = userapplications.some(item => item.jobId._id === jobdata._id);
      setalreadyapplied(applied);
    }
  };

  useEffect(() => {
    fetchjob();
  }, [id]);

  useEffect(() => {
    checkalreadyapplied();
  }, [userapplications, jobdata,id]); // ✅ Run when applications or job data updates

  return jobdata ? (
    <>
      <Navbar />
      <div className='container min-h-screen flex flex-col py-10 px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded-lg w-full'>
          <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-600 rounded-xl'>
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
                    CTC: {kconvert.convertTo(jobdata.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center text-sm max-md:mx-auto max-md:text-center'>
              <button
                onClick={applyhandler}
                className={`p-2.5 px-10 text-white rounded ${
                  alreadyapplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'
                }`}
                disabled={alreadyapplied} // ✅ Disable if already applied
              >
                {alreadyapplied ? 'Already Applied' : 'Apply now'}
              </button>
              <p className='mt-1 text-gray-600'>Posted {moment(jobdata.date).fromNow()}</p>
            </div>
          </div>

          <div className='flex flex-col lg:flex-row justify-between items-start'>
            <div className='w-full lg:w-2/3'>
              <h2 className='font-bold text-2xl mb-4'>Job description</h2>
              <div
                className="rich-text text-gray-800 text-base leading-7 mt-6 p-1 bg-white rounded-lg
                prose prose-lg prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: jobdata.description }}
              ></div>

              <button
                onClick={applyhandler}
                className={`p-2.5 mt-2 px-10 text-white rounded ${
                  alreadyapplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'
                }`}
                disabled={alreadyapplied} 
              >
                {alreadyapplied ? 'Already Applied' : 'Apply now'}
              </button>
            </div>

            {/* Right section for more jobs */}
            {jobs.some(job => job._id !== jobdata._id && job.companyId._id === jobdata.companyId._id) && (
              <div className='w-full lg:w-1/3 mt-8 lg:ml-8 space-y-5'>
                <h2>More Jobs from {jobdata.companyId.name}</h2>
                {jobs
                  .filter(job => job._id !== jobdata._id && job.companyId._id === jobdata.companyId._id)
                  .slice(0, 4)
                  .map((job, index) => <Jobcard key={index} job={job} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJob;
