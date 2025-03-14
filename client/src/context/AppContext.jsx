import React, { createContext } from "react";
import { useState,useEffect } from "react";
import { jobsData } from "../assets/assets";
export const AppContext=createContext()

export const AppContextProvider = (props) => {
    
    const [searchfilter, setsearchfilter] = useState({
        title:'',
        location:''
    })
    const [showrecruiterlogin, setshowrecruiterlogin] = useState(false)
    const [issearched, setissearched] = useState(false)

    const [jobs, setjobs] = useState([])
    //function to fetch job data
    const fetchjobs = async()=>{
         setjobs(jobsData)
    }
  
    useEffect(() => {
    fetchjobs()
    }, [])
    

    const value = {
           setsearchfilter,searchfilter,
           issearched,setissearched,
           jobs,setjobs,showrecruiterlogin,setshowrecruiterlogin
    }
    return (<AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>)
}
