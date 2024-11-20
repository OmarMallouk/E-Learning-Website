import React, { useState,useEffect } from "react";
import axios from "axios";
import "../styles/login.css"
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar'


const Instructor = () =>{
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [announcementText, setAnnouncementText] = useState("");
    const [assignmentTitle, setAssignmentTitle] = useState("");
    const [assignmentDescription, setAssignmentDescription] = useState("");
    const [announcements, setAnnouncements] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [showAssignmentForm, setShowAssignmentForm] = useState(false);
    const [showAnnouncements, setShowAnnouncements] = useState(false);
    const [showAssignments, setShowAssignments] = useState(false);

    useEffect(() =>{
        getAll();
    },[])


    const getAll = async () =>{

        try{
            const result = await axios.get("http://localhost/reactELearning/backend/admin_get_all.php",{
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: localStorage.token,  
                },
            });
            if(result.data.success){
                console.log(result.data)
                setCourses(result.data.courses || []);
                setInstructors(result.data.instructors || []);
               
            }
        }
        catch(error){
            console.error("Error fetching data:", error);

        }
    };


    const openAnnouncementModal = (course) => {
        setSelectedCourse(course);
        setShowAnnouncementModal(true);
    };

    const closeAnnouncementModal = () => {
        setSelectedCourse(null);
        setShowAnnouncementModal(false);
    };


    const handleLogout = () => { 
        localStorage.removeItem('token');
        navigate('/'); };
    
    
    return(
        <div className="Instructor-dashboard">
            <Navbar/>

                <h1>Welcome Instructor</h1>
                <button onClick={handleLogout} className="btn">Logout</button>




                <div>
                    <h1>Available Courses</h1>
                    <div className="sections">
                    {courses.map((course) =>(
                        <div key={course.course_id} className="section6">
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                            <button onClick={() => openAnnouncementModal(course.course_id)}>Post Announcement</button>
                        </div>
                ))}
                </div>
                </div>
        </div>


    );
}


export default Instructor;