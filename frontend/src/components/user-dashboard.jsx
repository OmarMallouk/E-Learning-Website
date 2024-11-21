import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/login.css"
import "../styles/button.css"
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CourseStream from "./courseStream";
import Navbar from './navbar'



const Student = () =>{
    const [courses, setCourses] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
      const fetchCourses = async () => {
        try {
          const token = localStorage.getItem('token'); 
          const response = await fetch('http://localhost/reactELearning/backend/get_studentCourse.php', {
            method: 'GET',
            headers: {
             Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const data = await response.json();
          
          if (data.success) {
            setCourses(data.courses);
          } else {
            setError(data.message || 'Error fetching courses');
          }
        } catch (err) {
          setError('Failed to fetch courses');
        } finally {
          setLoading(false);
        }
      };
  
      fetchCourses();
    }, []);
  
    if (loading) {
      return <div>Loading courses...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }


    const handleInvite = () => { 
      navigate('/invitations'); };
  
///////////////////////////////

const handleCourseSelect = (courseId) => {
  navigate(`/courseStream/${courseId}`);
};

if (loading) {
  return <div>Loading your courses...</div>;
}

if (error) {
  return <div>{error}</div>;
}

if (courses.length === 0) {
  return <div>No courses found.</div>;
}



 
    return(
        <div className="User-dashboard">
            <Navbar/>

                <h1>Welcome Student!!</h1>

                <div>
      <h1>My Courses</h1>
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course.course_id}>
              {course.title}
              <button onClick={() => handleCourseSelect(course.course_id)}>
              View Course Stream
            </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses found.</p>
      )}
    </div>

   
            
            <button onClick={handleInvite}>View Invitations</button>
        </div>


    );
}


export default Student;