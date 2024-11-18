import './App.css';
import Navbar from './components/navbar';
import Signup from './components/singup';
import Login from './components/login';

import { Routes, Route, useLocation } from "react-router-dom";

function App() {

  const location = useLocation();

  return (
    <div className="App">
       <Routes>
        <Route path="/" element={ <Login/>}/>
        <Route path="/signup" element={ <Signup/>}/>
       
     
      </Routes>
    </div>
  );
}

export default App;
