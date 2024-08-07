import { useRef, useState } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Components/Header';
import { useAlert } from 'react-alert';

// axios.defaults.baseURL = "/api/"
// This is the code for hanfdling the new user registration
function SignUp() { 
    const navigate = useNavigate();
    const [advertiserLogin, setAdvertiserLogin] = useState(true);
    const alert = useAlert();

    const refs = {
        orgName: useRef(),
        repName: useRef(),
        password: useRef(),
        cnfPassword: useRef(),
        email: useRef(),
        web: useRef()
    }

    const handleSubmit = async (event) => { // handles the submission of user registration form
        event.preventDefault();

        if (refs.password.current.value !== refs.cnfPassword.current.value){
            alert.error("Passwords do not match!")
            return
        }

        let values = { // initializes the values variable
            email: refs.email.current.value,
            password: refs.password.current.value,
            orgName: refs.orgName.current.value,
            web: refs.web.current.value,
            repName: refs.repName.current.value,
            type: advertiserLogin ? "advertiser": "logistics"
        }

        axios.post("/sign-up", values) // post request to set the user details to database
            .then(res => {
                alert.show(res.data.message)
                if (res.data.signUp === 0){
                    return
                }
                navigate("/login");
            })
            .catch(err => console.log(err));
    }

    const advertiserRef = useRef();
    const logisticsRef = useRef();

    const switchLogin = (event) => {
        let className = event.target.className;
        if (className.includes("selected-category")){
            return
        }
        advertiserRef.current.classList.toggle("selected-category")
        logisticsRef.current.classList.toggle("selected-category")
        setAdvertiserLogin(!advertiserLogin);
    }

    return ( // handles the toggling between the advertiser and logistics sign up and also handling the signup
        <div className='App'>
            <Header />
            <div className='login-div sign-up-div'>
                <div className='login-category'>
                    <div ref={advertiserRef} className='login-advertiser selected-category' onClick={switchLogin}>As Advertiser</div>
                    <div ref={logisticsRef} className='login-logistics' onClick={switchLogin}>As Logistics</div>
                </div>

                <form className='login-form' onSubmit={handleSubmit}>
                    <div className='login-head'>Sign Up</div>
                    <div className='input-container'>
                        <div className='sub-container'>
                            <label htmlFor='name'>Organisation Name</label>
                            <input ref={refs.orgName} type='name' name='name' required/>
                            <label htmlFor='rep-name'>Representative Name</label>
                            <input ref={refs.repName} type='text' name='rep-name' required/>
                        </div>
                        <div className='sub-container'>
                            <label htmlFor='web'>Organisation Website</label>
                            <input ref={refs.web} type='text' name='web' required/>
                            <label htmlFor='email'>Representative Email</label>
                            <input ref={refs.email} type='email' name='email' required/>
                        </div>
                    </div>
                    <div className='sub-container-alt'>
                        <div>
                            <label htmlFor='password'>Password</label>
                            <input ref={refs.password} type='password' name='password' required/>
                        </div>
                        <div>
                            <label htmlFor='confirm-password'>Confirm Password</label>
                            <input ref={refs.cnfPassword} type='password' name='confirm-password' required/>
                        </div>
                    </div>

                    <button type='submit' className='submit-btn'>Sign Up</button>
                    <div className='sign-up-hook'>Already have an account? Login <a href='/login'>here.</a></div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
