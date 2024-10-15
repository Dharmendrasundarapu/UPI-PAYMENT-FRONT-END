import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';  // Import axios
import '../styles/Home.css';

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user || {});
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [upiPin, setUpiPin] = useState('');
  const [showPinForm, setShowPinForm] = useState(null); // Use null to indicate no account selected for PIN input
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData(user);
      setAccounts(user.accounts || []);
    }
  }, [user]);

  if (!user) {
    return <h1>Please login or register to view this page</h1>;
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(user); // Revert to original user data
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
      // Assume there's an API endpoint to update user details
      await axios.put(`http://localhost:9090/user/update`, formData);
      setUser(formData);
      setIsEditing(false);
      navigate("/home");
    } catch (error) {
      alert("Error updating user details: " + (error.response?.data?.message || error.message));
    }
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
    setUser(null);
    navigate("/");
  };

  const handleCheckBalance = (account) => {
    setSelectedAccount(account);
    setShowPinForm(account.accountNumber);
    setBalance(null);
  };

  const handlePinChange = (e) => {
    setUpiPin(e.target.value);
  };
  const handlePinSubmit = async (e) => {
    e.preventDefault();
  
    if (selectedAccount) {
      try {
        // Pass the UPI PIN and account number to the backend
        const response = await axios.get(`http://localhost:9090/account/upiPin`, {
          params: {
            upiPin,            // Entered UPI PIN
            accountNumber: selectedAccount.accountNumber  // Selected account number
          }
        });
  
        // Assuming the API response structure is as follows
        const { bankBalance, upiPin: correctUpiPin } = response.data;
  
        console.log(`Entered UPI PIN: ${upiPin}`);
        console.log(`Correct UPI PIN: ${correctUpiPin}`);
  
        if (upiPin === String(correctUpiPin)) {  // Ensure comparison is done with string
          // Update balance and the UPI PIN in UserContext
          setBalance(bankBalance);
          setUser((prevUser) => ({
            ...prevUser,
            upiPin: upiPin  // Optionally update the UPI PIN in context
          }));
  
          setShowPinForm(null);  // Hide the PIN form after successful verification
        } else {
          alert("Wrong UPI PIN for the selected account.");
          setBalance(null);  // Clear balance display
          setUpiPin('');  // Clear UPI PIN field
        }
      } catch (error) {
        console.error('Error verifying PIN:', error);
        if (error.response) {
          alert("Error verifying PIN: " + (error.response.data.message || error.message));
        } else {
          alert("Error verifying PIN: " + error.message);
        }
      }
    }
  };
  

  return (
    <div className="home-container">
      <h2>Welcome, {user.firstName}!</h2>

      {!isEditing ? (
        <div className="info-section">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>

          {accounts.length > 0 ? (
            accounts.map((account, index) => (
              <div key={index} className="account-card">
                <p><strong>Bank Name:</strong> {account.bankName}</p>
                <p><strong>Account Number:</strong> {account.accountNumber}</p>

                <button onClick={() => handleCheckBalance(account)}>Check Balance</button>

                {showPinForm === account.accountNumber && (
                  <form onSubmit={handlePinSubmit} className="pin-form">
                    <label>
                      Enter UPI PIN:
                      <input
                        type="password"
                        value={upiPin}
                        onChange={handlePinChange}
                        required
                      />
                    </label><br />
                    <button type="submit" className="submit-pin-button">Submit</button>
                  </form>
                )}

                {balance !== null && showPinForm === null && selectedAccount?.accountNumber === account.accountNumber && (
                  <div className="balance-info">
                    <h3>Account Balance:</h3>
                    <p><strong>Balance:</strong> {balance}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No bank accounts available.</p>
          )}

          <button onClick={handleEditClick} className="edit-button">Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="edit-form">
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
            />
          </label><br />
          <label>
            Phone Number:
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              required
            />
          </label><br />
          <button type="submit" className="save-button">Save</button>
          <button type="button" onClick={handleCancelClick} className="cancel-button">Cancel</button>
        </form>
      )}

      <div className="button-container">
        <button onClick={handleHistory} className="history-button">Transaction History</button>
        <button onClick={handleAccount} className="create-account-button">Create Account</button>
        <button onClick={handleMoney}>Transfer Money</button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default Home;
