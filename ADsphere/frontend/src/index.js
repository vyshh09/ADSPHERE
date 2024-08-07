import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DeclinedAds from './DeclinedAds';
import ApprovedAds from './ApprovedAds';
import AdForm from './AdForm';
import Addque from './Addque'
import SignUp from './SignUp';
import Login from './Login';
import FormBuilder from './FormBuilder';
import Dashboard from './Dashboard';
import AdApprove from './AdApprove';
import HomePage from './ExtHomePage.js';
import './index.css';
import Settings from './settings.js';
import PaymentReq from './PaymentReq.js';
import Dummy from './dummy.js';
import CurrentAds  from './admin_approved_ads.js';
import Associations from './associations.js';

import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: 2500,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.FADE,
  containerStyle: {
    zIndex: 100,
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  // Routes for all the components and the pages are added here
    <AlertProvider template={AlertTemplate} {...options}>
    <BrowserRouter>
      <Routes>

        {/* Advertiser */}
        <Route path="/ad-upload" element={<AdForm />} />
        <Route path="/approved-ads" element={<ApprovedAds/>}/>
        <Route path="/declined-ads" element={<DeclinedAds/>}/>

        {/* All Users */}
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path='/' element={<HomePage />}/>

        {/* Authorized Users */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/settings' element={<Settings/>}/>
        
        {/* Admin */}
        <Route path="/ad-approve" element={<AdApprove />} />
        <Route path="/admin-login" element={<Login admin={true} />} />
        <Route path="/form-builder" element={<Addque/>}/>
        <Route path="/customer-view" element={<FormBuilder qr_link_id={null}/>}/>
        <Route path="/payment-req" element={<PaymentReq/>}/>
        <Route path="/curr-ads" element={<CurrentAds/>}/>
        <Route path='/associations' element={<Associations/>}/>

        {/* Customer */}
        <Route path="/dummy" element={<Dummy/>}/>
      </Routes>
    </BrowserRouter>
    </AlertProvider>
  // </React.StrictMode>
);
