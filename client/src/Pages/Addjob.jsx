import React, { useRef, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill styles
import { JobCategories, JobLocations } from '../assets/assets';

const Addjob = () => {
    const [title, settitle] = useState('');
    const [location, setlocation] = useState('Bangalore');
    const [category, setcategory] = useState('programming');
    const [level, setlevel] = useState('Beginner level');
    const [salary, setsalary] = useState(0);
    const [jobDescription, setJobDescription] = useState(''); // Store Quill content

    const editorRef = useRef(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, { theme: 'snow' });

            // Listen for changes in Quill and update state
            quillRef.current.on('text-change', () => {
                setJobDescription(quillRef.current.root.innerHTML);
            });
        }
    }, []);

    return (
     
            <form action="" className='container p-4 flex flex-col w-full items-start gap-3' >
                <div className='w-full'>
                    <p className='mb-2'>Job Title</p>
                    <input className='w-full max-w-lg px-3 py-2 border-2 border-r-gray-300 rounded'
                        type="text" 
                        placeholder="Type here" 
                        onChange={(e) => settitle(e.target.value)} 
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
                    <select className='w-full px-3 py-2 border-2 border-gray-300' value={category} onChange={e => setcategory(e.target.value)}>
                        {JobCategories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <p className='mb-2'>Job Location</p>
                    <select className='w-full px-3 py-2 border-2 border-gray-300'  value={location} onChange={e => setlocation(e.target.value)}>
                        {JobLocations.map((location, index) => (
                            <option key={index} value={location}>{location}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <p className='mb-2'>Job Level</p>
                    <select className='w-full px-3 py-2 border-2 border-gray-300'  value={level} onChange={e => setlevel(e.target.value)}>
                        <option value="Beginner level">Beginner Level</option>
                        <option value="Intermediate level">Intermediate Level</option>
                        <option value="Senior level">Senior Level</option>
                    </select>
                </div>
                </div>
                <div>
                    <p className='mb-2'>Job Salary</p>
                    <input className='w-full px-3 py-2 border-2 border-gray-300' type="Number" onChange={e=>setsalary(e.target.value)} placeholder='2500' min={0} />
                </div>
                    <button className='w-28 py-3 mt-4 bg-black text-white rounded'>ADD</button>
            </form>
        
    );
};

export default Addjob;
