import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/login.css"
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from './navbar'



const Student = () =>{
    const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch courses after the component mounts
        const fetchCourses = async () => {
          try {
            const token = localStorage.getItem('token'); 
            const response = await axios.get('http://localhost/reactELearning/backend/get_studentCourse.php', {
              headers: {
                Authorization: `Bearer ${token}` // Send token 
              }
            });
            
            if (response.data.success) {
              setCourses(response.data.courses);
            } else {
              setError(response.data.message); 
            }
          } catch (err) {
            setError('Error fetching courses.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchCourses();
      }, []); // runs once after mounts
    
      if (loading) {
        return <div>Loading...</div>;
      }
    
      if (error) {
        return <div>{error}</div>;
      }
    
    return(
        <div className="User-dashboard">
            <Navbar/>

                <h1>Welcome Student!!</h1>
                <h2>Enrolled Courses</h2>
      <ul>
        {courses.length > 0 ? (
          courses.map((course) => (
            <li key={course.course_id}>
              <h3>{course.title}</h3>
            </li>
          ))
        ) : (
          <li>No courses found.</li>
        )}
      </ul>
              
        </div>


    );
}


export default Student;