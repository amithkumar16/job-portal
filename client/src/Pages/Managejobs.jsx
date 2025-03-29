import React, { useContext, useState, useEffect } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const Managejobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  const { backendurl, companyToken } = useContext(AppContext);

  
  const fetchCompanyJobs = async () => {
    try {
        if (!companyToken) {
            console.warn("Company token is missing!");
            return;
        }

        console.log("Using company token:", companyToken);
        console.log("Fetching jobs from:", `${backendurl}/api/company/list-jobs`);

        const { data } = await axios.get(`${backendurl}/api/company/list-jobs`, {
            headers: { Authorization: `Bearer ${companyToken}` },
        });

        console.log("Company Jobs API response:", data);

        if (data.success) {
            setJobs(data.jobsData); // Ensure `jobsData` is used correctly
            console.log("Jobs set successfully:", data.jobsData);
        } else {
            console.error("Failed to fetch company jobs:", data.message);
            alert("Failed to fetch company jobs: " + data.message);
        }
    } catch (error) {
        console.error("Company Jobs Fetch Error:", error.response || error);
        alert(`Error fetching company jobs: ${error.response?.data?.message || error.message}`);
    }
};



  // Function to change job visibility
  const changeJobVisibility = async (id, currentVisibility) => {
    try {
        if (!companyToken) {
            console.warn("Company token is missing!");
            return;
        }

        console.log("🔍 Using company token:", companyToken);
        console.log("🔗 Sending request to:", `${backendurl}/api/company/change-visibility`);

        await axios.post(
            `${backendurl}/api/company/change-visibility`,
            { id },
            { headers: { Authorization: `Bearer ${companyToken}` } } // Correct header format
        );

        setJobs((prevJobs) =>
            prevJobs.map((job) =>
                job._id === id ? { ...job, visible: !currentVisibility } : job
            )
        );
    } catch (error) {
        console.error("🚨 Error changing job visibility:", error.response || error);
        alert(`Error: ${error.response?.data?.message || error.message}`);
    }
};


  // Fetch jobs when the component mounts
  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
    }
  }, [companyToken]);

  return (
    <div className="container p-4 max-w-5xl">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left max-sm:hidden">#</th>
              <th className="py-2 px-4 border-b text-left">Job Title</th>
              <th className="py-2 px-4 border-b text-left max-sm:hidden">Date</th>
              <th className="py-2 px-4 border-b text-left max-sm:hidden">Location</th>
              <th className="py-2 px-4 border-b text-left">Applications</th>
              <th className="py-2 px-4 border-b text-left">Visible</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <tr key={index} className="text-gray-700">
                  <td className="py-2 px-4 border-b max-sm:hidden">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{job.title}</td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {moment(job.date).format('ll')}
                  </td>
                  <td className="py-2 px-4 border-b max-sm:hidden">{job.location}</td>
                  <td className="py-2 px-4 border-b text-center">
                    {job.applications ? job.applications : 0}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      className="scale-125 ml-4"
                      type="checkbox"
                      checked={job.visible}
                      onChange={() => changeJobVisibility(job._id, job.visible)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No jobs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => navigate('/dashboard/addjob')}
          className="bg-black text-white py-2 px-4 rounded"
        >
          Add a new job
        </button>
      </div>
    </div>
  );
};

export default Managejobs;