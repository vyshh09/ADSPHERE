import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import Header from './Components/Header';
import './approve_declined_ads.css'
import { useNavigate } from 'react-router-dom';

const CurrentAds = () => {
    // State to hold the fetched feedbacks
    const [feedbacks, setFeedbacks] = useState([]);
    // State to indicate loading state
    const [loading, setLoading] = useState(0);
    // Hook to navigate to other pages
    const navigate = useNavigate();
    const userEmail = useState("");
    useEffect(() => {
        // Function to fetch feedbacks from the server
        const fetchData = async () => {
            try {
                // Set loading state to true
                setLoading(1);
                // Fetch approved and paid ads from the server
                axios.get("/retrieve-ads", {
                    params: {
                        approval: "1",
                        payment_status: "1"
                    }
                })
                    .then(res => {
                        if (res.data.success) {
                            // Update feedbacks state with fetched ads
                            setFeedbacks(res.data.ads)
                        }
                        else {
                            // Redirect to login page if not authenticated 
                            navigate("/login", { replace: true })
                        }
                    })
            }
            catch (error) {
                // Log error if fetching fails
                console.error('Error fetching feedback:', error);
            }
            // Set loading state to false after fetching
            setLoading(0)
        };
        // Call fetchData function when component mounts
        fetchData();
    }, []);
    return (
        <>
            {/* Render header component */}
            <Header type='AdsOnPlatform' />
            <div className='approved-div'>
                {/* Display loading message while fetching data */}
                {loading ? (<p>Loading... </p>) : feedbacks.length > 0 ? (
                    <>
                        {/* Render feedbacks */}
                        <div className='flex-container'>
                            <div className='content-div-alt'>
                                {/* Map through feedbacks and render each ad */}
                                {feedbacks.map((ad, index) => (
                                    <li key={index}>
                                        <div key={index} className="each-ad">
                                            <div className="each-ad-poster">
                                                {/* Render ad design if available */}
                                                {ad.ad_design && (
                                                    <img
                                                        src={ad.ad_design}
                                                        alt="Ad Design"
                                                        className="your-ad-image"
                                                    />
                                                )}
                                                <div className="each-ad-title">Advertisement</div>
                                            </div>
                                            {/* Display ad statistics */}
                                            <div className="each-ad-stats">
                                                <div className="ad-stat">
                                                    <div className="stat-name">Clicks</div>
                                                    {/* Display number of clicks */}
                                                    <div className="stat-value">{ad.customers ? ad.customers.length : "0"}</div>
                                                </div>
                                                <div className="ad-stat">
                                                    <div className="stat-name">Target Prints</div>
                                                    {/* Display target prints */}
                                                    <div className="stat-value">{ad.target_prints}</div>
                                                </div>
                                                <div className="ad-stat">
                                                    <div className="stat-name">Prints</div>
                                                    {/* Placeholder for number of prints */}
                                                    <div className="stat-value">1234</div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    // Display message if no feedbacks found
                    <p>No feedback found</p>
                )}
            </div>
        </>
    )
}

export default CurrentAds;