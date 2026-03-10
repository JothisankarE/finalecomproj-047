import React, { useEffect, useState } from 'react';
import './PageLoader.css';

/**
 * PageLoader — shown after Google Auth login & on logout
 * Props:
 *   visible  — boolean
 *   type     — 'login' | 'logout'
 */
const PageLoader = ({ visible, type = 'login' }) => {
    const [show, setShow] = useState(false);
    const [animOut, setAnimOut] = useState(false);

    useEffect(() => {
        if (visible) {
            setAnimOut(false);
            setShow(true);
        } else if (show) {
            setAnimOut(true);
            const t = setTimeout(() => {
                setShow(false);
                setAnimOut(false);
            }, 600);
            return () => clearTimeout(t);
        }
    }, [visible]);

    if (!show) return null;

    const isLogin = type === 'login';

    return (
        <div className={`pl-overlay ${animOut ? 'pl-out' : 'pl-in'}`}>
            {/* Background animated blobs */}
            <div className="pl-blob pl-blob-a"></div>
            <div className="pl-blob pl-blob-b"></div>
            <div className="pl-blob pl-blob-c"></div>

            <div className="pl-card">
                {/* Spinning ring */}
                <div className="pl-ring-wrap">
                    <svg className="pl-ring-svg" viewBox="0 0 100 100">
                        <circle className="pl-ring-track" cx="50" cy="50" r="42" fill="none" strokeWidth="5" />
                        <circle className="pl-ring-spin" cx="50" cy="50" r="42" fill="none" strokeWidth="5"
                            strokeDasharray="264" strokeDashoffset="66"
                        />
                    </svg>

                    {/* Centre icon */}
                    <div className="pl-icon-circle">
                        {isLogin ? (
                            /* Google colour 'G' */
                            <svg viewBox="0 0 24 24" className="pl-google-icon" aria-label="Google">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        ) : (
                            /* Logout door icon */
                            <svg viewBox="0 0 24 24" className="pl-logout-icon" fill="none"
                                stroke="currentColor" strokeWidth="2.2"
                                strokeLinecap="round" strokeLinejoin="round"
                                aria-label="Logout">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Heading */}
                <h2 className="pl-title">
                    {isLogin ? 'Signing you in' : 'Logging you out'}
                </h2>
                <p className="pl-subtitle">
                    {isLogin
                        ? 'Verifying your Google account…'
                        : 'Clearing your session. See you soon!'}
                </p>

                {/* Bouncing dots */}
                <div className="pl-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
};

export default PageLoader;
