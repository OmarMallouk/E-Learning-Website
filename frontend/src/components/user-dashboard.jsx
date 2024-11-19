import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/login.css"
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from './navbar'



const Student = () =>{

    const navigate = useNavigate();

    const handleLogout = () => { 
        localStorage.removeItem('token');
        navigate('/'); };
    


    
    return(
        <div className="User-dashboard">
            <Navbar/>

                <h1>Welcome Student!!</h1>

                <button onClick={handleLogout} className="btn">Logout</button>
        </div>


    );
}


export default Student;