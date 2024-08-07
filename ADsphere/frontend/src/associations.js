import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import './associations.css';
import Header from './Components/Header';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';

function Associations() {
    const [associates, setassociates] = useState([]);
    const navigate = useNavigate();
    const [toggle, setToggle] = useState(false);

    const alert = useAlert();

    useEffect(() => {       
        // State variable for checked checkboxes
        axios.get("/get-associations")
            .then(res => {
                if (res.data.success) {
                    const newassociates = res.data.associates
                    setassociates(newassociates)
                }
                else {
                    navigate("/login", { replace: true })   // Redirect to login page if request is unauthorized
                }
            })
            .catch(err => console.log('Error fetching feedback:', err))
    }, [toggle])

    const complement = { "on": "off", "off": "on"};
    const handleTogglePayments = (event, logistics_name, id, status) => {
        event.preventDefault()

        if(!status || !status.payments){
            status = "off"
        }
        else{
            status = status.payments
        }

        let text = `You are switching ${complement[status].toUpperCase()} payments for this Logistics Partner (${logistics_name})`;
        if (window.confirm(text) == true) {
            axios.post("/toggle-payments", {logistics_id: id, status: complement[status]})
                .then(res => {
                    console.log(res)
                    setToggle(!toggle);
                })
                .catch(err => console.log(err));
        } else {
            axios.post("/toggle-payments", {logistics_id: id, status: status})
                .then(res => {
                    console.log(res)
                })
                .catch(err => console.log(err));
        }
    }
    const handlePaymentRequest = (logistics_name, id) => {
        let text = `Accept payment request for ${logistics_name}`;
        if (window.confirm(text) == true) {
            axios.post("/accept-payment-request", { logistics_id: id })
                .then(res => {
                    alert.show(res.data.message)
                })
                .catch(err => console.log(err));
        }
    }

    // JSX Component
    return (
        <>
            <Header type = 'Associations' />
            <div className="associations">
                <div className="mini-association-container">
                    {associates.map((associate, index) => {
                        return (
                            <div key={index} className="associates-request-div">
                                <div className="associates-request-details">
                                    <div className="associates-request-title">Organisation Name: {associate.orgName}</div>
                                    <div className="associates-request-org">Representive Name: {associate.repName}</div>
                                    
                                    <div className="associates-request-pay-mobile">{associate.web}</div>
                                </div>
                                {associate.type === "logistics" && associate.options && associate.options.request ?
                                    <i className="fa-solid fa-info-circle" style={{ marginRight:"2%", color: "#aaa", fontSize:"120%", cursor:"pointer" }} onClick={handlePaymentRequest}></i> 
                                    : <></>
                                }
                                <a href={'https://' + associate.web}><div className="associates-request-pay">{associate.web}</div></a>
                                <div className="view-btn" style={{marginRight: 0}}>{associate.type}</div>
                                {associate.type === "logistics" ?
                                    <label class="switch">
                                        <input type="checkbox" className="slider-input" checked={ associate.options && associate.options.payments == "on" } onChange={(event) => handleTogglePayments(event, associate.orgName, associate._id, associate.options)} />
                                        <span class="slider round"></span>
                                    </label>
                                : <></>
                                }
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        </>
    )
}

export default Associations;
