import React, { useState,useEffect } from "react";
import axios from "axios";
import "../styles/login.css"
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar'


const Admin = () =>{
    const navigate = useNavigate();








    const handleLogout = () => { 
        localStorage.removeItem('token');
        navigate('/'); };
    
    
    return(
        <div className="Instructor-dashboard">
            <Navbar/>

                <h1>Welcome admin!</h1>
                <button onClick={handleLogout} className="btn">Logout</button>

        </div>


    );
}


export default Admin;