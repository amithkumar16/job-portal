import React, { createContext, useState, useEffect } from "react";
import axios from "axios"; 
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const { user } = useUser();
    const { getToken } = useAuth();

    const [searchfilter, setsearchfilter] = useState({ title: "", location: "" });
    const [showrecruiterlogin, setshowrecruiterlogin] = useState(false);
    const [issearched, setissearched] = useState(false);

    const [companyToken, setCompanyToken] = useState(null);
    const [companydata, setCompanydata] = useState(null);

    const [jobs, setjobs] = useState([]);

    const [userdata, setuserdata] = useState(null);
    const [userapplications, setuserapplications] = useState([]);

    // Fetch job data
    const fetchjobs = async () => {
        try {
            const { data } = await axios.get(`${backendurl}/api/jobs`);
            if (data.success) {
                setjobs(data.jobs);
                console.log("Jobs fetched:", data.jobs);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Something went wrong while fetching jobs.");
            console.error("Fetch Jobs Error:", error);
        }
    };

    // Fetch company data
    const fetchCompanyData = async () => {
        try {
            if (!companyToken) {
                console.warn("Company token is missing!"); // Debugging
                return;
            }
    
            const { data } = await axios.get(`${backendurl}/api/company/company`, {
                headers: { Authorization: `Bearer ${companyToken}` },
            });
    
            console.log("Company API response:", data); // Log response
    
            if (data.success) {
                setCompanydata(data.company);
                console.log("Company Data Set Successfully:", data.company);
            } else {
                alert("Failed to fetch company data: " + data.message);
            }
        } catch (error) {
            console.error("Company Fetch Error:", error.response || error);
            alert(`Error fetching company data: ${error.response?.data?.message || error.message}`);
        }
    };
    

    // Fetch user data
    const fetchuser = async () => {
        try {
            const token = await getToken(); 
            
            const { data } = await axios.get(`${backendurl}/api/user/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setuserdata(data.user);
                console.log("User Data:", data.user);
            } else {
                alert("Failed to fetch user data.");
            }
        } catch (error) {
            alert("Error fetching user data.");
            console.error("User Fetch Error:", error);
        }
    };
//function to userapplication data
const fetchuserapplications = async () => {
    try {
        const token = await getToken();
        
        const { data } = await axios.get(`${backendurl}/api/user/applications`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

  

        if (data.success) {
            setuserapplications(data.applications);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error fetching user applications:", error);
        alert("Error fetching user applications.");
    }
};


    // Load jobs and company token on mount
    useEffect(() => {
        fetchjobs();
        const storedcompanytoken = localStorage.getItem("companyToken");
        if (storedcompanytoken) {
            setCompanyToken(storedcompanytoken);
        }
    }, []);

    // Fetch company data when companyToken changes
    useEffect(() => {
        if (companyToken) {
            fetchCompanyData();
        }
    }, [companyToken]);

    // Fetch user data when the user is logged in
    useEffect(() => {
        if (user) {
            fetchuser();
            fetchuserapplications();
        }
    }, [user]);

    const value = {
        setsearchfilter,
        searchfilter,
        issearched,
        setissearched,
        jobs,
        setjobs,
        showrecruiterlogin,
        setshowrecruiterlogin,
        companyToken,
        setCompanyToken,
        companydata,
        setCompanydata,
        userdata,
        setuserdata,
        userapplications, // ✅ Added user applications
        setuserapplications, // ✅ Added setter for user applications
        backendurl,
        fetchuser,
        fetchuserapplications,
    };
    

    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
