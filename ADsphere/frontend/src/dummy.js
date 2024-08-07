import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import FormBuilder from "./FormBuilder";

const Dummy = () => {
    // Extracting the 'qr_link_id' query parameter from the URL using useSearchParams
    const [searchparams] = useSearchParams();
    const id = searchparams.get('qr_link_id');

    // State to track if the QR code is valid
    const [valid, setvalid] = useState(false);

    // Effect hook to fetch data from the server when the component mounts
    useEffect(() => {
        // Logging the URL with the qr_link_id
        console.log(`/verify-qr?qr_link_id=${id}`)
        
        // Making a GET request to the server to verify the QR code
        axios.get(`/verify-qr?qr_link_id=${id}`)
            .then(res => {
                // Logging the response from the server
                console.log(res)
                // If the server response indicates success, update the 'valid' state
                if(res.data.success === true) {
                    const newvalid = !valid
                    setvalid(newvalid)
                }
            })
            .catch(err => console.log(err))
    }, []) // Empty dependency array ensures this effect runs only once, similar to componentDidMount

    // Function to display the content if the QR code is valid
    const displayContent = () => {
        return (
            <>
                <FormBuilder qr_link_id={id}/> {/* Pass the qr_link_id to the FormBuilder component */}
            </>
        )
    }
    
    // Render content based on the 'valid' state
    return (
        <>
            {valid ? displayContent() : <p>page not found!</p>}
        </>
    )
}

export default Dummy
