import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/login.css";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";



const StudentInvite = () =>{
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
              'http://localhost/reactELearning/backend/get_student.php',
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log('Students API Response:', studentsResponse.data);
            setStudents(studentsResponse.data.students || []);
      
            // Fetch courses
            const coursesResponse = await axios.get(
              'http://localhost/reactELearning/backend/get_instructor_courses.php',
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log('Courses API Response:', coursesResponse.data);
            setCourses(coursesResponse.data.courses || []);
          } catch (error) {
            console.error('Error fetching data:', error);
            setMessage('Failed to load students or courses.');
          }
        };
      
        fetchData();
      }, []);
      
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const token = localStorage.getItem('token');
  
      try {
        const response = await axios.post(
          ' http://localhost/reactELearning/backend/add_invite.php',
          {
            student_id: selectedStudent,
            course_id: selectedCourse,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        if (response.data.success) {
          setMessage('Invitation sent successfully!');
        } else {
          setMessage(response.data.message || 'Failed to send invitation.');
        }
      } catch (error) {
        console.error('Error sending invitation:', error);
        setMessage('An error occurred while sending the invitation.');
      }
    };
  
    return (
      <div>
        <h2>Invite a Student to a Course</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Student:</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.user_id} value={student.user_id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Course:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Send Invitation</button>
        </form>
      </div>
    );
  };
  
    
export default StudentInvite;