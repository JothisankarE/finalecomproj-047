import React, { useContext, useEffect, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import cartImage from '../../../src/Assets1/basket.webp'
import profileImage from '../../../src/Assets1/profile_1.jpg'

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token ,setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/')
  }

  return (
    <div className='navbar' id='navbar'>
      <h1>Gowri Handloom</h1>      
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>Home</Link>
        <a href="/aboutus" onClick={() => setMenu("about")} className={`${menu === "about" ? "active" : ""}`}>About Us</a>
        <a href='#explore-menu' onClick={() => setMenu("mob-app")} className={`${menu === "mob-app" ? "active" : ""}`}>Products</a> 
        <a href='/contactus' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>Contact Us</a>
      </ul>
      <div className="navbar-right">
        
        <Link to='/cart' className='navbar-search-icon'>
           <img style={{height:'30px', width:'30px'}} src={cartImage} alt="" />         
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>
        {!token ? <button onClick={() => setShowLogin(true)}>sign in</button>
          : <div className='navbar-profile'>
            <img style={{height:'30px', width:'30px'}} src={profileImage} alt="" />
            <ul className='navbar-profile-dropdown'>
              <li onClick={()=>navigate('/myorders')}> <img src={assets.bag_icon} alt="" /> <p>Orders</p></li>
              <hr />
              <li onClick={logout}> <img src={assets.logout_icon} alt="" /> <p>Logout</p></li> 
            </ul>
            
          </div>
        }       

      </div>
    </div>
  )
}

export default Navbar



// import React, { useState } from "react";
// import { Link as ScrollLink } from "react-scroll"; // Import from react-scroll
// import cartImage from "../../../src/Assets1/basket_icon1.webp";
// import profileImage from "../../../src/Assets1/profile.png";
// import './Navbar.css';

// const Navbar = ({ setShowLogin }) => {
//   const [menu, setMenu] = useState("home");

//   return (
//     <div className="navbar" id="navbar">
//       <h1>Gowri Handloom</h1>
//       <ul className="navbar-menu">
//         <ScrollLink
//           to="home"
//           smooth={true}
//           duration={500}
//           onClick={() => setMenu("home")}
//           className={`${menu === "home" ? "active" : ""}`}
//         >
//           Home
//         </ScrollLink>
//         <ScrollLink
//           to="about-us"
//           smooth={true}
//           duration={500}
//           onClick={() => setMenu("about")}
//           className={`${menu === "about" ? "active" : ""}`}
//         >
//           About Us
//         </ScrollLink>
//         <ScrollLink
//           to="products"
//           smooth={true}
//           duration={500}
//           onClick={() => setMenu("mob-app")}
//           className={`${menu === "mob-app" ? "active" : ""}`}
//         >
//           Products
//         </ScrollLink>
//         <ScrollLink
//           to="contact-us"
//           smooth={true}
//           duration={500}
//           onClick={() => setMenu("contact")}
//           className={`${menu === "contact" ? "active" : ""}`}
//         >
//           Contact Us
//         </ScrollLink>
//       </ul>
      
//       <div className="navbar-right">
//         <a href="/cart" className="navbar-search-icon">
//           <img style={{ height: "30px", width: "30px" }} src={cartImage} alt="" />
//         </a>
        
//         {!token ? (
//           <button onClick={() => setShowLogin(true)}>Sign In</button>
//         ) : (
//           <div className="navbar-profile">
//             <img style={{ height: "30px", width: "30px" }} src={profileImage} alt="" />
//             <ul className="navbar-profile-dropdown">
//               <li onClick={() => navigate("/myorders")}>
//                 <p>Orders</p>
//               </li>
//               <hr />
//               <li onClick={logout}>
//                 <p>Logout</p>
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;


