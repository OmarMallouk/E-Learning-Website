import React from "react";
import "../styles/navbar.css"
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
};


const isLoggedIn = localStorage.getItem('token');

    return(

<nav className="navbar flex">
      <div className="logo">
        <img src="http://localhost/reactELearning/frontend/src/assets/elarn.jpg" alt="learnn" />
      </div>
      <h1>E-Learn</h1>
      {isLoggedIn && <li><button onClick={handleLogout}>Logout</button></li>}
    </nav>
    );

};

export default Navbar;