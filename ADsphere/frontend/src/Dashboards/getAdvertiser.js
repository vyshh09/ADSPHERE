import React, { useEffect, useState } from "react";
import axios from "axios";

function GetDetails(ad_id) {
    const [advertiserDetails, setadvertiserDetails] = useState([])
    useEffect(() => {
        axios.get("/get-advertiser-details", {
            params: {
                ad_id: ad_id,
            }
        })
            .then(res => {
                const data = res.data.details
                setadvertiserDetails(data)
            })
            .catch(err => console.log(err))
    }, [ad_id])
    return (
        <div className="approval-request-org">{advertiserDetails.repName}</div>
    )
}

export default GetDetails;