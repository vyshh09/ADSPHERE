import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import Header from './Components/Header';
import './approve_declined_ads.css'
import { useNavigate } from 'react-router-dom';

const DeclinedAds = () => {
    const [feedbacks, setFeedbacks] = useState([]); // State variable to store feedbacks
    const [loading, setLoading] = useState(0);  // State variable to track loading state
    const userEmail = useState("");
    const navigate = useNavigate(); // Navigation hook

    // Fetch declined ads from the backend on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(1);  // Set loading state to true

                // Fetch declined ads from the backend
                axios.get("/retrieve-ads", {
                    params: {
                        approval: "0",  // Filter by approval status (0 for declined)
                        payment_status: "0",    // Filter by payment status (0 for unpaid)
                    }
                })
                .then(res => {
                    if(res.data.success){
                        // console.log(res.data.ads)
                        setFeedbacks(res.data.ads)  // Set the fetched feedbacks
                    }
                    else{
                        navigate("/login", {replace: true}) // Redirect to login page if user is not authenticated
                    }
                })
            }
            catch (error) {
                console.error('Error fetching feedback:', error);   // Log error if fetching feedback fails
            }
            setLoading(0)   // Set loading state to false
        };

        fetchData();
    }, []); // Empty dependency array ensures that useEffect runs only once

    return (
        <>
            <Header type='4' />
            <div className='approved-div'>
                {loading ? (<p>Loading... </p>) : feedbacks.length > 0 ? (
                    <>
                        {/* <p>Declined Ads:</p> */}
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
                                            
                                            {item.admin_feedback === "null" ?
                                                <div className='ad-detail'><strong>Admin Feedback:</strong> Ad Approved</div> :
                                                <>
                                                    <div className='ad-detail'><strong>Status:</strong> Declined</div>
                                                    <div className='ad-detail'><strong>Admin Feedback:</strong> {item.admin_feedback}</div>
                                                </>
                                            }
                                        </div>
                                    </li>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <p>No feedback found</p>    // Render message if no feedbacks are found
                )}
            </div>
        </>
    )
}

export default DeclinedAds;