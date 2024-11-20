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
    const [deleteCourseId, setDeleteCourseId] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedInstructors, setSelectedInstructors] = useState([]);
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
            setStudents(result.data.students || []);

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
        try {
          await axios.delete(`http://localhost/reactELearning/backend/admin_delete_course.php?id=${deleteCourseId}`);
          getAll(); 
        } catch (error) {
          console.error('Error deleting course', error);
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
            setCourses((prevCourses) => [...prevCourses, response.data.course]); // Update courses list
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
            <div>
        <h2>Add Course</h2>
        <input
          type="text"
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          placeholder="Course Title"
        />
        <textarea
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          placeholder="Course Description"
        />
         <div>
          <label>Instructors</label>
          <select
            multiple
            value={newCourse.instructors}
            onChange={(e) =>
              setNewCourse({
                ...newCourse,
                instructors: Array.from(e.target.selectedOptions, (option) => option.value),
              })
            }
          >
            {instructors.map((instructor) => (
              <option key={instructor.user_id} value={instructor.user_id}>
                {instructor.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleAddCourse}>Add Course</button>
      </div>

      {/* Edit Course Form */}
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

      {/* Delete Course Section */}
      <div>
        <h2>Delete Course</h2>
        <select
          onChange={(e) => setDeleteCourseId(e.target.value)}
          value={deleteCourseId}
        >
          <option value="">Select a Course to Delete</option>
          {courses.map((course) => (
            <option key={course.course_id} value={course.course_id}>
              {course.title}
            </option>
          ))}
        </select>
        {deleteCourseId && <button onClick={handleDeleteCourse}>Delete Course</button>}
      </div>

      {/* Display Courses */}
      <div>
        <h2>Courses List</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {courses.map((course) => (
            <div key={course.course_id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px' }}>
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