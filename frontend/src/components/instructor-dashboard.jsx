import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/login.css";
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';

const Instructor = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [announcementText, setAnnouncementText] = useState("");
    const [selectedCourseAnnouncements, setSelectedCourseAnnouncements] = useState([]);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [showAnnouncements, setShowAnnouncements] = useState(false);

    const [assignmentTitle, setAssignmentTitle] = useState("");
    const [assignmentDescription, setAssignmentDescription] = useState("");
    const [assignmentDueDate, setAssignmentDueDate] = useState("");
    const [assignments, setAssignments] = useState([]);
    const [selectedCourseAssignments, setSelectedCourseAssignments] = useState([]);
    const [showAssignmentForm, setShowAssignmentForm] = useState(false);
    const [showAssignments, setShowAssignments] = useState(false);



    useEffect(() => {
        getAll();
    }, []);

    const getAll = async () => {
        try {
            const result = await axios.get("http://localhost/reactELearning/backend/admin_get_all.php", {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.token,
                },
            });
            if (result.data.success) {
                setCourses(result.data.courses || []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const openAnnouncementModal = (course) => {
        setSelectedCourse(course);
        setShowAnnouncementModal(true);
    };

    const closeAnnouncementModal = () => {
        setSelectedCourse(null);
        setAnnouncementText(""); // Clear the text field when closing modal
        setShowAnnouncementModal(false);
    };

    const submitAnnouncement = async () => {
        try {
            await axios.post(
                "http://localhost/reactELearning/backend/add_announcement.php",
                {
                    course_id: selectedCourse.course_id,
                    content: announcementText,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.token}`,
                    },
                }
            );
            alert("Announcement posted successfully!");
            closeAnnouncementModal();  // Close modal after submission
        } catch (error) {
            console.error("Failed to fetch assignments", error.response ? error.response.data : error);
        }
    };

    const fetchAnnouncements = async (course_id) => {
        try {
            const response = await axios.get(`http://localhost/reactELearning/backend/get_announcements.php?course_id=${course_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                },
            });
            if (response.data.success) {
                setSelectedCourseAnnouncements(response.data.announcements || []);
                setShowAnnouncements(true);
            } else {
                alert("No announcements found for this course.");
            }
        } catch (error) {
            console.error("Error fetching announcements:", error);
            alert("Failed to fetch announcements.");
        }
    };

    const submitAssignment = async () => {
        try {
            await axios.post(
                "http://localhost/reactELearning/backend/add_assignment.php",
                {
                    course_id: selectedCourse.course_id,
                    title: assignmentTitle,
                    description: assignmentDescription,
                    due_date: assignmentDueDate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.token}`,
                    },
                }
            );
            alert("Assignment created successfully!");
            closeAssignmentForm();
        } catch (error) {
            console.error("Failed to create assignment", error);
        }
    };



    const openAssignmentForm = (course) => {
        setSelectedCourse(course);
        setShowAssignmentForm(true);
    };

    const closeAssignmentForm = () => {
        setSelectedCourse(null);
        setShowAssignmentForm(false);
    };

    const fetchAssignments = async (course_id) => {
        try {
            const response = await axios.get(`http://localhost/reactELearning/backend/get_assignments.php?course_id=${course_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                },
            });
            setSelectedCourseAssignments(response.data.assignments || []);
            setShowAssignments(true);
        } catch (error) {
            console.error("Failed to fetch assignments", error);
        }
    };
    


    const handleStudent = () => { 
        navigate('/inviteStudent'); };
    





    return (
        <div className="Instructor-dashboard">
            <Navbar />
            <h1>Welcome Instructor</h1>

            <div>
                <h1>Available Courses</h1>
                <div className="sections">
                    {courses.map((course) => (
                        <div key={course.course_id} className="section6">
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                            <button onClick={() => fetchAnnouncements(course.course_id)}>View Announcements</button>
                            <button onClick={() => openAnnouncementModal(course)}>Post Announcement</button>
                            <button onClick={() => openAssignmentForm(course)}>Post Assignments</button>
                            <button onClick={() => fetchAssignments(course.course_id)}>View Assignments</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Announcement Modal */}
            {showAnnouncementModal && (
                <div className="modal">
                    <h2>Post Announcement for {selectedCourse?.title}</h2>
                    <textarea
                        placeholder="Write your announcement here"
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                    />
                    <button onClick={submitAnnouncement}>Submit</button>
                    <button onClick={closeAnnouncementModal}>Cancel</button>
                </div>
            )}

            {/* Announcements List Modal */}
            {showAnnouncements && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Announcements for {selectedCourse?.title}</h3>
                        {selectedCourseAnnouncements.length > 0 ? (
                            <ul>
                                {selectedCourseAnnouncements.map((announcement) => (
                                    <li key={announcement.announcement_id}>
                                        <p><strong>Content:</strong> {announcement.content}</p>
                                        <p><strong>Date:</strong> {announcement.created_at}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No announcements available.</p>
                        )}
                        <button onClick={() => setShowAnnouncements(false)}>Close</button>
                    </div>
                </div>
            )}



{showAssignments && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Assignments for {selectedCourse?.title}</h3>
                        {selectedCourseAssignments.length > 0 ? (
                            <ul>
                                {selectedCourseAssignments.map((assignment) => (
                                    <li key={assignment.assignment_id}>
                                         <p><strong>Title:</strong> {assignment.title}</p>
                            <p><strong>Description:</strong> {assignment.description}</p>
                            <p><strong>Due Date:</strong> {assignment.due_date}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No assignments available.</p>
                        )}
                        <button onClick={() => setShowAssignments(false)}>Close</button>
                    </div>
                </div>
            )}


{showAssignmentForm && (
                <div className="modal">
                    <h2>Create Assignment for {selectedCourse.title}</h2>
                    <input
                        type="text"
                        placeholder="Assignment Title"
                        value={assignmentTitle}
                        onChange={(e) => setAssignmentTitle(e.target.value)}
                    />
                    <textarea
                        placeholder="Assignment Description"
                        value={assignmentDescription}
                        onChange={(e) => setAssignmentDescription(e.target.value)}
                    />
                    <textarea
                        placeholder="Assignment Due Date"
                        value={assignmentDueDate}
                        onChange={(e) => setAssignmentDueDate(e.target.value)}
                    />
                    <button onClick={submitAssignment}>Submit</button>
                    <button onClick={closeAssignmentForm}>Cancel</button>
                </div>
            )}

            <button onClick={handleStudent} className="btn">Invite studens</button>
        </div>
    );
};

export default Instructor;
