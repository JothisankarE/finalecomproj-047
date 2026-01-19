// src/Components/Navbar.js

// import React from 'react';
// import './Navbar.css';
// import { useNavigate } from 'react-router-dom';

// const Navbar = () => {
//     const navigate = useNavigate();

//     const handleProfileClick = () => {

//         navigate('/login');
//     };

//     return (
//         <div className='navbar'>            
//             <h1>Gowri Handloom</h1>
//             <h4 className='profile'>Admin</h4>
//             <h4>Login</h4>            
//         </div>
//     );
// };

// export default Navbar;



import React from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';

import { toast } from 'react-toastify';

const Navbar = ({ setToken }) => {

    const handleLogout = () => {
        setToken("");
        localStorage.removeItem('token');
    };

    return (
        <div className='navbar'>
            <div className="navbar-brand">
                <img
                    src={assets.mat_logo}
                    alt="MAT Textile Hub"
                    className="navbar-logo"
                    onClick={() => toast.info("Welcome to MAT TEXTILE HUB! 🚀")}
                    style={{ cursor: 'pointer' }}
                />
                <h1 className="visual-text">MAT TEXTILE HUB</h1>
            </div>

            <div className='navbar-profile'>
                <img src={assets.profile_image} alt="Profile" className='profile-avatar' />
                <div className="profile-dropdown">
                    <p>Admin User</p>
                    <p onClick={handleLogout} className="logout-btn">Logout</p>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

