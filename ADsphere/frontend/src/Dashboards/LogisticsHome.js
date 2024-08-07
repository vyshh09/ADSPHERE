import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "react-alert";
import '@fortawesome/fontawesome-free/css/all.min.css';

function LogisticsHome() {
    const [orders, setOrders] = useState([])  // State for storing orders data
    const [view, setView] = useState(0)      // State for tracking selected order for dispatch
    const [dispatch, setDispatch] = useState(false) // State for triggering order dispatch
    const [paymentsStatus, setPaymentsStatus] = useState("off");
    const [progressPayment, setProgressPayment] = useState(0);
    const [printData, setPrintData] = useState([]);

    // Alert hook for showing alerts
    const alert = useAlert();

    useEffect(() => {
        axios.get("/payments-status")
            .then(res => {
                setPaymentsStatus(res.data.status)
                setProgressPayment(res.data.total_prints * res.data.print_cost * 100 / res.data.payment_threshold)
                setPrintData(res.data);
            })
            .catch(err => console.log(err));
    }, [])

    // Component for displaying orders
    const Displayorders = () => {
        useEffect(() => {
            axios.get("/retrieve-orders")
                .then(res => {
                    const data = res.data
                    setOrders(data)
                })
                .catch(err => console.log(err))
        }, [dispatch]) // Trigger useEffect when dispatch state changes

        function handleView(index) {
            setView(index + 1) // Set view state to the index of the selected order
        }

        return (
            <div className="orders-container">
                {
                    orders.map((order, index) => {
                        if(order.status != "dispatched")
                        {
                            return (
                                <div key={index} className="approval-request-div">
                                    <div className="approval-request-div-poster"></div>
                                    <div className="order-details">
                                        <div className="approval-request-title">{order.orderId}</div>
                                        <div className="approval-request-org">{order.product_type}</div>
                                    </div>
                                    <div className="view-btn" onClick={() => handleView(index)}>View</div>
                                </div>
                            )
                        }
                    })
                }
            </div>
        )
    }

    // Function to handle dispatching an order
    const handleDispatch = () =>
    {
        axios.post(`/dispatch-order?orderId=${orders[view-1].orderId}`,{mapped_ads: orders[view-1].mapped_ads})
        .then(res => {
            console.log(res)
            if(res.data.success)
            {
                alert.success(`Order (${orders[view-1].orderId}) Dispatched`)
                console.log("dispatched successfully!");
                setDispatch(!dispatch); // Trigger useEffect to fetch updated orders
                setView(0); // Reset view state
            }
            else{
                alert.error(`Order (${orders[view-1].orderId}) Dispatch Failed`)
            }
    })
        .catch(err => console.log(err))
    }

    const handleRequestPayout = () => {
        if (progressPayment >= 100){
            axios.post("/request-payout", {total_prints: printData.total_prints})
                .then(res => {
                    alert.show(res.data.message)
                })
                .catch(err => console.log(err))
        }
    }

    // JSX for the Logistics Home component
    return (
        <>
            <div className="dashboard-container-default">
                <div className="dashboard-column">
                    <div className="mini-container mini-ad-requests-logistic">
                        <div className="mini-container-head">Orders in Logisitics</div>
                        <a href='/ad-approve'><div className="show-more">+ <span>Show More</span></div></a>
                        {Displayorders()}
                    </div>
                </div>
                <div className="dashboard-column">
                    <div className="mini-container mini-ad-requests">
                        <div className="mini-container-head">Dispatch order</div>
                        {view ? <div className="logistic-dispatch-orders-container">
                            <div className="dispatch-order-head">
                                <div className="dispatch-order-id">{orders[view-1].orderId}</div>
                            </div>
                            <div className="dispatch-order-details">
                                <div className="dispatch-order-info">product type: {orders[view-1].product_type}</div>
                                <div className="dispatch-order-info">product category: {orders[view-1].product_category}</div>
                                <div className="dispatch-order-ads">
                                    <div className="dispatch-order-ads-head">Ads</div>
                                    <div className="dispatch-order-mapped-ads">
                                        {orders[view-1].mapped_ads.map(ad => {return(
                                            <div className="dispatch-order-mapped-ad">{ad}</div>
                                        )})}
                                    </div>
                                </div>
                                {/* <div className="dispatch-btn" onClick={() => handleDispatch()}>Dispatch</div> */}
                            </div>
                        </div> : <div className="dispatch-order-not-selected">No order is selected</div>}
                    </div> 

                    
                </div>
            </div>
        </>

    )
}

export default LogisticsHome;
