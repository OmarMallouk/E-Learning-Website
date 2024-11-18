import './App.css';
import Navbar from './components/navbar';
import Signup from './components/singup';

import { Routes, Route, useLocation } from "react-router-dom";

function App() {

  const location = useLocation();

  return (
    <div className="App">
       <Routes>
        <Route path="/" element={ <Signup/>}/>
       
     
      </Routes>
    </div>
  );
}

export default App;
