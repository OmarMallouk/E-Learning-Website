import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/login.css"
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from './navbar'



const Student = () =>{
    const [courses, setCourses] = useState([]);
    const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const navigate = useNavigate();


    const handleInvite = () => { 
      navigate('/invitations'); };
  

   
 
    return(
        <div className="User-dashboard">
            <Navbar/>

                <h1>Welcome Student!!</h1>
            
            <button onClick={handleInvite}>View Invitations</button>
        </div>


    );
}


export default Student;