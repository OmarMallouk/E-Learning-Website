import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";
import "../styles/adminDash.css"


const AdminCoursesDetails =() =>{
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);


    const getAll = async () => {
        try {
          const result = await axios.get(
            "http://localhost/reactELearning/backend/admin_get_all.php",
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.token,  
              },
            }
          );
      
          if (result.data.success) {
            console.log(result.data)
            setCourses(result.data.courses || []);

          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      
      useEffect(() => {
        getAll();
      }, []);



      const handleLogout = () => { 
        localStorage.removeItem('token');
        navigate('/'); };

    return(
        <div className="main">
            <Navbar/>



        <button onClick={handleLogout} className="btn">Logout</button>

        </div>
    );
}


export default AdminCoursesDetails;