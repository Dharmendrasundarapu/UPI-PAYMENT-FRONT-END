import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; // Adjust the path if needed
import '../styles/Register.css'; // Adjust the path if needed

const Register = () => {
  const { setUser } = useContext(UserContext); // Access setUser from context
  const [registerUser, setRegisterUser] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(""); // State to handle error messages

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    try {
      const response = await axios.post("http://localhost:9090/user/register", registerUser);
      setUser(response.data); // Update user details in context
      navigate("/home"); // Navigate to home page on successful registration
    } catch (err) {
      console.error('Registration failed:', err);
      setError("Registration failed. Please try again."); // Set error message
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>First Name:</label>
        <input
          type="text"
          value={registerUser.firstName}
          onChange={(e) => setRegisterUser({ ...registerUser, firstName: e.target.value })}
          placeholder="Enter your first name"
          required
        />
        
        <label>Last Name:</label>
        <input
          type="text"
          value={registerUser.lastName}
          onChange={(e) => setRegisterUser({ ...registerUser, lastName: e.target.value })}
          placeholder="Enter your last name"
          required
        />

        <label>Address:</label>
        <input
          type="text"
          value={registerUser.address}
          onChange={(e) => setRegisterUser({ ...registerUser, address: e.target.value })}
          placeholder="Enter your address"
          required
        />

        <label>Phone Number:</label>
        <input
          type="text"
          value={registerUser.phoneNumber}
          onChange={(e) => setRegisterUser({ ...registerUser, phoneNumber: e.target.value })}
          placeholder="Enter your phone number"
          required
        />

        <label>Email:</label>
        <input
          type="email"
          value={registerUser.email}
          onChange={(e) => setRegisterUser({ ...registerUser, email: e.target.value })}
          placeholder="Enter your email"
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={registerUser.password}
          onChange={(e) => setRegisterUser({ ...registerUser, password: e.target.value })}
          placeholder="Enter your password"
          required
        />

        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
