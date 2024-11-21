import Navbar from './components/navbar';
import Signup from './components/singup';
import Login from './components/login';
import Instructor from './components/instructor-dashboard';
import Student from './components/user-dashboard';
import StudentInvitation from './pages/studentInvitation';
import Admin from './components/adminDashboard';
import AdminCourseDetails from './pages/adminCoursesDetail';
import CourseStream from './components/courseStream';
import './App.css';

import { Routes, Route, useLocation } from "react-router-dom";
import AdminCoursesDetails from './pages/adminCoursesDetail';
import StudentInvite from './pages/studentInvite';

function App() {

  const location = useLocation();
  
  return (
    <div className="App">
       <Routes>/
        <Route path="/" element={ <Login/>}/>
        <Route path="/signup" element={ <Signup/>}/>
        <Route path="/instructorDash" element={ <Instructor/>}/>
        <Route path="/studentDash" element={ <Student/>}/>
        <Route path="/adminDash" element={ <Admin/>}/>
        <Route path="/adminCoursesDetail" element={ <AdminCoursesDetails/>}/>
        <Route path="/inviteStudent" element={ <StudentInvite/>}/>
        <Route path="/invitations" element={ <StudentInvitation/>}/>
        <Route path="/courseStream/:courseId" element={<CourseStream/>} />
     
      </Routes>
    </div>
  );
}

export default App;
