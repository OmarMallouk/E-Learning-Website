import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";
import "../styles/adminDash.css"


const AdminCoursesDetails =() =>{
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [newCourse, setNewCourse] = useState({ title: '', description: '', instructors: '' });
    const [editCourse, setEditCourse] = useState({ course_id: '', title: '', description: '' });
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedInstructors, setSelectedInstructors] = useState([]);
    const [courseId, setCourseId] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);


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
            setInstructors(result.data.instructors || []);

          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const handleEditCourse = async () => {
        try {
          await axios.put('http://localhost/reactELearning/backend/admin_edit_course.php', editCourse);
          getAll(); 
        } catch (error) {
          console.error('Error editing course', error);
        }
      };


      const handleDeleteCourse = async () => {
        if (!courseId) {
          setMessage("Course ID is required");
          return;
        }
    
        try {
          const response = await axios.delete(
            `http://localhost/reactELearning/backend/admin_delete_course.php?id=${courseId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
    
          // Display success message
          if (response.data) {
            setMessage("Course deleted successfully");
          }
        } catch (error) {
          console.error("Error deleting course", error);
          if (error.response) {
            const errorMsg =
              error.response.data?.message || "Error deleting course";
            setMessage(errorMsg);
          } else {
            setMessage("Something went wrong. Please try again later.");
          }
        }
      };

      
      useEffect(() => {
        getAll();
      }, []);


      const handleInstructorSelect = (instructorId) => {
        if (!selectedInstructors.includes(instructorId)) {
          setSelectedInstructors([...selectedInstructors, instructorId]);
        }
      };


      const handleAddCourse = async (e) => {
        e.preventDefault();
    
        if (!title || !description || selectedInstructors.length === 0) {
          setError("Please fill out all fields and select at least one instructor.");
          return;
        }
    
        // Send course data to backend
        try {
          const courseData = {
            title,
            description,
            instructors: selectedInstructors,
          };
    
          const response = await axios.post(
            "http://localhost/reactELearning/backend/admin_add_courses.php",
            courseData,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.token,
              },
            }
          );
    
          if (response.data.success) {
            setCourses((prevCourses) => [
                ...prevCourses,
                { course_id: response.data.course_id, title, description, instructors: selectedInstructors },
              ]);
            setTitle("");
            setDescription("");
            setSelectedInstructors([]);
            setError(null);
            alert("Course added successfully!");
          } else {
            setError(response.data.error);
          }
        } catch (error) {
          console.error("Error adding course:", error);
          setError("There was an error adding the course.");
        }
      };


      const handleLogout = () => { 
        localStorage.removeItem('token');
        navigate('/'); };

    return(
        <div className="main">
            <Navbar/>
            <div className="sect">
            <h1>Add New Course</h1>
      {error && <p>{error}</p>}

      <form onSubmit={handleAddCourse} className="section4">
        <div>
          <label htmlFor="title">Course Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Course Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Select Instructors for the Course</label>
          <select
            multiple
            value={selectedInstructors}
            onChange={(e) => setSelectedInstructors([...e.target.selectedOptions].map(option => option.value))}
          >
            {instructors.map((instructor) => (
              <option key={instructor.user_id} value={instructor.user_id}>
                {instructor.name}
              </option>
            ))}
          </select>
        </div>

        <button className="b2" type="submit">Add Course</button>
      </form>
      </div>

    
      <div>
        <h2>Edit Course</h2>
        <select
          onChange={(e) => setEditCourse({ ...editCourse, course_id: e.target.value })}
          value={editCourse.course_id}
        >
          <option value="">Select a Course</option>
          {courses.map((course) => (
            <option key={course.course_id} value={course.course_id}>
              {course.title}
            </option>
          ))}
        </select>
        {editCourse.course_id && (
          <>
            <input
              type="text"
              value={editCourse.title}
              onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
              placeholder="Course Title"
            />
            <textarea
              value={editCourse.description}
              onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
              placeholder="Course Description"
            />
            <button onClick={handleEditCourse}>Edit Course</button>
          </>
        )}
      </div>

      <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h3>Delete a Course</h3>
      <input
        type="text"
        placeholder="Enter Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleDeleteCourse}
        style={{
          background: "#ff4d4d",
          color: "#fff",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Delete Course
      </button>
      {message && (
        <p style={{ marginTop: "10px", color: message.includes("successfully") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>

     -
      <div>
        <h2>Courses List</h2>
        <div className="sections">
          {courses.map((course) => (
            <div key={course.course_id} className="section6">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
          ))}
        </div>
      </div>


        <button onClick={handleLogout} className="btn">Logout</button>

        </div>
    );
}


export default AdminCoursesDetails;