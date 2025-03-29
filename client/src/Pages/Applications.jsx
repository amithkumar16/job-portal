import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { assets, jobsApplied } from '../assets/assets';
import moment from 'moment';
import Footer from '../components/Footer';
import { AppContext } from '../context/AppContext';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';

const Applications = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isedit, setisedit] = useState(false);
  const [resume, setresume] = useState(null);

  const { backendurl, userdata, userapplications, fetchuser, fetchuserapplications } = useContext(AppContext);
  // console.log("displayinf user data",userdata)
  const updateresume = async () => {
    try {
      if (!resume) {
        alert("Please select a resume file before uploading.");
        return;
      }

      const formData = new FormData();
      formData.append('resume', resume);

      const token = await getToken();
      const response = await axios.post(
        `${backendurl}/api/user/update-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response); // Debugging

      if (!response || !response.data) {
        alert("Unexpected response from the server.");
        return;
      }

      if (response.data.success) {
        alert("Resume updated successfully!");
        await fetchuser();
      } else {
        alert(`Resume update failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating resume:", error);
      alert(`Failed to update resume: ${error.response?.data?.message || error.message}`);
    }

    setisedit(false);
    setresume(null);
  };
  useEffect(() => {
    if (user) {
      fetchuserapplications();
    }
  }, [user])

  return (
    <>
      <Navbar />
      <div className='container px-4 min-h-[65vh] 2xl:px-20 max-auto my-10'>
        <h2 className='text-xl font-semibold bg-blue-100 text-black'>Your Resume</h2>
        <div className='flex gap-2 mb-6 mt-3'>
          {
            isedit || (userdata?.resume === "") ? (
              <>
                <label className='flex items-center' htmlFor="resumeupload">
                  <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>
                    {resume ? resume.name : "Select Resume"}
                  </p>
                  <input
                    id='resumeupload'
                    onChange={e => setresume(e.target.files[0])}
                    type="file"
                    hidden
                    accept='application/pdf'
                  />
                  <img src={assets.profile_upload_icon} alt="Upload Icon" />
                </label>
                <button
                  className='bg-green-400 border border-green-400 rounded-lg px-4 py-2'
                  onClick={updateresume}>
                  Save
                </button>
              </>
            ) : (
              userdata?.resume ? (
                <div className='flex gap-2'>
                  <a className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg' href={userdata.resume}>Resume</a>
                  <button
                    className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'
                    onClick={() => setisedit(true)}>
                    Edit
                  </button>
                </div>
              ) : (
                <p className='text-gray-500'>No Resume Uploaded</p>
              )
            )
          }

        </div>

        <div>
          <h2 className='text-xl font-semibold mb-4'>Applied Jobs</h2>
          <table className='min-w-full bg-white border rounded-lg'>
            <thead>
              <tr>
                <th className='py-3 px-4 border-b text-left'>Company</th>
                <th className='py-3 px-4 border-b text-left'>Job Title</th>
                <th className='py-3 px-4 border-b text-left max-sm:hidden'>Location</th>
                <th className='py-3 px-4 border-b text-left max-sm:hidden'>Date</th>
                <th className='py-3 px-4 border-b text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {userapplications.map((job, index) => (
                <tr key={index}>
                  <td className='py-3 px-4 flex items-center gap-2 border-b'>
                    <img className='w-8 h-8' src={job.companyId.image} alt="" />
                    {job.companyId.name}
                  </td>
                  <td className='py-2 px-4 border-b'>{job.jobId.title}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{job.jobId.location}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>
                    {job.date ? moment(job.date).format('LL') : "Invalid Date"}
                  </td>

                  <td
                    className={`py-2 px-4 border-b ${job.status === 'Accepted' ? 'bg-green-100'
                      : job.status === 'Pending' ? 'bg-blue-100'
                        : 'bg-red-100'
                      } px-4 py-1.5 rounded`}
                  >
                    {job.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Applications;
