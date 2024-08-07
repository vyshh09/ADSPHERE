import React, { useEffect, useRef, useState } from "react";
import PieChart from "./Pie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";


function AdvertiserHome() {
    // State variables
    // const display_adinfo = useRef(null);
    const [ads, setads] = useState([]) // State for storing ads data
    const [userEmail, setUserEmail] = useState(""); // State for storing user email
    const navigate = useNavigate(); // Hook for navigation
    const alert = useAlert(); // Hook for showing alerts
    const [currrReach, setCurrReach] = useState(0) // State for current reach

    // Effect hook for verifying login and fetching user email
    useEffect(() => {
        // Make GET request to verify login
        axios.get('/verify-login')
            .then(res => {
                if (!res.data.valid || res.data.type !== "advertiser") {
                    // If user is not valid or not an advertiser, redirect to login page
                    alert.error("Unauthorized User!")
                    navigate("/login", { replace: true })
                    return
                }
                setUserEmail(res.data.email);
            })
    })
    
    // Component for displaying ads
    // const adIdPattern = userEmail + '_';
    const Displayads = () => {
        useEffect(() => {
            axios.get("/retrieve-ads", {
                params: {
                    // ad_id: adIdPattern,
                    approval: "1",
                    payment_status: "1"
                }
            })
                .then(res => {
                    const newads = res.data.ads
                    setads(newads)
                    let count = 0
                    newads.map(element => {
                        if(element.customers){
                            count += element.customers.length
                            console.log(count)
                        }
                        else count += 0
                    });
                    setCurrReach(count)
                })
                .catch(err => console.log(err))
        }, [])
        return (
            <>
                {
                    ads.map((ad, index) => {
                        return (
                            <div key={index} className="each-ad">
                                <div className="each-ad-poster">
                                    {ad.ad_design && (
                                        <img
                                            src={ad.ad_design}
                                            alt="Ad Design"
                                            className="your-ad-image"
                                        />
                                    )}
                                    <div className="each-ad-title">Advertisement</div>
                                </div>
                                <div className="each-ad-stats">
                                    <div className="ad-stat">
                                        <div className="stat-name">Clicks</div>
                                        <div className="stat-value">{ad.customers ? ad.customers.length : "0"}</div>
                                    </div>
                                    <div className="ad-stat">
                                        <div className="stat-name">Target Prints</div>
                                        <div className="stat-value">{ad.target_prints}</div>
                                    </div>
                                    <div className="ad-stat">
                                        <div className="stat-name">Prints</div>
                                        <div className="stat-value">{ad.prints}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </>
        )
    }
    const [data, setData] = useState({
        labels: ['Awaiting Approval', 'Current Ads', 'Pending Payments', 'Declined Ads'],
        values: [],
        colors: ['#80CAFFff', '#85E0A3ff', '#FFD966ff', '#FEAEA2ff'],
    });
    // Effect hook for fetching stats data for pie chart
    useEffect(() => {
        axios.get("/get-stats")
            .then(res => {
                const interval = setInterval(() => {
                    setData(prevData => {
                        return {
                            ...prevData,
                            values: res.data.data
                        };
                    });
                }, 60000); // 1 milli seconds
                setData(prevData => {
                    return {
                        ...prevData,
                        values: res.data.data
                    };
                });
                return () => clearInterval(interval);
            })
            .catch(err => console.log(err))
    }, []);
    // JSX for the advertiser home component
    return (
        <div className="dashboard-container-default">
            <div className="dashboard-column">
                <div className="mini-container mini-your-ad">
                    <div className="mini-container-head">Your Ads</div>
                    <a href="/approved-ads"><div className="show-more">+ Show More</div></a>
                    <div className="ads-container">
                        {/* <Displayads display_adinfo={display_adinfo} /> */}
                        {Displayads()}
                    </div>
                </div>
            </div>
            <div className="dashboard-column">
                <div className="mini-container mini-current-reach">
                    <div className="mini-container-head">Current Reach</div>
                    <div className="current-reach-text"><h2>Your Ads have reached {currrReach} people 🥳🥳</h2></div>
                    <a href="/approved-ads" className="current-reach-link">Click here to view details</a>
                </div>
                <div className="mini-container mini-ad-stats">
                    <div className="mini-container-head">Stats</div>
                    <div className="stats-pie-image">

                        <PieChart data={data} />
                    </ div>
                    {/* <img src="../images/pie.png" alt="Pie Design" className="stats-pie-image" /> */}
                </div>
            </div>
        </div>
    )
}

export default AdvertiserHome;
