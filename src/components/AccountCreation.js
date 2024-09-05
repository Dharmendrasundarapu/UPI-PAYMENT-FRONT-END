import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AccountCreation.css'; // Import the CSS file

const AccountCreation = () => {
    const { user, setUser } = useContext(UserContext); // Access user and setUser from context
    const [accountData, setAccountData] = useState({
        userId: user ? user.id : '', // Use user.id from context
        bankName: '',
        accountNumber: '',
        pin: '',
        bankBalance: '100000',
        upiPin: ''
    });
    const banks = [
        'SBI',
        'HDFC',
        'KOTAK',
        'ICICI',
        'ANDHRA',
        'YES'
    ];
    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAccountData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleBankChange = (e) => {
        const selectedBank = e.target.value;
        setAccountData(prevState => ({
            ...prevState,
            bankName: selectedBank
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:9090/account/create", accountData);
            // Optionally update user details in context if needed
            setUser(prevState => ({
                ...prevState,
                accounts: [...prevState.accounts, response.data] // Add new account to context
            }));
            navigate('/home'); // Navigate to home page
        } catch (err) {
            console.log("Account creation failed", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="account-creation-form">
            <h2>Create Account</h2>
            <div>
                <label>Bank Name</label>
                <select
                    name="bankName"
                    value={accountData.bankName}
                    onChange={handleBankChange}
                    required
                >
                    <option value="">Select a bank</option>
                    {banks.map(bank => (
                        <option key={bank} value={bank}>
                            {bank}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Account Number</label>
                <input
                    type="text"
                    name="accountNumber"
                    value={accountData.accountNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>PIN</label>
                <input
                    type="password"
                    name="pin"
                    value={accountData.pin}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Bank Balance</label>
                <input
                    type="text"
                    name="bankBalance"
                    value={accountData.bankBalance}
                    readOnly
                />
            </div>
            <div>
                <label>UPI PIN</label>
                <input
                    type="password"
                    name="upiPin"
                    value={accountData.upiPin}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Create Account</button>
        </form>
    );
};

export default AccountCreation;
