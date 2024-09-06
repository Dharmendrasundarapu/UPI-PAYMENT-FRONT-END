import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
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
    setUser(null);
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // Perform your update operation here if needed
    setUser(formData);
    setIsEditing(false);
    navigate("/home");
  };

  const handleCheckBalance = (account) => {
    setSelectedAccount(account);
    setShowPinForm(account.accountNumber); // Set account number to show PIN form for that account
    setBalance(null); // Clear previous balance
  };

  const handlePinChange = (e) => {
    setUpiPin(e.target.value);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();

    if (selectedAccount) {
      // Verify UPI PIN from UserContext
      if (user.upiPin === upiPin) {
        console.log("User UPI PIN: ", user.upiPin);
        console.log("Entered UPI PIN: ", upiPin);

        const account = user.accounts.find(acc => acc.accountNumber === selectedAccount.accountNumber);
        if (account) {
          setBalance(account.bankBalance); // Use `bankBalance` property in your account object
        } else {
          alert("Account not found.");
        }
      } else {
        alert("Incorrect UPI PIN");
      }
      setShowPinForm(null); // Hide PIN form after checking balance or if PIN is incorrect
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

      {selectedAccount && showPinForm === null && (
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
