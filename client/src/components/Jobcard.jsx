import React from 'react';
import { useNavigate } from 'react-router-dom';

const Jobcard = ({ job }) => {
    
    const navigate = useNavigate();

    return (
        <div className='border p-6 shadow rounded'>
            <div className='flex justify-between items-center'>
                <img 
                    className='h-8 rounded' 
                    src={job.companyId.image || '/default-company-logo.png'} 
                    alt={job.companyId.name} 
                />
            </div>
            <h4 className='font-medium text-xl mt-2'>{job.title}</h4>
            <div className='flex items-center gap-3 mt-2 text-xs'>
                <span className='bg-blue-50 border border-blue-500 px-4 py-1.5 rounded'>{job.location}</span>
                <span className='bg-blue-50 border border-blue-500 px-4 py-1.5 rounded'>{job.level}</span>
            </div>
            <p className='text-gray-500 text-sm mt-4' dangerouslySetInnerHTML={{ __html: job.description.slice(0, 150) }}></p>
            <div className='mt-4 flex gap-4 text-sm'>
                <button 
                    onClick={() => {
                        navigate(`/apply-job/${job._id}`);
                        scrollTo(0, 0);
                    }} 
                    className='bg-blue-600 text-white px-4 py-2 rounded'>
                    Apply now
                </button>
                <button 
                    onClick={() => {
                        navigate(`/apply-job/${job._id}`);
                        scrollTo(0, 0);
                    }} 
                    className='text-gray-500 border border-gray-500 rounded px-4 py-2'>
                    Learn more
                </button>
            </div>
        </div>
    );
};

export default Jobcard;
