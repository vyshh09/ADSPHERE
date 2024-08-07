import React, { useEffect } from 'react';
import './ext_home_page.css';
import { useState } from 'react';


const HomePage = () => {
    const [typeText, setTypeText] = useState('')
    useEffect(() => {
        const textToType = "Maarketing your ads door to door: Print, Pack, and Ship Ads with Ease!";
        let currentIndex = 0;
    
        const typeTextInterval = setInterval(() => {
          setTypeText(prevText => prevText + textToType[currentIndex]);
          currentIndex++;
    
          if (currentIndex === textToType.length-1) {
            clearInterval(typeTextInterval);
          }
        }, 70); // Adjust typing speed here (in milliseconds)
    
        return () => {
          clearInterval(typeTextInterval);
        };
      }, [] );
    
    
    return (
        <div className='ext-home-pg-div'>
            <div className='header-div'>
        <div className='bg-overlay-1'></div>
                <div className="logo">
                    Ad
                    <div className="nav-button">
                        <i className="button-icon fa-solid fa-truck-fast" style={{ fontSize: "70%" }}></i>
                        <span className="button-text">Sphere</span>
                    </div>
                </div>
                <nav>
                    <>
                        <a href="/about" className="text-decor">
                            <button className="nav-button ad-upload-btn">
                                <span className="button-text">About Us</span>
                                <i className="button-icon fa-solid fa-info-circle"></i>
                            </button>
                        </a>
                        <a href="/login" className="text-decor">
                            <button className="nav-button ad-feedback-btn">
                                <span className="button-text">Login</span>
                                <i className="button-icon fa-solid fa-user-circle"></i>
                            </button>
                        </a>
                        <a href="/sign-up" className="text-decor">
                            <button className="nav-button ad-feedback-btn">
                                <span className="button-text">Sign-up</span>
                                <i className="button-icon fa-solid fa-user-plus"></i>
                            </button>
                        </a>

                    </>
                </nav>
            </div>
            <div className='body-div'>
                <div className='bg-overlay'></div>
                <div className='content-div'>
                    <h1 className='welcome-hdg'>Welcome to Box Ads</h1>
                <p className='ext-content'>{typeText}</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
