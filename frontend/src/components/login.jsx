import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar'

const LoginForm = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !password) {
            setMessage('Username and password are required');
            return;
        }

        const loginData = {
            name: name,
            password: password
        };

        try {
            const response = await axios.post('http://localhost/reactELearning/backend/login.php', loginData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;

            if (data.success) {
                setMessage('Login successful');
                localStorage.setItem('token', data.token);

                // Redirect based on the role
                if (data.message === 'Instructor access granted') {
                   navigate('/instructorDash');
                } else if (data.message === 'Student access granted') {
                    navigate('/studentDash');
                } else if (data.message === 'Admin access granted') {
                    navigate('/adminDash');
                }
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while trying to log in.');
        }
    };

    const goToSignup = () => {
        navigate('/signup'); 
    };

  
     

    return (
        <div className="login-container">
        <Navbar/>
        
        <h2>Login</h2>
<form id="loginForm" onSubmit={handleSubmit}>
    <div className="form-group">
        <label htmlFor="name">Username</label>
        <input type="text" id="username" name="name" value={name}
        onChange={(e) => setName(e.target.value)} required/>
    </div>
    <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" value={password}
        onChange={(e)=> setPassword(e.target.value)} required/>
    </div>
    <button type="submit" className="btn">Login</button>


</form>
<button onClick={goToSignup}>signup?</button>



        </div>

    );
};

export default LoginForm;
