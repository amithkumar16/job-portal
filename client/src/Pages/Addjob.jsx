import React, { useRef, useEffect, useState, useContext } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { JobCategories, JobLocations } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const AddJob = () => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('Bangalore');
    const [category, setCategory] = useState('programming');
    const [level, setLevel] = useState('Beginner level');
    const [salary, setSalary] = useState(''); // ✅ Fix: Keep as string to reset properly
    const [jobDescription, setJobDescription] = useState('');

    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const { backendurl, companyToken } = useContext(AppContext);

    useEffect(() => {
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, { theme: 'snow' });

            quillRef.current.on('text-change', () => {
                setJobDescription(quillRef.current.root.innerHTML);
            });
        }
        return () => {
            quillRef.current = null;
        };
    }, []);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // ✅ Check if token exists
        const token = companyToken || localStorage.getItem('companyToken');
        if (!token) {
            alert("Authentication error: No token found. Please log in again.");
            return;
        }

        console.log("Company Token:", token);

        try {
            const description = quillRef.current?.root?.innerHTML || "";
            const response = await axios.post(`${backendurl}/api/company/post-job`, 
                { title, description, location, category, level, salary },
                { headers: { Authorization: `Bearer ${token}` } } // ✅ Fix: Correct token format
            );

            if (response.data.success) {
                setTitle('');
                setSalary(''); // ✅ Fix: Reset salary field correctly
                quillRef.current.root.innerHTML = "";
                alert("Job added successfully!");
            } else {
                alert("Failed to add job. Please try again.");
            }
        } catch (error) {
            console.error("Error adding job:", error.response?.data || error.message);
            alert("An error occurred while adding the job. Please check your connection and try again.");
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='container p-4 flex flex-col w-full items-start gap-3'>
            <div className='w-full'>
                <p className='mb-2'>Job Title</p>
                <input className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded'
                    type="text" 
                    placeholder="Type here" 
                    onChange={(e) => setTitle(e.target.value)} 
                    value={title} 
                    required 
                />
            </div>
            <div className='w-full max-w-lg'>
                <p className='my-2'>Job Description</p>
                <div ref={editorRef} style={{ minHeight: '150px', border: '1px solid #ccc' }}></div>
            </div>

            <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
                <div>
                    <p className='mb-2'>Job Category</p>
                    <select className='w-full px-3 py-2 border-2 border-gray-300' value={category} onChange={e => setCategory(e.target.value)}>
                        {JobCategories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <p className='mb-2'>Job Location</p>
                    <select className='w-full px-3 py-2 border-2 border-gray-300' value={location} onChange={e => setLocation(e.target.value)}>
                        {JobLocations.map((location, index) => (
                            <option key={index} value={location}>{location}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <p className='mb-2'>Job Level</p>
                    <select className='w-full px-3 py-2 border-2 border-gray-300' value={level} onChange={e => setLevel(e.target.value)}>
                        <option value="Beginner level">Beginner Level</option>
                        <option value="Intermediate level">Intermediate Level</option>
                        <option value="Senior level">Senior Level</option>
                    </select>
                </div>
            </div>
            <div>
                <p className='mb-2'>Job Salary</p>
                <input 
                    className='w-full px-3 py-2 border-2 border-gray-300' 
                    type="number"
                    onChange={e => setSalary(e.target.value)} // ✅ Fix: Ensure proper reset
                    placeholder='2500' 
                    min={0} 
                    value={salary} 
                />
            </div>
            <button className='w-28 py-3 mt-4 bg-black text-white rounded'>ADD</button>
        </form>
    );
};

export default AddJob;
