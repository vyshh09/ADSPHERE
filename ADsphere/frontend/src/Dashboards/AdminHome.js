import React, { useEffect, useState } from "react";
import PieChart from "./Pie";
import axios from "axios";

// This gets the advertiser details of a particular ad
function GetDetails({ adId }) {
    const [advertiserDetails, setadvertiserDetails] = useState([]);
    useEffect(() => {
        var underscoreIndex = adId.adId.lastIndexOf("_");
        var advertiser_email = adId.adId.substring(0, underscoreIndex);

        axios.get("/get-advertiser-details", {
            params: {
                email: advertiser_email,
            }
        })
            .then(res => {
                const newdetails = res.data.details;
                setadvertiserDetails(newdetails);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="approval-request-org">
            {advertiserDetails.length > 0 && (
                <>
                    {advertiserDetails[0].orgName}
                </>
            )}
        </div>
    );
}


function AdminHome() {
    const [ads, setads] = useState([])
    const [advCont, setAdvCount] = useState(0)
    const [logCount, setLogCount] = useState(0)

    useEffect(() => {
        // Make GET request to fetch all aproved ads
        axios.get("/retrieve-ads", {
            params: {
                approval: "1",
                payment_status: "1"
            }
        })
            .then(res => {
                const newads = res.data.ads
                setads(newads)
            })
            .catch(err => console.log(err))
    }, [])

    const [associates, setassociates] = useState([])

    useEffect(() => {
        // Make GET request to fetch the advertiser and logistics partners count
        axios.get("/get-associations")
            .then(res => {
                const newassociates = res.data.associates
                setassociates(newassociates)
                let advTempCount = 0
                let logTempCount = 0
                newassociates.map((associate) => {
                    if (associate.type === "advertiser") {
                        advTempCount += 1
                    }
                    else if (associate.type === "logistics") {
                        logTempCount += 1
                    }
                })
                // Sets the advertiser count
                setAdvCount(advTempCount)
                // Sets the logistics count
                setLogCount(logTempCount)
            })
            .catch(err => console.log(err))
    }, [])

    const [data, setData] = useState({
        labels: ['Awaiting Approval', 'Current Ads', 'Pending Payments', 'Declined Ads'],
        values: [],
        colors: ['#80CAFFff', '#85E0A3ff', '#FFD966ff', '#FEAEA2ff'],
    });
    useEffect(() => {
        // Make GET request to fetch all the data for statistics
        axios.get("/get-stats")
            .then(res => {
                const interval = setInterval(() => {
                    setData(prevData => {
                        return {
                            ...prevData,
                            values: res.data.data
                        };
                    });
                }, 100); // 1 milli seconds

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
    const [approvalDatas, setapprovalDatas] = useState([])

    useEffect(() => {
        // Make GET request to fetch all the ads that yet to be approved or declined
        axios.get("/retrieve-ads", {
            params: {
                approval: "null",
                payment_status: "0"
            }
        })
            .then(res => {
                if (res.data.success) {
                    // const newads = res.data.ads
                    setapprovalDatas(res.data.ads);
                    console.log(res.data.ads)
                }
                else
                    console.error("Error fetching ads: ", res.data.error)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <div className="dashboard-container-default">
            <div className="dashboard-column">
                <div className="mini-container mini-stats">
                    <div className="mini-container-head">Statistics</div>
                    <div className="pie-chart" >
                        {/* <div className="stats-pie-image"> */}
                        <PieChart data={data} />
                        {/* </ div> */}
                    </div>
                </div>
                <div className="mini-container mini-published-ads active-container">
                    <div className="mini-container-head">Published Ads</div>
                    <a href="/curr-ads"><div className="show-more">+ <span>Show More</span></div></a>
                    <div className="ads-container">
                        {ads.map((ad, index) => {
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
                    </div>
                    <div className="show-more-fade"><i className="fa-solid fa-angle-down"></i>Show More</div>
                </div>
            </div>
            <div className="dashboard-column">
                <div className="mini-container mini-ad-requests" style={{ overflow: 'scroll', scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
                    <div className="mini-container-head">Approval Requests</div>
                    <a href='/ad-approve'><div className="show-more">+ <span>Show More</span></div></a>
                    <div className="approval-requests-container">
                        {approvalDatas.map((data, index) => {
                            return (
                                <div key={index} className="approval-request-div">
                                    <div className="approval-request-div-poster">
                                        {data.ad_design && (
                                            <img
                                                src={data.ad_design}
                                                alt="Ad Design"
                                                className="your-ad-image"
                                            />
                                        )}
                                    </div>
                                    <div className="approval-request-details">
                                        <div className="approval-request-title">{data.ad_description}</div>
                                        <GetDetails adId={{ adId: data.ad_id }} />
                                        {/* <div className="approval-request-pay-mobile">$ 900.8</div> */}
                                    </div>
                                    {/* <div className="approval-request-pay">$ 900.8</div> */}
                                    <div className="view-btn"><a href='/ad-approve'>View</a></div>
                                </div>
                            )
                        })
                        }
                    </div>
                </div>
                <div className="mini-container mini-associations">
                    <div className="mini-container-head">Associations</div>
                    <a href="/associations"><div className="show-more">+ <span>Show More</span></div></a>
                    <div className="ass-prnt-div">
                        <div className="adv-log-cnt-div">
                            <h3>Advertisers</h3>
                            <div className="count-adv-log">{advCont}</div>
                        </div>
                        <div className="adv-log-cnt-div">
                            <h3>Logistic Partners</h3>
                          <div className="count-adv-log">{logCount}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminHome;
