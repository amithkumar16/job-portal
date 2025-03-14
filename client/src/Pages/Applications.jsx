import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { assets, jobsApplied } from '../assets/assets';
import moment from 'moment';
import Footer from '../components/Footer';

const Applications = () => {
  const [isedit, setisedit] = useState(false);
  const [resume, setresume] = useState()

  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 max-auto my-10'>
        <h2 className='text-xl font-semibold bg-blue-100 text-black'>Your Resume</h2>
        <div className='flex gap-2 mb-6 mt-3'>
          {isedit ? (
            <>

              <label className='flex items-center' htmlFor="resumeupload">
                <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>
                  Select Resume
                </p>
                <input id='resumeupload' onChange={e => setresume(e.target.files[0])} type="file" hidden accept='application/pdf' />
                <img src={assets.profile_upload_icon} alt="" />
              </label>
              <button className='bg-green-400 border border-green-400 rounded-lg px-4 py-2' onClick={() => setisedit(false)}>Save</button>
            </>
          ) : (
            <div className='flex gap-2'>
              <a className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg' href="#">Resume</a>
              <button className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2' onClick={() => setisedit(true)}>Edit</button>
            </div>
          )}
        </div>

        <div>
          <h2 className='text-xl font-semibold mb-4'>Applied jobs</h2>
          <table className='min-w-full bg-white border rounded-lg'>
            <thead>
              <tr>
                <th className='py-3 px-4 border-b text-left'>Company</th>
                <th className='py-3 px-4 border-b text-left'>Job title</th>
                <th className='py-3 px-4 border-b text-left max-sm:hidden'>Location</th>
                <th className='py-3 px-4 border-b text-left max-sm:hidden'>Date</th>
                <th className='py-3 px-4 border-b text-left'>Status</th>
              </tr>

            </thead>
            <tbody>
              {jobsApplied.map((job, index) => true ? (
                <tr>
                  <td className='py-3 px-4 flex items-center gap-2 border-b'>
                    <img className='w-8 h-8' src={job.logo} alt="" />
                    {job.company}
                  </td>
                  <td className='py-2 px-4 border-b'>{job.title}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{job.location}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{moment(job.data).format('ll')}</td>
                  <td
                    className={`py-2 px-4 border-b ${job.status === 'Accepted' ? 'bg-green-100'
                        : job.status === 'Pending' ? 'bg-blue-100'
                          : 'bg-red-100'
                      } px-4 py-1.5 rounded`}
                  >
                    {job.status}
                  </td>
                </tr>
              ) : (null))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Applications;
