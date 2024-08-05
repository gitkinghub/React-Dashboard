import React from "react";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="left-section">
          <h2>
            Dahboard Inc <span className="highlight"></span>
          </h2>
          <p>Thoughtful product listings and prices.</p>
        </div>
        <div className="middle-section">
          <p>NEWSLETTER</p>
          <form className="subscribe-form">
            <input type="email" placeholder="YOUR EMAIL" />
            <button type="submit">SUBSCRIBE</button>
          </form>
        </div>
        <div className="right-section">
          <div className="social">
            <p>FOLLOW US</p>
            <div className="icons">
              <FaInstagram />
              <FaTwitter />
              <FaFacebookF />
            </div>
          </div>
          <div className="contact">
            <p>CALL US</p>
            <p>+00 000 000 00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
