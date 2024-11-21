import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/login.css";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";



const StudentInvite = () =>{
    const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        // Fetch students
        const studentsResponse = await axios.get(
          'http://localhost/your-backend-path/admin_get_all.php',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudents(studentsResponse.data.students);

        // Fetch courses
        const coursesResponse = await axios.get(
          'http://localhost/your-backend-path/get_courses.php',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourses(coursesResponse.data.courses);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Failed to load students or courses.');
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <h2>Invite a Student to a Course</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student ID:</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Course ID:</label>
          <input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Invitation</button>
      </form>
    </div>
  );
};
    
export default StudentInvite;