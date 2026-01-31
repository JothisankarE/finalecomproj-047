import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPopup.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaTimes, FaGoogle, FaFacebookF, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPopup = ({ setShowLogin }) => {
    const { setToken, url, loadCartData } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        if (name === 'name') {
            const regex = /^[A-Za-z\s]*$/;
            setErrorMessage(!regex.test(value) ? "Name can only contain letters." : "");
        }

        if (name === 'confirmPassword') {
            setPasswordError(value !== data.password ? "Passwords do not match" : "");
        }

        if (name === 'password' && data.confirmPassword) {
            setPasswordError(value !== data.confirmPassword ? "Passwords do not match" : "");
        }

        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (e) => {
        e.preventDefault();

        if (currState === "Sign Up") {
            if (errorMessage) {
                toast.error("Please fix the validation errors");
                return;
            }
            if (data.password !== data.confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
            if (data.password.length < 6) {
                toast.error("Password must be at least 6 characters");
                return;
            }
        }

        setIsLoading(true);

        const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";
        const new_url = `${url}${endpoint}`;

        try {
            const response = await axios.post(new_url, data);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                loadCartData({ token: response.data.token });
                setShowLogin(false);
                if (currState === "Sign Up") navigate("/confirm");
                toast.success(currState === "Login" ? "Welcome back!" : "Account created successfully!");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='login-popup-overlay' onClick={(e) => e.target.className === 'login-popup-overlay' && setShowLogin(false)}>
            <div className={`login-popup-container ${currState === "Sign Up" ? "sign-up-mode" : ""}`}>
                
                {/* Close Button */}
                <button className="popup-close-btn" onClick={() => setShowLogin(false)}>
                    <FaTimes />
                </button>

                {/* Left Panel - Branding & Info */}
                <div className="login-panel left-panel">
                    <div className="panel-content">
                        <div className="brand-header">
                            <span className="brand-icon">🧵</span>
                            <span className="brand-name">Handloom</span>
                        </div>
                        <div className="panel-text">
                            <h1>{currState === "Login" ? "Welcome Back!" : "Join Us!"}</h1>
                            <p>
                                {currState === "Login" 
                                    ? "Access your orders, wishlist, and recommendations." 
                                    : "Create an account to unlock exclusive offers and faster checkout."}
                            </p>
                        </div>
                        <div className="panel-features">
                            <div className="p-feature"><span>✨</span> Premium Quality</div>
                            <div className="p-feature"><span>🚚</span> Fast Delivery</div>
                            <div className="p-feature"><span>🛡️</span> Secure Payment</div>
                        </div>
                    </div>
                    <div className="panel-decoration"></div>
                </div>

                {/* Right Panel - Form */}
                <div className="login-panel right-panel">
                    <div className="form-container">
                        <div className="form-header">
                            <h2>{currState === "Login" ? "Sign In" : "Create Account"}</h2>
                            <p className="subtitle">
                                {currState === "Login" ? "Please login to continue" : "Get started with your free account"}
                            </p>
                        </div>

                        <form onSubmit={onLogin} className="auth-form">
                            {currState === "Sign Up" && (
                                <div className="form-group">
                                    <div className="input-wrapper">
                                        <FaUser className="field-icon" />
                                        <input
                                            type="text"
                                            name='name'
                                            placeholder='Full Name'
                                            value={data.name}
                                            onChange={onChangeHandler}
                                            required
                                        />
                                    </div>
                                    {errorMessage && <span className="field-error">{errorMessage}</span>}
                                </div>
                            )}

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <FaEnvelope className="field-icon" />
                                    <input
                                        type="email"
                                        name='email'
                                        placeholder='Email Address'
                                        value={data.email}
                                        onChange={onChangeHandler}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-wrapper">
                                    <FaLock className="field-icon" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name='password'
                                        placeholder='Password'
                                        value={data.password}
                                        onChange={onChangeHandler}
                                        required
                                    />
                                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            {currState === "Sign Up" && (
                                <div className="form-group">
                                    <div className="input-wrapper">
                                        <FaLock className="field-icon" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name='confirmPassword'
                                            placeholder='Confirm Password'
                                            value={data.confirmPassword}
                                            onChange={onChangeHandler}
                                            required
                                        />
                                        <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {passwordError && <span className="field-error">{passwordError}</span>}
                                </div>
                            )}

                            {currState === "Login" && (
                                <div className="form-extras">
                                    <label className="remember-me">
                                        <input type="checkbox" />
                                        <span className="custom-checkbox"></span>
                                        <span>Remember me</span>
                                    </label>
                                    <a href="#" className="forgot-link">Forgot Password?</a>
                                </div>
                            )}

                             {currState === "Sign Up" && (
                                <div className="form-extras">
                                     <label className="remember-me text-sm">
                                        <input type="checkbox" required />
                                        <span className="custom-checkbox"></span>
                                        <span>I agree to Terms & Privacy</span>
                                    </label>
                                </div>
                            )}

                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? <span className="loader"></span> : (
                                    <>
                                        {currState === "Login" ? "Sign In" : "Sign Up"}
                                        <FaArrowRight className="btn-icon" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="divider">
                            <span>Or continue with</span>
                        </div>

                        <div className="social-buttons">
                            <button className="social-btn google" type="button">
                                <FaGoogle /> <span>Google</span>
                            </button>
                            <button className="social-btn facebook" type="button">
                                <FaFacebookF /> <span>Facebook</span>
                            </button>
                        </div>

                        <div className="auth-switch">
                            <p>
                                {currState === "Login" ? "New here? " : "Already have an account? "}
                                <span onClick={() => setCurrState(currState === "Login" ? "Sign Up" : "Login")}>
                                    {currState === "Login" ? "Create Account" : "Login"}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPopup;
