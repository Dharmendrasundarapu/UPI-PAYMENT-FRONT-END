import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/Home.css';

const Home = () => {
  const { user, setUser, selectedAccount, setSelectedAccount } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user || {});
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  // Set form data and accounts when user changes
  useEffect(() => {
    if (user) {
      setFormData(user);
      setAccounts(user.accounts || []);
    }
  }, [user]);

  // Fetch user details only once or when there are no accounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/user/${user.id}`);
        setUser(response.data);
        setAccounts(response.data.accounts || []);
      } catch (err) {
        console.error('Failed to fetch user details:', err);
      }
    };

    if (user && !accounts.length) {
      fetchUserDetails();
    }
  }, [user, accounts.length, setUser]);

  if (!user) {
    return <h1>Please login or register to view this page</h1>;
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(user);
  };

  const handleHistory = () => {
    navigate("/history");
  };

  const handleAccount = () => {
    navigate("/accCreate");
  };

  const handleMoney = () => {
    navigate("/send");
  };

  const handleLogout = () => {
    setUser(null); // Clear user details from context
    navigate("/login"); // Navigate to login page
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:9090/user/${user.id}`, formData);
      console.log("Update response:", response.data);
      setUser(response.data);
      setIsEditing(false);
      navigate("/home");
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleBankSelection = (account) => {
    setSelectedAccount(account);
  };

  return (
    <div className="home-container">
      <h2>Welcome, {user.firstName}!</h2>

      {!isEditing ? (
        <div className="info-section">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
          <p><strong>Address:</strong> {user.address}</p>

          <div className="accounts-section">
            <h3>Bank Accounts:</h3>
            {accounts.length > 0 ? (
              accounts.map((account, index) => (
                <div key={index} className="account-card">
                  <p><strong>Bank Name:</strong> {account.bankName}</p>
                  <p><strong>Account Number:</strong> {account.accountNumber}</p>
                  <p><strong>Bank Balance:</strong> {account.bankBalance}</p>
                  <p><strong>Transaction Limit:</strong> {account.transactionLimit}</p>
                  <button onClick={() => handleBankSelection(account)}>Select Bank</button>
                </div>
              ))
            ) : (
              <p>No bank accounts available.</p>
            )}
          </div>

          <button onClick={handleEditClick} className="edit-button">Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="edit-form">
          <label>
            First Name:
            <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} required />
          </label><br />
          <label>
            Last Name:
            <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} required />
          </label><br />
          <label>
            Address:
            <input type="text" name="address" value={formData.address || ''} onChange={handleChange} required />
          </label><br />
          <label>
            Phone Number:
            <input type="text" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} required />
          </label><br />
          <label>
            Email:
            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
          </label><br />
          <label>
            Password:
            <input type="password" name="password" value={formData.password || ''} onChange={handleChange} required />
          </label><br />
          <button type='submit' className="edit-button">Save</button>
          <button type="button" onClick={handleCancelClick} className="cancel-button">Cancel</button>
        </form>
      )}

      <div className="button-container">
        <button onClick={handleHistory} className="history-button">Transaction History</button>
        <button onClick={handleAccount} className="create-account-button">Create Account</button>
        <button onClick={handleMoney}>Transfer Money</button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {selectedAccount && (
        <div className="selected-account">
          <h3>Selected Bank:</h3>
          <p><strong>Bank Name:</strong> {selectedAccount.bankName}</p>
          <p><strong>Account Number:</strong> {selectedAccount.accountNumber}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
