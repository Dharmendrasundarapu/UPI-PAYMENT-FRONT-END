import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Adjust the path if needed
import '../styles/styles.css';

const LogIn = () => {
    const { setUser } = useContext(UserContext); // Access setUser from context
    const [loginUser, setLoginUser] = useState({
        phoneNumber: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleLogIn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:9090/user/login", loginUser);

            if (response.data && response.data.id) {
                // Update user details in context
                setUser(response.data);
                // Navigate to home page
                navigate("/home");
            } else {
                // Handle cases where response data is not as expected
                console.error("Login response does not contain expected user data:", response.data);
                navigate("/register");
            }
        } catch (err) {
            console.error('Login failed:', err);
            // Navigate to register page in case of error
            navigate("/register");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogIn}>
                <label>
                    MOBILE NUMBER:
                    <input
                        type="text"
                        value={loginUser.phoneNumber}
                        onChange={(e) => setLoginUser({ ...loginUser, phoneNumber: e.target.value })}
                        placeholder="Enter phone number"
                        required
                    />
                </label>
                <label>
                    PASSWORD:
                    <input
                        type="password"
                        value={loginUser.password}
                        onChange={(e) => setLoginUser({ ...loginUser, password: e.target.value })}
                        placeholder="Enter password"
                        required
                    />
                </label>
                <button type="submit">LOGIN</button>
                <div className="register-link">
                    <Link to="/register">
                        <button className="register-button">Register</button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LogIn;
