import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import Header from './Components/Header';

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
    < >
      <strong style={{ color: 'black' }}>Organisation name:</strong>
      {advertiserDetails.length > 0 && (advertiserDetails[0].orgName)},
    </>
  );
}

const AdApprove = () => {
  const [allAds, setAllAds] = useState([]);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();
  const alert = useAlert();

  useEffect(() => {
    // Make GET request to fetch all ads
    axios.get("/verify-login")
      .then(res => {
        if (!res.data.valid || res.data.type !== "admin") {
          navigate("/admin-login", { replace: true })
          return
        }

        axios.get('/retrieve-ads', {
          params: {
            approval: "null",
            payment_status: "0"
          }
        })
          .then(response => {
            if (response.data.success) {
              // const filteredAds = response.data.data.filter(ad => ad.approval != "1" && ad.approval != "0");
              const filteredAds = response.data.ads;
              setAllAds(filteredAds);
              // console.log(filteredAds)
              // console.log("fetched Ads")
            }
            else
              console.error("Error fetching ads: ", response.data.error)
          })
          .catch(error => {
            console.error('Error fetching all ads:', error);
          });
      })
      .catch(err => console.log(err));
  }, []);

  // Changes the approval status after approving and asks to quote the amount 
  const changeStatus = (adId) => {
    const confirmApprove = window.confirm('Are you sure you want to Approve this ad?');
    if (confirmApprove) {
      const userFeedback = prompt('Please provide quote for publishing the ad:');
      if (userFeedback !== null) {
        setFeedback(userFeedback);
        axios.post('/ad-approve/update', { ad_id: adId, approval: "1", payment_status: "0", admin_feedback: userFeedback })
          .then(response => {
            // Update the state or trigger a new fetch if needed
            // For simplicity, we'll just log the response
            alert.success(`Ad approval status updated`);
            console.log('Ad approval status updated:', response.data);
            setAllAds(prevAds => prevAds.filter(ad => ad.ad_id !== adId));
          })
          .catch(error => {
            console.error('Error updating ad approval status:', error);
          });
      }
    }
  };
  //Changes the approval status after decling the ads, also asks for admin feedback
  const handleDecline = (adId) => {
    const confirmDecline = window.confirm('Are you sure you want to decline this ad?');
    if (confirmDecline) {
      const userFeedback = prompt('Please provide feedback for declining the ad:');
      if (userFeedback !== null) {
        setFeedback(userFeedback);
        axios.post('/ad-approve/update', { ad_id: adId, approval: "0", payment_status: "0", admin_feedback: userFeedback })
          .then(response => {
            // Update the state or trigger a new fetch if needed
            // For simplicity, we'll just log the response
            alert.success(`Ad approval status updated: ${response.data}`);
            console.log('Ad approval status updated:', response.data);
            setAllAds(prevAds => prevAds.filter(ad => ad.ad_id !== adId));
          })
          .catch(error => {
            console.error('Error updating ad approval status:', error);
          });
      }
    }
  };
  return (
    <>
      <Header type='AdApprove' />
      <div>
        <div className='approve-div'>
          <ul>
            {allAds.map(ad => (
              <li key={ad.ad_id} style={{ color: 'black' }}>
                <strong style={{ color: 'black' }}>Ad ID:</strong>{ad.ad_id},<br /><GetDetails adId={{ adId: ad.ad_id }} /> <br /><strong style={{ color: 'black' }}>Category:</strong> {ad.ad_category},<br /> <strong style={{ color: 'black' }}>Description:</strong> {ad.ad_description}, <br /> <strong style={{ color: 'black' }}>Number of targeted prints: </strong> {ad.target_prints}
                <br />
                {ad.ad_design && (
                  <img
                    // src={`data:${ad.ad_design.contentType};base64,${ad.ad_design.data.toString('base64')}`} 
                    src={ad.ad_design}
                    alt="Ad Design"
                    style={{ maxWidth: '100%', maxHeight: '200px' }} className='ad-design'
                  />
                )}
                <br />
                <button onClick={() => changeStatus(ad.ad_id)} className='accept-btn'> Approve </button>
                <button onClick={() => handleDecline(ad.ad_id)} className='decline-btn'> Decline </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdApprove;