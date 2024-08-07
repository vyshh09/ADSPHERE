import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import Header from './Components/Header';
import './approve_declined_ads.css'
import { useNavigate } from 'react-router-dom';

const PaymentReq = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(0);
    const navigate = useNavigate();
    const userEmail = useState("");
    useEffect(() => {
        const fetchData = async () => {
            // console.log("started")
            try {
                setLoading(1);
                axios.get("/retrieve-ads", { // Retrieves ads from the database from this endpoint
                    params: { // parameters for the backend endpoint
                        approval: "1",  
                        payment_status: "0"
                    }
                })
                    .then(res => {
                        if (res.data.success) {
                            // console.log(res.data.ads)
                            setFeedbacks(res.data.ads) // sets the feedbacks with the data obtained from the database
                        }
                        else {
                            navigate("/login", { replace: true })
                        }
                    })
            }
            catch (error) {
                console.error('Error fetching feedback:', error);
            }
            setLoading(0)
            // console.log("ended")
        };

        fetchData();
    }, []);
    const handleClick = () => {
        console.log("clicked")
    }
    return (
        <>
            <Header type='7' />
            <div className='approved-div'>
                {loading ? (<p>Loading... </p>) : feedbacks.length > 0 ? (
                    <>
                        <div className='flex-container'>
                            <div className='content-div-alt'>
                                {feedbacks.map((item, index) => (// displays the each ad that has pending payment
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
                                                <div className='ad-detail'><b>Status:</b> Pending payment</div>
                                                :
                                                <div className='ad-detail'><b>Amount:</b> {item.admin_feedback}</div>
                                            }
                                            <div className='ad-detail'><b>Amount:</b> {item.admin_feedback}</div>

                                            <div className='pay-btn-div'>
                                                <button className='pay-button' onClick={handleClick}>Pay</button>
                                            </div>
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

export default PaymentReq;