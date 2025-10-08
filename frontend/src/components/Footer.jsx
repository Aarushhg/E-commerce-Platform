import React from "react";
import "./Footer.css"; 

const Footer = () => {
  return (
    <div className="footer">
      <h4>Customer Services</h4>
      <div className="footer-links">
        <a href="/contact">Contact Us</a>
        <a href="/connect">Connect With Us</a>
        <a href="/help">Help Center</a>
        <a href="/returns">Returns & Refunds</a>
      </div>
    </div>
  );
};

export default Footer;
