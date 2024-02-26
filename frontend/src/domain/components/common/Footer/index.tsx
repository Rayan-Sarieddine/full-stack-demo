import React from "react";
import "./style.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className="footer">
      <div className="footer-wrapper">
        <div className="footer-main">
          <div className="footer-main_section1">
            <img src="./favicon.png" alt="logo" />
            <h3>quality,</h3>
            <p className="footer-main_title2">scalability, maximized.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-bottom_copyrights">
            © {year} Demo by Rayan Sarieddine
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
