import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./menu.css";
// import { menu } from "../../data";
// import Products from "./../../pages/products/Products";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
      <div className={`menu ${isOpen ? "open" : "closed"}`}>
        <div className="item">
          <span className="title">MAIN</span>
          <Link to="/" className="listItem">
            <img src="./home.svg" alt="" />
            <span className="listItemTitle">Home</span>
          </Link>
          {/* <Link to="/profile" className="listItem">
            <img src="./profile.svg" alt="" />
            <span className="listItemTitle">Profile</span>
          </Link> */}
        </div>
        <div className="item">
          <span className="title">Links</span>
          <Link to="/users" className="listItem">
            <img src="./user.svg" alt="" />
            <span className="listItemTitle">Users</span>
          </Link>
          <Link to="/products" className="listItem">
            <img src="./product.svg" alt="" />
            <span className="listItemTitle">Products</span>
          </Link>
        </div>
        <div className="item">
          <span className="title">Maintenance</span>
          <Link to="/analytics" className="listItem">
            <img src="./chart.svg" alt="" />
            <span className="listItemTitle">Analytics</span>
          </Link>
          <Link to="/reports" className="listItem">
            <img src="./order.svg" alt="" />
            <span className="listItemTitle">Reports</span>
          </Link>
          {/* <Link to="/" className="listItem">
            <img src="./setting.svg" alt="" />
            <span className="listItemTitle">Settings</span>
          </Link> */}
        </div>
      </div>
    </>
  );
};

export default Menu;
