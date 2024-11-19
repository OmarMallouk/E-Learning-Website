import React, { useState } from "react";
import axios from "axios";
import "../styles/signup.css"
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar'

const Signup =() =>{
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            const response = await axios.post('http://localhost/reactELearning/backend/users.php',{
                name: username,
                password: password,
                email: email,
                role: role

            });
            if (response.data.success){
                console.log("Signup success");
                navigate('/');

            }else{
                setErrorMessage(response.data.error);
            }
        }catch (error){
            console.error('Error during signup request: ', error);
            setErrorMessage('An error occurred. Please try again.')
        }
    };

    const goToLogin = () => {
        navigate('/'); 
    };
    

    return (
        
        <div className="signup-container">
            <Navbar/>
        <h2>Signup</h2>
        <form id="signupForm" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" value={username}
                onChange={(e) => setUsername(e.target.value)} required/>
            </div>
            <div className="form-group">
                <label htmlFor="email">email</label>
                <input type="text" id="email" name="email" value={email}
                onChange={(e) => setEmail(e.target.value)} required/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={password} 
                onChange={(e) => setPassword(e.target.value)} required/>
            </div>

            <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select className="role"
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="">Select type</option>
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                    </select>
                </div>
            <button type="submit" className="btn">Signup</button>
            {errorMessage && <div id="errorMessage" className="error-message">{errorMessage}</div>}
        </form>
        <button onClick={goToLogin}>login?</button>
    </div>
    
    );
};

export default Signup