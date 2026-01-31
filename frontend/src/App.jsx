import React, { useState } from 'react'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import LoginPopup from './components/LoginPopup/LoginPopup'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import MyOrders from './pages/MyOrders/MyOrders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify/Verify';
import AboutUs from './components/Aboutus/Aboutus';
import ContactUs from './components/Contactus/Contactus';
import ConfirmationPage from './components/LoginPopup/ConfirmationPage'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import CategoryDetails from './pages/CategoryDetails/CategoryDetails'
import ProductPopup from './components/ProductPopup/ProductPopup'
import CategoryPopup from './components/CategoryPopup/CategoryPopup'
import ProfileSettings from './pages/ProfileSettings/ProfileSettings'
import HelpChatbot from './components/HelpChatbot/HelpChatbot'
import SupportPopup from './components/SupportPopup/SupportPopup'

import LatestProductsPopup from './components/LatestProductsPopup/LatestProductsPopup'
import NotificationPopup from './components/NotificationPopup/NotificationPopup'

const App = () => {

  const [showLogin,setShowLogin] = useState(false);
  const [showSupport,setShowSupport] = useState(false);
  const [showLatestProducts, setShowLatestProducts] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [latestPopupCategory, setLatestPopupCategory] = useState("All");

  return (
    <>
    <ToastContainer/>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    {showSupport?<SupportPopup setShowSupport={setShowSupport}/>:<></>}
    {showLatestProducts?<LatestProductsPopup setShowLatestProducts={setShowLatestProducts} category={latestPopupCategory} />:<></>}
    <NotificationPopup showNotifications={showNotifications} setShowNotifications={setShowNotifications} />
    <ProductPopup />
    <CategoryPopup />
    <Navbar 
      setShowLogin={setShowLogin} 
      setShowSupport={setShowSupport} 
      setShowLatestProducts={setShowLatestProducts}
      setLatestPopupCategory={setLatestPopupCategory}
      setShowNotifications={setShowNotifications}
    />
      <div className='app'>
        {/* <Navbar setShowLogin={setShowLogin}/> */}
        <Routes>
          <Route path='/' element={<Home />}/>
          
          <Route path='/products' element={<Header />}/>
          <Route path='/cart' element={<Cart />}/>
          <Route path='/order' element={<PlaceOrder />}/>
          <Route path='/myorders' element={<MyOrders />}/>
          <Route path='/verify' element={<Verify />}/>
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path='/contactus' element={<ContactUs />} />
          <Route path='/confirm' element={<ConfirmationPage />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/category/:categoryName' element={<CategoryDetails />} />
          <Route path='/settings' element={<ProfileSettings setShowSupport={setShowSupport}/>} />
        </Routes>
      </div>
      <Footer />
      <HelpChatbot />
    </>
  )
}

export default App



// import React, { useState } from 'react';
// import { Routes, Route, BrowserRouter } from 'react-router-dom'; // Wrap in BrowserRouter if necessary
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import Navbar from './components/Navbar/Navbar';
// import Footer from './components/Footer/Footer';
// import Home from './pages/Home/Home';
// import Cart from './pages/Cart/Cart';
// import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
// import MyOrders from './pages/MyOrders/MyOrders';
// import LoginPopup from './components/LoginPopup/LoginPopup';
// import AboutUs from './components/Aboutus/Aboutus';
// import ContactUs from './components/Contactus/Contactus';
// import Verify from './pages/Verify/Verify';
// import ConfirmationPage from './components/LoginPopup/ConfirmationPage';

// const App = () => {
//   const [showLogin, setShowLogin] = useState(false);

//   return (
//     <BrowserRouter>
//       <ToastContainer />
//       {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      
//       <Navbar setShowLogin={setShowLogin} />
      
//       <div className="app">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/cart" element={<Cart />} />
//           <Route path="/order" element={<PlaceOrder />} />
//           <Route path="/myorders" element={<MyOrders />} />
//           <Route path="/verify" element={<Verify />} />
//           <Route path="/confirm" element={<ConfirmationPage />} />
//         </Routes>
        
//         {/* Ensure smooth scroll sections are outside Routes */}
//         <section id="home" className="page-section">
//           <Home />
//         </section>

//         <section id="about-us" className="page-section">
//           <AboutUs />
//         </section>

//         <section id="products" className="page-section">
//           <Products />
//         </section>

//         <section id="contact-us" className="page-section">
//           <ContactUs />
//         </section>
//       </div>

//       <Footer />
//     </BrowserRouter>
//   );
// };

// export default App;


