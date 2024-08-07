import React, { useEffect } from 'react';
import './ext_home_page.css';
import { useState } from 'react';
import axios from 'axios';
import Header from './Components/Header';

const HomePage = () => {
    const [typeText, setTypeText] = useState('')
    const [login, setLogin] = useState("external-no-login");

    useEffect(() => {
        axios.get('/verify-login')
        .then(res => {
            if(res.data.valid){                
                setLogin("external-login");
            }
        })
    }, [])

    return (
        <div className='home-page-container'>

            <Header type={login}/>
            <div className='intro-container-parent'>
                <div className='intro-container'>
                    <div className='sub-title'>Welcome to</div>
                    <div className='main-title'>Ad<span>Sphere</span></div>
                    <div className='intro-description'><h2>Because, every box is an oppurtunity!</h2></div>
                </div>
                <div className='picture-container'></div>            
            </div>
            <div className='users-container'>
                <div className='users-head'>Join our team<span>.</span></div>
                <div className='user-cards-container'>
                    <div className='user-card'>
                        <i className='user-card-icon fa-solid fa-user-tie'></i>
                        <div className='user-card-title'>Advertiser</div>
                        <div className='user-card-desc'>Excepteur ex irure do consequat laborum fugiat sint duis proident et ea laboris. Incididunt non ex quis sunt eu incididunt.</div>
                        <div className='user-card-learn-more'>Learn More</div>
                    </div>
                    <div className='user-card'>
                        <i className='user-card-icon fa-solid fa-truck-fast'></i>
                        <div className='user-card-title'>Logistics</div>
                        <div className='user-card-desc'>Excepteur ex irure do consequat laborum fugiat sint duis proident et ea laboris. Incididunt non ex quis sunt eu incididunt.</div>
                        <div className='user-card-learn-more'>Learn More</div>
                    </div>
                </div>
            </div>
       </div>
    );
};

export default HomePage;
