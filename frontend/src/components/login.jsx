import React, { useState } from "react";
import axios from "axios";
import "../styles/login.css"
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar'


const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (event) =>{
        event.preventDefault();

        try{
            const response = await axios.post('http://localhost/reactExpenseTracker/backend/php/login.php',{
                username: username,
                password: password

         }); 
         if (response.data.success){
            localStorage.setItem('user_id', response.data.user_id);
            console.log('User logged in, user_id saved to localStorage');
            navigate('/transactionForm');
         
        }else{
            setErrorMessage(response.data.error);
        }
        }catch (error){
            console.error('Error during signup request: ', error);
            setErrorMessage('An error occurred. Please try again.')
        }
    };

    const goToSignup = () => {
        navigate('/signup'); 
    };
    

    return(
        <div className="login-container">
            <Navbar/>
            
            <h2>Login</h2>
    <form id="loginForm" onSubmit={handleLogin}>
        <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" value={username}
            onChange={(e) => setUsername(e.target.value)} required/>
        </div>
        <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={password}
            onChange={(e)=> setPassword(e.target.value)} required/>
        </div>
        <button type="submit" className="btn">Login</button>
        {/* <a href="http://localhost/reactExpenseTracker/frontend/src/components/signup.jsx">signup?</a> */}
        {errorMessage && <div id="errorMessage" className="error-message">{errorMessage}</div>}
    </form>
    <button onClick={goToSignup}>signup?</button>



            </div>

    );
}


export default Login