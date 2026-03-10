import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPopup.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import PageLoader from '../PageLoader/PageLoader';
import {
    FaUser, FaEnvelope, FaLock, FaTimes,
    FaArrowRight, FaEye, FaEyeSlash, FaShoppingBag
} from 'react-icons/fa';

const LoginPopup = ({ setShowLogin }) => {
    const { setToken, url, loadCartData } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showGoogleLoader, setShowGoogleLoader] = useState(false);

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
                // Trigger Sale Banner popup after login
                sessionStorage.setItem('showLoginBanner', 'true');
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

    // ---- Google OAuth ----
    const handleGoogleSuccess = async (credentialResponse) => {
        setShowGoogleLoader(true);
        try {
            const response = await axios.post(`${url}/api/user/google-auth`, {
                credential: credentialResponse.credential
            });
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                loadCartData({ token: response.data.token });
                // Trigger Sale Banner popup after Google login
                sessionStorage.setItem('showLoginBanner', 'true');
                // Show loader for 1.5s so user sees it, then close
                setTimeout(() => {
                    setShowGoogleLoader(false);
                    setShowLogin(false);
                    toast.success(`Welcome, ${response.data.name}!`);
                }, 1500);
            } else {
                setShowGoogleLoader(false);
                toast.error(response.data.message);
            }
        } catch (error) {
            setShowGoogleLoader(false);
            toast.error("Google sign-in failed. Please try again.");
        }
    };

    const handleGoogleError = () => {
        setShowGoogleLoader(false);
        toast.error("Google sign-in was cancelled or failed.");
    };

    return (
        <>
            {/* Full-screen loader during Google Auth */}
            <PageLoader visible={showGoogleLoader} type="login" />

            <div className='login-popup-overlay' onClick={(e) => e.target.className === 'login-popup-overlay' && setShowLogin(false)}>
                <div className="login-popup-container">

                    {/* Close Button */}
                    <button className="popup-close-btn" onClick={() => setShowLogin(false)} aria-label="Close">
                        <FaTimes />
                    </button>

                    <div className={`login-box${currState === "Sign Up" ? " signup-mode" : ""}`}>
                        {/* Inner padding wrapper (after top banner) */}
                        <div className="login-box-inner">

                            {/* Header */}
                            <div className="form-header">
                                {currState === "Login" && (
                                    <div className="form-header-icon">
                                        <FaShoppingBag />
                                    </div>
                                )}
                                <h2>{currState === "Login" ? "Welcome Back" : "Create Account"}</h2>
                                <p className="subtitle">
                                    {currState === "Login"
                                        ? "Sign in to continue to your account"
                                        : "Sign up and start shopping today"}
                                </p>
                            </div>

                            <form onSubmit={onLogin} className="auth-form">

                                {/* Full Name (Sign Up Only) */}
                                {currState === "Sign Up" && (
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <div className="input-wrapper">
                                            <span className="field-icon-box"><FaUser /></span>
                                            <input
                                                type="text"
                                                name='name'
                                                placeholder='e.g. John Doe'
                                                value={data.name}
                                                onChange={onChangeHandler}
                                                required
                                            />
                                        </div>
                                        {errorMessage && <span className="field-error">⚠ {errorMessage}</span>}
                                    </div>
                                )}

                                {/* Email Address */}
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <div className="input-wrapper">
                                        <span className="field-icon-box"><FaEnvelope /></span>
                                        <input
                                            type="email"
                                            name='email'
                                            placeholder='you@example.com'
                                            value={data.email}
                                            onChange={onChangeHandler}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <div className="input-wrapper">
                                        <span className="field-icon-box"><FaLock /></span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name='password'
                                            placeholder='Enter your password'
                                            value={data.password}
                                            onChange={onChangeHandler}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password (Sign Up Only) */}
                                {currState === "Sign Up" && (
                                    <div className="form-group">
                                        <label className="form-label">Confirm Password</label>
                                        <div className="input-wrapper">
                                            <span className="field-icon-box"><FaLock /></span>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name='confirmPassword'
                                                placeholder='Re-enter your password'
                                                value={data.confirmPassword}
                                                onChange={onChangeHandler}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {passwordError && <span className="field-error">⚠ {passwordError}</span>}
                                    </div>
                                )}

                                {/* Remember Me + Forgot Password (Login Only) */}
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

                                {/* Terms (Sign Up Only) */}
                                {currState === "Sign Up" && (
                                    <div className="form-extras">
                                        <label className="remember-me">
                                            <input type="checkbox" required />
                                            <span className="custom-checkbox"></span>
                                            <span>I agree to the Terms &amp; Privacy Policy</span>
                                        </label>
                                    </div>
                                )}

                                {/* Submit */}
                                <button type="submit" className="submit-btn" disabled={isLoading}>
                                    {isLoading ? <span className="loader"></span> : (
                                        <>
                                            {currState === "Login" ? "Sign In" : "Create Account"}
                                            <FaArrowRight className="btn-icon" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="divider">
                                <span>Or continue with</span>
                            </div>

                            {/* Social Buttons */}
                            <div className="social-buttons social-buttons--single">
                                <div className="google-login-wrapper google-login-wrapper--full">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                        useOneTap={false}
                                        theme="outline"
                                        size="large"
                                        text={currState === "Login" ? "signin_with" : "signup_with"}
                                        shape="rectangular"
                                        width="100%"
                                    />
                                </div>
                            </div>

                            {/* Switch Auth Mode */}
                            <div className="auth-switch">
                                <p>
                                    {currState === "Login" ? "New here? " : "Already have an account? "}
                                    <span onClick={() => setCurrState(currState === "Login" ? "Sign Up" : "Login")}>
                                        {currState === "Login" ? "Create Account" : "Sign In"}
                                    </span>
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default LoginPopup;
