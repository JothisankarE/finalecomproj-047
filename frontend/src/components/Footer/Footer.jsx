import React from 'react';
import { Link } from 'react-router-dom'; 
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  const emailAddress = 'gowrihandlooms@gmail.com';
  const subject = 'Inquiry from Website'; 
  const body = 'Hello, I would like to know more about your products.'; 

  return (
    <div className='footer' id='footer'>      
      <hr />
      <p className="footer-copyright" style={{ textDecoration: 'none', color: 'inherit' }}>Copyright 2025 © Gowrihandlooms.com - All Rights Reserved.</p>
    </div>
  );
};

export default Footer;