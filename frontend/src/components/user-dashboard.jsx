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


    useEffect(() => {
        fetchInvitations();
    }, []);


    const fetchInvitations = async () => {
        try {
            const response = await axios.get("http://localhost/reactELearning/backend/get_invite.php", {
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                },
            });
            if (response.data.success) {
                setInvitations(response.data.invitations);
            } else {
                alert("No invitations found.");
            }
        } catch (error) {
            console.error("Error fetching invitations:", error);
        }
    };
    


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


      <div>
            <h1>Your Course Invitations</h1>
            {invitations.length === 0 ? (
                <p>No invitations available.</p>
            ) : (
                <ul>
                    {invitations.map(invite => (
                        <li key={invite.invite_id}>
                            Course: {invite.course_title}
                            {/* <button onClick={() => acceptInvitation(invite.invite_id, invite.course_id)}>Accept</button> */}
                            {/* <button onClick={() => declineInvitation(invite.invite_id)}>Decline</button> */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
              
        </div>


    );
}


export default Student;