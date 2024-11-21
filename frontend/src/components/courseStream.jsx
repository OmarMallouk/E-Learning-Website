import React, { useEffect, useState } from 'react';
import axios from "axios";
import "../styles/login.css"
import "../styles/button.css"
import { useNavigate,useParams  } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from './navbar'



const CourseStream = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseStream = async () => {
      const token = localStorage.getItem('token'); 

      if (!token) {
        setError('Unauthorized. No token provided.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost/reactELearning/backend/course_stream.php?course_id=${courseId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          setCourseData(data);
        } else {
          setError(data.error || 'Failed to fetch course stream');
        }
      } catch (error) {
        setError('Error fetching course stream');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseStream();
  }, [courseId]);

  if (loading) {
    return <div>Loading course stream...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!courseData) {
    return <div>No course data available</div>;
  }

  return (
    <div>
      <Navbar/>
      <h3>Announcements</h3>
      {courseData.announcements.length > 0 ? (
        <ul>
          {courseData.announcements.map((announcement) => (
            <li key={announcement.id}>{announcement.title}</li>
          ))}
        </ul>
      ) : (
        <p>No announcements available.</p>
      )}

      <h3>Assignments</h3>
      {courseData.assignments.length > 0 ? (
        <ul>
          {courseData.assignments.map((assignment) => (
            <li key={assignment.id}>{assignment.title}</li>
          ))}
        </ul>
      ) : (
        <p>No assignments available.</p>
      )}
    </div>
  );
};

export default CourseStream;
