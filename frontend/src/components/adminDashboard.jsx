import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar'
import "../styles/adminDash.css"


const Admin = () =>{
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [students, setStudents] = useState([]);


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
            setCourses(result.data.courses || []);
            setInstructors(result.data.instructors || []);
            setStudents(result.data.students || []);
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
        <div className="first">
            <Navbar/>
              <h1>Welcome admin!</h1>

              <div className="sections"> 

     <div className="section1">
    <h2>Students</h2>
      {students.length > 0 ? (
        students.map(student => (
          <div key={student.user_id}>
            <h3>{student.name}</h3>
            <p>Email: {student.email}</p>
            <p>Status: {student.status}</p>
          </div>
        ))
      ) : (
        <p>No students found.</p>
      )}
      </div>


 <div className="section2">
<h2>Instructors</h2>
      {instructors.length > 0 ? (
        instructors.map(instructor => (
          <div key={instructor.user_id}>
            <h3>{instructor.name}</h3>
            <p>Email: {instructor.email}</p>
            <p>Status: {instructor.status}</p>
          </div>
        ))
      ) : (
        <p>No instructors found.</p>
      )}
  </div>

  <div className="section3">
      <h2>Courses</h2>
      {courses.length > 0 ? (
        courses.map(course => (
          <div key={course.course_id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
          </div>
        ))
      ) : (
        <p>No courses available.</p>
      )}
        </div>

    </div>

    <button onClick={handleLogout} className="btn">Logout</button>

</div>


    );
}


export default Admin;