import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/login.css";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";



const StudentInvite = () =>{
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [emailToInvite, setEmailToInvite] = useState("");
    const [showInviteModal, setShowInviteModal] = useState(false);



    return(

<div>
    <Navbar/>

    HIIIIIII
</div>

    );
}


export default StudentInvite;