import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import Header from './Components/Header';
import './approve_declined_ads.css'
import { useNavigate } from 'react-router-dom';

const ApprovedAds = () => {
    const [feedbacks, setFeedbacks] = useState([]); // State variable for storing feedbacks
    const [loading, setLoading] = useState(0);  // State variable for loading state
    const navigate = useNavigate(); // Navigation hook
    const userEmail = useState(""); // State variable for user email

    useEffect(() => {
        const fetchData = async () => {
            // console.log("started")
            try {
                setLoading(1);  // Set loading state to true

                // Fetch approved and paid ads from backend
                axios.get("/retrieve-ads", {
                    params: {
                        approval: "1",
                        payment_status: "1"
                    }
                })
                .then(res => {
                    if(res.data.success){
                        // console.log(res.data.ads)
                        setFeedbacks(res.data.ads)  // Set feedbacks state with fetched data
                    }
                    else{
                        navigate("/login", {replace: true}) // Redirect to login page if request is unauthorized
                    }
                })
            }
            catch (error) {
                console.error('Error fetching feedback:', error);   // Log error if fetch fails
            }
            setLoading(0)   // Set loading state to false
            // console.log("ended")
        };

        fetchData();     // Call fetchData function on component mount
    }, []); // Empty dependency array ensures that useEffect runs only once

    // JSX Components
    return (
        <>
            <Header type='5' />
            <div className='approved-div'>
                {loading ? (<p>Loading... </p>) : feedbacks.length > 0 ? (
                    <>
                        <div className='flex-container'>
                            <div className='content-div-alt'>
                                {feedbacks.map((item, index) => ( 
                                    <li key={index} className='element-app-dec'>
                                        <img
                                            // src={`data:${item.ad_design.contentType};base64,${item.ad_design.data.toString('base64')}`} 
                                            src={item.ad_design}
                                            alt="Ad Design"
                                            style={{ maxWidth: '100%', maxHeight: '200px' }} className='ad-design'
                                        />
                                        <div className='ad-details'>
                                            <div className='ad-detail'><b>Ad ID:</b>{item.ad_id}</div>
                                            
                                            {item.approval === "1" ? 
                                                <div className='ad-detail'><b>Status:</b> Approved</div> 
                                            : 
                                                <div className='ad-detail'><b>Admin Feedback:</b> {item.admin_feedback}</div>
                                            }
                                        </div>
                                    </li>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <p>No feedback found</p>
                )}
            </div>
        </>
    )
}

export default ApprovedAds;