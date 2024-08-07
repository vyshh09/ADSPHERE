import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Header(props) {
    let type = props.type
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const navRef = useRef();

    const handleLogout = () => {
        axios.get("/logout")
            .then(res => navigate("/login", { replace: true }))
            .catch(err => console.error(err))
    }

    const handleMenu = () => {
        if (menuOpen) {
            setMenuOpen(false)
            navRef.current.style.display = "none"
        }
        else {
            setMenuOpen(true)
            navRef.current.style.display = "flex"
        }
    }

    return (
        <>
            <header className="dashboard-header">
                <div className="logo" onClick={() => navigate("/dashboard")}>
                    Ad
                    <div className="nav-button">
                        <i className="button-icon fa-solid fa-truck-fast" style={{ fontSize: "70%" }}></i>
                        <span className="button-text">Sphere</span>
                    </div>
                </div>
                <nav ref={navRef}>
                    {
                        // advertiser
                        type === 1 ?
                            <>
                                <a href="/ad-upload" className="text-decor">
                                    <button className="nav-button ad-upload-btn">
                                        <i className="button-icon fa-solid fa-cloud-arrow-up"></i>
                                        <span className="button-text">Upload Ads</span>
                                    </button>
                                </a>
                                <a href="/approved-ads" className="text-decor">
                                    <button className="nav-button ad-feedback-btn">
                                        <i
                                            className="button-icon fa-solid fa-circle-check"></i>
                                        <span className="button-text">Approved Ads</span>
                                    </button>
                                </a>
                                <a href="/payment-req" className="text-decor">
                                    <button className="nav-button ad-feedback-btn">
                                        <i className="button-icon fa-solid fa-dollar"></i>
                                        <span className="button-text">Payment Requests</span>
                                    </button>
                                </a>
                                <a href="/declined-ads" className="text-decor">
                                    <button className="nav-button ad-feedback-btn">
                                        <i className="button-icon fa-solid fa-circle-xmark"></i>
                                        <span className="button-text">Declined Ads</span>
                                    </button>
                                </a>
                                <a href="/settings" className="text-decor">
                                    <button className="settings-btn logout-btn">
                                        <i className="button-icon fa-solid fa-cog"></i>
                                    </button>
                                </a>
                                <button className="logout-btn" onClick={handleLogout}>
                                    <i className="button-icon fa-solid fa-right-from-bracket"></i>
                                    {/* Logout */}
                                </button>
                            </>

                            // admin
                            : type === 0 ?
                                <>
                                    <a href="/curr-ads" className="text-decor">
                                        <button className="nav-button ad-upload-btn">
                                            <i className="button-icon fa-solid fa-cubes"></i>
                                            <span className="button-text">Ads on platform</span>
                                        </button>
                                    </a>
                                    <a href="/form-builder" className="text-decor">
                                        <button className="nav-button ad-feedback-btn">
                                            <i className="button-icon fa-solid fa-square-poll-horizontal"></i>
                                            <span className="button-text">Form Builder</span>
                                        </button>
                                    </a>
                                    <a href="/customer-view" className="text-decor">
                                        <button className="nav-button ad-feedback-btn">
                                            <i className="button-icon fa-solid fa-eye"></i>
                                            <span className="button-text">Customer View</span>
                                        </button>
                                    </a>
                                    <a href="/settings" className="text-decor">
                                        <button className="settings-btn logout-btn">
                                            <i className="button-icon fa-solid fa-cog"></i>
                                        </button>
                                    </a>
                                    <button className="logout-btn" onClick={handleLogout}>
                                        <i className="button-icon fa-solid fa-right-from-bracket"></i>
                                    </button>
                                </>
                                : type === 'Associations' ?
                                    <>
                                        <a href="/ad-approve" className="text-decor">
                                            <button className="nav-button ad-upload-btn">
                                                <i className="button-icon fa-solid fa-cubes"></i>
                                                <span className="button-text">Ads on platform</span>
                                            </button>
                                        </a>
                                        <a href="/form-builder" className="text-decor">
                                            <button className="nav-button ad-feedback-btn">
                                                <i className="button-icon fa-solid fa-square-poll-horizontal"></i>
                                                <span className="button-text">Form Builder</span>
                                            </button>
                                        </a>
                                        <a href="/customer-view" className="text-decor">
                                            <button className="nav-button ad-feedback-btn">
                                                <i className="button-icon fa-solid fa-eye"></i>
                                                <span className="button-text">Customer View</span>
                                            </button>
                                        </a>
                                        <a href="/dashboard#" className="text-decor">
                                            <button className="nav-button ad-upload-btn">
                                                <i className="button-icon fa-solid fa-arrow-left"></i>
                                                <span className="button-text">Dashboard</span>
                                            </button>
                                        </a>
                                        <button className="logout-btn" onClick={handleLogout}>
                                            <i className="button-icon fa-solid fa-right-from-bracket"></i>
                                        </button>
                                    </>
                                    // client login page
                                    :
                                    type === 'AdApprove' ?
                                        <>
                                            <a href="/curr-ads" className="text-decor">
                                                <button className="nav-button ad-upload-btn">
                                                    <i className="button-icon fa-solid fa-cubes"></i>
                                                    <span className="button-text">Ads on platform</span>
                                                </button>
                                            </a>
                                            <a href="/form-builder" className="text-decor">
                                                <button className="nav-button ad-feedback-btn">
                                                    <i className="button-icon fa-solid fa-square-poll-horizontal"></i>
                                                    <span className="button-text">Form Builder</span>
                                                </button>
                                            </a>
                                            <a href="/customer-view" className="text-decor">
                                                <button className="nav-button ad-feedback-btn">
                                                    <i className="button-icon fa-solid fa-eye"></i>
                                                    <span className="button-text">Customer View</span>
                                                </button>
                                            </a>
                                            <a href="/dashboard#" className="text-decor">
                                                <button className="nav-button ad-upload-btn">
                                                    <i className="button-icon fa-solid fa-arrow-left"></i>
                                                    <span className="button-text">Dashboard</span>
                                                </button>
                                            </a>
                                            <a href="/settings" className="text-decor">
                                                <button className="settings-btn logout-btn">
                                                    <i className="button-icon fa-solid fa-cog"></i>
                                                </button>
                                            </a>
                                            <button className="logout-btn" onClick={handleLogout}>
                                                <i className="button-icon fa-solid fa-right-from-bracket"></i>
                                            </button>
                                        </>
                                        :
                                        type === 'AdsOnPlatform' ?
                                            <>
                                                <a href="/dashboard#" className="text-decor">
                                                    <button className="nav-button ad-upload-btn">
                                                        <i className="button-icon fa-solid fa-arrow-left"></i>
                                                        <span className="button-text">Dashboard</span>
                                                    </button>
                                                </a>
                                                <a href="/form-builder" className="text-decor">
                                                    <button className="nav-button ad-feedback-btn">
                                                        <i className="button-icon fa-solid fa-square-poll-horizontal"></i>
                                                        <span className="button-text">Form Builder</span>
                                                    </button>
                                                </a>
                                                <a href="/customer-view" className="text-decor">
                                                    <button className="nav-button ad-feedback-btn">
                                                        <i className="button-icon fa-solid fa-eye"></i>
                                                        <span className="button-text">Customer View</span>
                                                    </button>
                                                </a>
                                                <button className="logout-btn" onClick={handleLogout}>
                                                    <i className="button-icon fa-solid fa-right-from-bracket"></i>
                                                </button>
                                            </>
                                            :
                                            type === 'FormBuilder' ?
                                                <>
                                                    <a href="/ad-approve" className="text-decor">
                                                        <button className="nav-button ad-upload-btn">
                                                            <i className="button-icon fa-solid fa-cubes"></i>
                                                            <span className="button-text">Ads on platform</span>
                                                        </button>
                                                    </a>

                                                    <a href="/dashboard#" className="text-decor">
                                                        <button className="nav-button ad-upload-btn">
                                                            <i className="button-icon fa-solid fa-arrow-left"></i>
                                                            <span className="button-text">Dashboard</span>
                                                        </button>
                                                    </a>
                                                    <a href="/customer-view" className="text-decor">
                                                        <button className="nav-button ad-feedback-btn">
                                                            <i className="button-icon fa-solid fa-eye"></i>
                                                            <span className="button-text">Customer View</span>
                                                        </button>
                                                    </a>
                                                    <button className="logout-btn" onClick={handleLogout}>
                                                        <i className="button-icon fa-solid fa-right-from-bracket"></i>
                                                    </button>
                                                </>


                                                // client login page
                                                :
                                                type == -1 ?
                                                    <>
                                                        <a href="/admin-login" className="text-decor">
                                                            <button className="nav-button ad-feedback-btn">
                                                                <i className="button-icon fa-solid fa-unlock"></i>
                                                                <span className="button-text">Admin Login</span>
                                                            </button>
                                                        </a>
                                                    </>

                                                    // admin login page
                                                    : type == -2 ?
                                                        <>
                                                            <a href="/login" className="text-decor">
                                                                <button className="nav-button ad-feedback-btn">
                                                                    <i className="button-icon fa-solid fa-user-tie"></i>
                                                                    <span className="button-text">Partner Login</span>
                                                                </button>
                                                            </a>
                                                        </> :
                                                        type === '4' ?
                                                            <>
                                                                <a href="/ad-upload" className="text-decor">
                                                                    <button className="nav-button ad-upload-btn">
                                                                        <i className="button-icon fa-solid fa-cloud-arrow-up"></i>
                                                                        <span className="button-text">Upload Ads</span>
                                                                    </button>
                                                                </a>
                                                                <a href="/approved-ads" className="text-decor">
                                                                    <button className="nav-button ad-feedback-btn">
                                                                        <i className="button-icon fa-solid fa-circle-xmark"></i>
                                                                        <span className="button-text">Approved Ads</span>
                                                                    </button>
                                                                </a>
                                                                <a href="/payment-req" className="text-decor">
                                                                    <button className="nav-button ad-feedback-btn">
                                                                        <i className="button-icon fa-solid fa-dollar"></i>
                                                                        <span className="button-text">Payment Requests</span>
                                                                    </button>
                                                                </a>

                                                                <a href="/dashboard" className="text-decor">
                                                                    <button className="nav-button ad-feedback-btn">
                                                                        <i
                                                                            className="button-icon fa-solid fa-arrow-left"></i>
                                                                        <span className="button-text">Dashboard</span>
                                                                    </button>
                                                                </a>
                                                                <button className="logout-btn" onClick={handleLogout}>
                                                                    <i className="button-icon fa-solid fa-right-from-bracket"></i>
                                                                </button>
                                                            </>
                                                            :

                                                            type === '5' ?
                                                                <>
                                                                    <a href="/ad-upload" className="text-decor">
                                                                        <button className="nav-button ad-upload-btn">
                                                                            <i className="button-icon fa-solid fa-cloud-arrow-up"></i>
                                                                            <span className="button-text">Upload Ads</span>
                                                                        </button>
                                                                    </a>
                                                                    <a href="/dashboard" className="text-decor">
                                                                        <button className="nav-button ad-feedback-btn">
                                                                            <i
                                                                                className="button-icon fa-solid fa-arrow-left"></i>
                                                                            <span className="button-text">Dashboard</span>
                                                                        </button>
                                                                    </a>
                                                                    <a href="/payment-req" className="text-decor">
                                                                        <button className="nav-button ad-feedback-btn">
                                                                            <i className="button-icon fa-solid fa-dollar"></i>
                                                                            <span className="button-text">Payment Requests</span>
                                                                        </button>
                                                                    </a>

                                                                    <a href="/declined-ads" className="text-decor">
                                                                        <button className="nav-button ad-feedback-btn">
                                                                            <i className="button-icon fa-solid fa-circle-xmark"></i>
                                                                            <span className="button-text">Declined Ads</span>
                                                                        </button>
                                                                    </a>
                                                                    <button className="logout-btn" onClick={handleLogout}>
                                                                        <i className="button-icon fa-solid fa-right-from-bracket"></i>
                                                                    </button>
                                                                </>
                                                                :

                                                                // other users
                                                                type === '6' ?
                                                                    <>
                                                                        <a href="/dashboard" className="text-decor">
                                                                            <button className="nav-button ad-upload-btn">
                                                                                <i className="button-icon fa-solid fa-arrow-left"></i>
                                                                                <span className="button-text">Dashboard</span>
                                                                            </button>
                                                                        </a>
                                                                        <a href="/approved-ads" className="text-decor">
                                                                            <button className="nav-button ad-feedback-btn">
                                                                                <i
                                                                                    className="button-icon fa-solid fa-circle-check"></i>
                                                                                <span className="button-text">Approved Ads</span>
                                                                            </button>
                                                                        </a>
                                                                        <a href="/payment-req" className="text-decor">
                                                                            <button className="nav-button ad-feedback-btn">
                                                                                <i className="button-icon fa-solid fa-dollar"></i>
                                                                                <span className="button-text">Payment Requests</span>
                                                                            </button>
                                                                        </a>

                                                                        <a href="/declined-ads" className="text-decor">
                                                                            <button className="nav-button ad-feedback-btn">
                                                                                <i className="button-icon fa-solid fa-circle-xmark"></i>
                                                                                <span className="button-text">Declined Ads</span>
                                                                            </button>
                                                                        </a>
                                                                        <button className="logout-btn" onClick={handleLogout}>
                                                                            <i className="button-icon fa-solid fa-right-from-bracket"></i>
                                                                        </button>
                                                                    </> :

                                                                    type === '7' ?
                                                                        <>
                                                                            <a href="/ad-upload" className="text-decor">
                                                                                <button className="nav-button ad-upload-btn">
                                                                                    <i className="button-icon fa-solid fa-cloud-arrow-up"></i>
                                                                                    <span className="button-text">Upload Ads</span>
                                                                                </button>
                                                                            </a>
                                                                            <a href="/approved-ads" className="text-decor">
                                                                                <button className="nav-button ad-feedback-btn">
                                                                                    <i className="button-icon fa-solid fa-circle-xmark"></i>
                                                                                    <span className="button-text">Approved Ads</span>
                                                                                </button>
                                                                            </a>
                                                                            <a href="/dashboard" className="text-decor">
                                                                                <button className="nav-button ad-feedback-btn">
                                                                                    <i
                                                                                        className="button-icon fa-solid fa-arrow-left"></i>
                                                                                    <span className="button-text">Dashboard</span>
                                                                                </button>
                                                                            </a>
                                                                            <a href="/declined-ads" className="text-decor">
                                                                                <button className="nav-button ad-feedback-btn">
                                                                                    <i className="button-icon fa-solid fa-circle-xmark"></i>
                                                                                    <span className="button-text">Declined Ads</span>
                                                                                </button>
                                                                            </a>
                                                                            <button className="logout-btn" onClick={handleLogout}>
                                                                                <i className="button-icon fa-solid fa-right-from-bracket"></i>
                                                                            </button>
                                                                        </>
                                                                        : type === '10' ?
                                                                            <>
                                                                                <a href="/settings" className="text-decor">
                                                                                    <button className="settings-btn logout-btn">
                                                                                        <i className="button-icon fa-solid fa-cog"></i>
                                                                                    </button>
                                                                                </a>
                                                                                <button className="logout-btn" onClick={handleLogout}>
                                                                                    <i className="button-icon fa-solid fa-right-from-bracket"></i>
                                                                                </button>
                                                                            </>
                                                                            : type === "external-no-login" ?
                                                                                <>
                                                                                    <a href="/login" className="text-decor">
                                                                                        <button className="nav-button">
                                                                                            <i className="button-icon fa-solid fa-right-to-bracket"></i>
                                                                                            <span className="button-text">Login</span>
                                                                                        </button>
                                                                                    </a>
                                                                                    <a href="/sign-up" className="text-decor">
                                                                                        <button className="nav-button">
                                                                                            <i className="button-icon fa-solid fa-user-plus"></i>
                                                                                            <span className="button-text">Sign Up</span>
                                                                                        </button>
                                                                                    </a>
                                                                                </>
                                                                                : type === "external-login" ?
                                                                                    <>
                                                                                        <a href="/dashboard" className="text-decor">
                                                                                            <button className="nav-button">
                                                                                                <i className="button-icon fa-solid fa-table-columns"></i>
                                                                                                <span className="button-text">Dashboard</span>
                                                                                            </button>
                                                                                        </a>
                                                                                    </> : <></>

                    }

                </nav>
                <button className="menu-icon"><i className="fa-solid fa-bars" onClick={handleMenu}></i></button>
            </header>
            {
                // type === 0 ? 
                // <h1 className="welcome-name">Welcome Admin</h1> : type === 1 ? 
                // <h1 className="welcome-name">Welcome Adverstiser</h1> :
                // <h1 className="welcome-name">Welcome Logistic Partner</h1>
            }
        </>
    )
}

export default Header;