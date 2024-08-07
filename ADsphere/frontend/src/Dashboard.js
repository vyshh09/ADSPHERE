import axios from "axios";
import React, { useEffect, useState } from "react";
import AdvertiserHome from "./Dashboards/AdvertiserHome";
import LogisticsHome from "./Dashboards/LogisticsHome";
import { useNavigate } from "react-router-dom";
import AdminHome from "./Dashboards/AdminHome";
import "./dashboard.css"
import Header from "./Components/Header";

function Dashboard() {
    const navigate = useNavigate(); // Navigation hook
    
    // State variable to store user type (-1 indicates loading state)
    // change here to -1. Currently user state - 0
    const [type, setType] = useState(-1);

    useEffect(() => {

        // Fetch user information from the backend on component mount
        axios.get("/verify-login").then((res) => {
            if (res.data.valid) {   // Check if user is authenticated

                if (res.data.type.toLowerCase() == "advertiser")
                    setType(1); // Set type to 1 for advertiser

                else if(res.data.type.toLowerCase() == "admin")
                    setType(0); // Set type to 0 for admin

                else
                    setType("10");  // Set type to "10" for logistics
            }
            else{

                // If user is not authenticated, redirect to home page
                // uncomment this
                navigate("/", {replace: true})
            }
        });

    }, [])  // Empty dependency array ensures that useEffect runs only once

    return (
        <>
            <Header type={type}/>
            <div className="dashboard-container">
                {
                    // have to check admin login also
                    type === 0 ?
                    <AdminHome /> : type === 1 ?
                    <AdvertiserHome/> : type === "10" ?
                    <LogisticsHome/> : <h1></h1>
                }
            </div>
        </>
    )
}

export default Dashboard;
