import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";
import "../styles/adminDash.css"


const AdminCoursesDetails =() =>{
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: "", description: "", instructors: "" });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editCourseData, setEditCourseData] = useState({
    course_id: "",
    title: "",
    description: "",
    instructors: [],
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [message, setMessage] = useState("");
  const [editMessage, setEditMessage] = useState("");
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



      /////////////////////////////////////////////

      const handleEditCourse = async (e) => {
        e.preventDefault();
        const { course_id, title, description, instructors } = editCourseData;
    
        if (!course_id || !title || !description || instructors.length === 0) {
          setError("Please fill out all fields and select at least one instructor.");
          return;
        }
    
        try {
          const response = await axios.put(
            "http://localhost/reactELearning/backend/admin_edit_course.php",
            {
              course_id,
              title,
              description,
              instructors,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.token,
              },
            }
          );
    
          if (response.data.success) {
            setCourses((prevCourses) =>
              prevCourses.map((course) =>
                course.course_id === course_id
                  ? { ...course, title, description, instructors }
                  : course
              )
            );
            setSelectedCourse(null);
            setEditCourseData({ course_id: "", title: "", description: "", instructors: [] });
            setError(null);
            alert("Course updated successfully!");
          } else {
            setError(response.data.error);
          }
        } catch (error) {
          console.error("Error editing course:", error);
          setError("There was an error updating the course.");
        }
      };

      ////////////////////

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
           
      <div className="sect">
        <h1>Edit Course</h1>
        {error && <p>{error}</p>}

        {selectedCourse ? (
          <form onSubmit={handleEditCourse} className="section4">
            <div>
              <label htmlFor="editTitle">Course Title</label>
              <input
                type="text"
                id="editTitle"
                value={editCourseData.title}
                onChange={(e) =>
                  setEditCourseData({ ...editCourseData, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label htmlFor="editDescription">Course Description</label>
              <textarea
                id="editDescription"
                value={editCourseData.description}
                onChange={(e) =>
                  setEditCourseData({
                    ...editCourseData,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <label>Select Instructors for the Course</label>
              <select
                multiple
                value={editCourseData.instructors}
                onChange={(e) =>
                  setEditCourseData({
                    ...editCourseData,
                    instructors: [...e.target.selectedOptions].map(
                      (option) => option.value
                    ),
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

            <button className="b2" type="submit">
              Update Course
            </button>
            <button
              className="b2"
              type="button"
              onClick={() => setSelectedCourse(null)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <div>
            <h3>Select a Course to Edit</h3>
            <ul>
              {courses.map((course) => (
                <li key={course.course_id}>
                  <span>{course.title}</span>
                  <button className="editbtn"
                    onClick={() => {
                      setSelectedCourse(course);
                      setEditCourseData({
                        course_id: course.course_id,
                        title: course.title,
                        description: course.description,
                        instructors: course.instructors,
                      });
                    }}
                  >
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      

      <div className="deleteDiv">
      <h3>Delete a Course</h3>
      <input
      className="deleteInput"
        type="text"
        placeholder="Enter Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
       
      />
      <button className="deletebtn"
        onClick={handleDeleteCourse}
      
      >
        Delete Course
      </button>
      {message && (
        <p style={{ marginTop: "10px", color: message.includes("successfully") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>

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

      

        </div>
    );
}


export default AdminCoursesDetails;