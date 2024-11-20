import Navbar from './components/navbar';
import Signup from './components/singup';
import Login from './components/login';
import Instructor from './components/instructor-dashboard';
import Student from './components/user-dashboard';
import Admin from './components/adminDashboard';
import AdminCourseDetails from './pages/adminCoursesDetail';
import './App.css';

import { Routes, Route, useLocation } from "react-router-dom";
import AdminCoursesDetails from './pages/adminCoursesDetail';

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
     
      </Routes>
    </div>
  );
}

export default App;
