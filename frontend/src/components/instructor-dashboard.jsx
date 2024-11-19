import React, { useState } from "react";
import axios from "axios";
import "../styles/login.css"
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar'


const Instructor = () =>{
    const navigate = useNavigate();

    const handleLogout = () => { 
        localStorage.removeItem('token');
        navigate('/'); };
    
    
    return(
        <div className="Instructor-dashboard">
            <Navbar/>

                <h1>Welcome Instructor</h1>
                <button onClick={handleLogout} className="btn">Logout</button>

        </div>


    );
}


export default Instructor;