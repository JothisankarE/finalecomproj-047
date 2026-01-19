// import React, { useContext, useState } from 'react'
// import './LoginPopup.css'
// import { assets } from '../../assets/assets'
// import { StoreContext } from '../../Context/StoreContext'
// import axios from 'axios'
// import { toast } from 'react-toastify'

// const LoginPopup = ({ setShowLogin }) => {

//     const { setToken, url, loadCartData } = useContext(StoreContext)
//     const [currState, setCurrState] = useState("Sign Up");
//     const [errorMessage, setErrorMessage] = useState(""); // New state for error message

//     const [data, setData] = useState({
//         name: "",
//         email: "",
//         password: ""
//     })

//     const onChangeHandler = (event) => {
//         const name = event.target.name
//         const value = event.target.value

//         // Name validation to ensure only characters are allowed
//         if (name === 'name') {
//             const regex = /^[A-Za-z\s]*$/;  // Only letters and spaces
//             if (!regex.test(value)) {
//                 setErrorMessage("Name can only contain letters.");
//             } else {
//                 setErrorMessage("");  // Clear error message if valid
//             }
//         }

//         setData(data => ({ ...data, [name]: value }))
//     }

//     const onLogin = async (e) => {
//         e.preventDefault()

//         // Prevent submission if name has invalid characters
//         if (errorMessage) {
//             toast.error("Username should be in alphabet format");
//             return;
//         }

//         let new_url = url;
//         if (currState === "Login") {
//             new_url += "/api/user/login";
//         }
//         else {
//             new_url += "/api/user/register"
//         }
//         const response = await axios.post(new_url, data);
//         if (response.data.success) {
//             setToken(response.data.token)
//             localStorage.setItem("token", response.data.token)
//             loadCartData({ token: response.data.token })
//             setShowLogin(false)
//         }
//         else {
//             toast.error(response.data.message)
//         }
//     }

//     return (
//         <div className='login-popup'>
//             <form onSubmit={onLogin} className="login-popup-container">
//                 <div className="login-popup-title">
//                     <h2>{currState}</h2> <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
//                 </div>
//                 <div className="login-popup-inputs">
//                     {currState === "Sign Up" ? (
//                         <>
//                             <input
//                                 name='name'
//                                 onChange={onChangeHandler}
//                                 value={data.name}
//                                 type="text"
//                                 placeholder='Your name'
//                                 required
//                             />
//                             {errorMessage && <p className="error-message">{errorMessage}</p>}  {/* Display error message */}
//                         </>
//                     ) : <></>}
//                     <input
//                         name='email'
//                         onChange={onChangeHandler}
//                         value={data.email}
//                         type="email"
//                         placeholder='Your email'
//                         required
//                     />
//                     <input
//                         name='password'
//                         onChange={onChangeHandler}
//                         value={data.password}
//                         type="password"
//                         placeholder='Password'
//                         required
//                     />
//                 </div>
//                 <button>{currState === "Login" ? "Login" : "Create account"}</button>
//                 <div className="login-popup-condition">
//                     <input type="checkbox" required />
//                     <p>By continuing, I agree to the terms of use & privacy policy.</p>
//                 </div>
//                 {currState === "Login"
//                     ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
//                     : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
//                 }
//             </form>
//         </div>
//     )
// }

// export default LoginPopup


import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPopup = ({ setShowLogin }) => {
    const { setToken, url, loadCartData } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login"); // Default to Login, but logic supports switching
    const [errorMessage, setErrorMessage] = useState("");

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        if (name === 'name') {
            const regex = /^[A-Za-z\s]*$/;
            if (!regex.test(value)) {
                setErrorMessage("Name can only contain letters.");
            } else {
                setErrorMessage("");
            }
        }

        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (e) => {
        e.preventDefault();

        // Check validation only for Sign Up
        if (currState === "Sign Up" && errorMessage) {
            toast.error("Username should be in alphabet format");
            return;
        }

        let new_url = url;
        if (currState === "Login") {
            new_url += "/api/user/login";
        } else {
            new_url += "/api/user/register";
        }

        try {
            const response = await axios.post(new_url, data);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                loadCartData({ token: response.data.token });
                setShowLogin(false);
                if (currState === "Sign Up") {
                    navigate("/confirm");
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error(error);
        }
    };

    return (
        <div className='login-popup'>
            <div className="login-popup-container">

                {/* Form Section (Left Side visually via CSS order: 1) */}
                <form onSubmit={onLogin} className="login-popup-form-section">
                    <div className="login-popup-title">
                        <h2>{currState === "Sign Up" ? "Sign up to Handloom" : "Sign In to Handloom"}</h2>
                        <div className="social-login">
                            <div className="social-icon">f</div>
                            <div className="social-icon">G</div>
                            <div className="social-icon">a</div>
                        </div>
                        <p style={{ textAlign: 'center', color: '#999', fontSize: '13px', marginBottom: '10px' }}>or do via email</p>
                        {currState === "Login" && (
                            <p style={{ textAlign: 'center', color: '#2196f3', fontSize: '12px', marginBottom: '15px', fontWeight: '500' }}>
                                Demo: user@example.com / password123
                            </p>
                        )}
                    </div>

                    <div className="login-popup-inputs">
                        {currState === "Sign Up" && (
                            <>
                                <input
                                    name='name'
                                    onChange={onChangeHandler}
                                    value={data.name}
                                    type="text"
                                    placeholder='Your name'
                                    required
                                />
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                            </>
                        )}
                        <input
                            name='email'
                            onChange={onChangeHandler}
                            value={data.email}
                            type="email"
                            placeholder='Email address'
                            required
                        />
                        <input
                            name='password'
                            onChange={onChangeHandler}
                            value={data.password}
                            type="password"
                            placeholder='Password'
                            required
                        />
                    </div>

                    <button className="submit-btn">{currState === "Login" ? "Sign In" : "Sign Up"}</button>

                    <div className="login-popup-condition">
                        <p>{currState === "Sign Up" ? "Already have an account?" : "Don't have an account?"} <span onClick={() => setCurrState(currState === "Login" ? "Sign Up" : "Login")} style={{ color: 'var(--primary-blue)', cursor: 'pointer', fontWeight: 'bold' }}>{currState === "Login" ? "Sign Up" : "Sign In"}</span></p>
                    </div>
                </form>

                {/* Sidebar (Right Side visually via CSS order: 2) - Image Only */}
                <div className="login-popup-sidebar">
                    <img
                        onClick={() => setShowLogin(false)}
                        src={assets.cross_icon}
                        alt="Close"
                        className="close-on-image"
                    />
                </div>

            </div>
        </div >
    );
}

export default LoginPopup;
