import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import Loading from '../components/Loading';
import { assets } from '../assets/assets';

const Viewapplications = () => {
  const { backendurl, companyToken } = useContext(AppContext);
  const [applicants, setapplicants] = useState([]);

  const fetchcompanyjobapplications = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/company/applications`, {
        headers: { Authorization: `Bearer ${companyToken}` },
      });
      if (data.success) {
        setapplicants(data.applications.reverse());
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const changejobapplicationstatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendurl}/api/company/change-status`,
        { id, status },
        { headers: { Authorization: `Bearer ${companyToken}` } }
      );
      if (data.success) {
        fetchcompanyjobapplications();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchcompanyjobapplications();
    }
  }, [companyToken]);

  if (applicants.length === 0) return <div>No Applications Found</div>;

  return (
    <div className="container mx-auto p-4">
      <div>
        <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">User Name</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
              <th className="py-2 px-4 text-left">Resume</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.filter(item => item.jobId && item.userId).map((app, index) => (
              <tr key={index} className="text-gray-700">
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b flex items-center gap-2">
                  <img className="w-10 h-10 rounded-full max-sm:hidden" src={app.userId.image} alt="" />
                  <span>{app.userId.name}</span>
                </td>
                <td className="py-2 px-4 border-b max-sm:hidden">{app.jobId.title}</td>
                <td className="py-2 px-4 border-b max-sm:hidden">{app.jobId.location}</td>
                <td className="py-2 px-4 border-b">
                  <a
                    href={app.userId.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center"
                  >
                    Resume
                    <img src={assets.resume_download_icon} alt="Download" />
                  </a>
                </td>
                <td className="py-2 px-4 border-b relative">
                  {app.status === 'Pending'
                    ? <div className="relative inline-block text-left group">
                      <button className="text-gray-500 action-button">...</button>
                      <div className="z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border-gray-200 rounded shadow group-hover:block">
                        <button
                          onClick={() => changejobapplicationstatus(app._id, 'Accepted')}
                          className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => changejobapplicationstatus(app._id, 'Rejected')}
                          className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                    : <div>{app.status}</div>
                  }

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Viewapplications;
