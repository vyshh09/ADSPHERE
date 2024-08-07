import { useRef, useState } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from "./Components/Header"
import { useAlert } from 'react-alert';

// axios.defaults.baseURL = "/api/"

function Login({ admin }) {
    const alert = useAlert(); // used for displaying alerts
    const navigate = useNavigate();
    const [advertiserLogin, setAdvertiserLogin] = useState(true);

    const refs = {
        email: useRef(),
        password: useRef()
    }
    
    const handleSubmit = async (event) => {
        //handles the submission of login credentials
        event.preventDefault();
        let values = {
            email: refs.email.current.value,
            password: refs.password.current.value,
            type: admin ? "admin": advertiserLogin ? "advertiser": "logistics"
        }

        axios.post("/login", values)
            .then(res => {
                // console.log(res.data)
                // checks for the correctness of the credintials
                alert.show(res.data.message)
                if(res.data.login === 1){
                    navigate("/dashboard")
                }
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

    return (
        <div className='App'>
            { !admin ? 
                <Header type={-1}/> 
                // Renders the navbar conditionally
            :
                <Header type={-2} />
            }

            <div className='login-div'>
                { !admin ? // Renders the content conditionally
                    <div className='login-category'>
                        <div ref={advertiserRef} className='login-advertiser selected-category' onClick={switchLogin}>As Advertiser</div>
                        <div ref={logisticsRef} className='login-logistics' onClick={switchLogin}>As Logistics</div>
                    </div>
                    :
                    <div className='login-category'>
                        <div className='login-advertiser selected-category'>As Admin</div>
                    </div>
                }

                <form className='login-form' onSubmit={handleSubmit}>
                    <div className='login-head'>Login</div>
                    <label htmlFor='email'>Email</label>
                    <input ref={refs.email} type='email' name='email' required/>
                    <label htmlFor='password'>Password</label>
                    <input ref={refs.password} type='password' name='password' required/>

                    <button type='submit' className='submit-btn'>Login</button>

                    { !admin ? 
                        <div className='sign-up-hook'>Don't have an account? Sign Up <a href='/sign-up'>here.</a></div>
                      :
                      <></>
                    }
                </form>
            </div>
        </div>
    );
}

export default Login;
