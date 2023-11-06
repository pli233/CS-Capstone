// src/components/layout/Footer.js
import React from 'react';
import './Footer.css';  // Import the CSS file if you create one

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <span className='copyright-info'>
          © 2023 Katfun.com All rights reserved.
        </span>
        <div className="contact-info">
          Join us : haoj1.bian@gmail.com | hbian8@wisc.edu | kiki0919@gmail.com
        </div>
        <a href="https://forms.gle/w8twLvw85zGcY2DA9" target="_blank" rel="noopener noreferrer">
          Take our survey, help us enhance our platform for all pet lovers!
        </a>
        <span className='copyright-info'>
          Beta 1.0.1
        </span>
      </div>
    </footer>
  );
};

export default Footer;
