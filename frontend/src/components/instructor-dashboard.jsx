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
        setAnnouncementText(""); // Clear the text field when closing the modal
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
            console.error("Failed to post announcement", error);
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="Instructor-dashboard">
            <Navbar />
            <h1>Welcome Instructor</h1>
            <button onClick={handleLogout} className="btn">Logout</button>

            <div>
                <h1>Available Courses</h1>
                <div className="sections">
                    {courses.map((course) => (
                        <div key={course.course_id} className="section6">
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                            <button onClick={() => fetchAnnouncements(course.course_id)}>View Announcements</button>
                            <button onClick={() => openAnnouncementModal(course)}>Post Announcement</button>
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
        </div>
    );
};

export default Instructor;
