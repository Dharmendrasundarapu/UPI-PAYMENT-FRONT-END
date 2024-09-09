import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../context/UserContext';
import axios from "axios";
import '../styles/TransactionMoney.css';
import { useNavigate } from "react-router-dom";

const TransactionMoney = () => {
  const { user, selectedAccount, setSelectedAccount } = useContext(UserContext);
  const [receiverMobileNumber, setReceiverMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [upiPin, setUpiPin] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [bankAccounts, setBankAccounts] = useState([]);
  const [step, setStep] = useState(1); // Step for controlling form view
  const navigate = useNavigate(); // Use it as a function

  useEffect(() => {
    if (user && user.accounts) {
      setBankAccounts(user.accounts);
    } else {
      console.log("No accounts found in UserContext.");
    }
  }, [user]);

  const handleProceed = (e) => {
    e.preventDefault();
    if (receiverMobileNumber && selectedAccount && amount) {
      setStep(2); // Move to the next step if all required fields are filled
    } else {
      setResponseMessage("Please fill in all the fields before proceeding.");
    }
  };

  const handleMoney = async (e) => {
    e.preventDefault();
    if (user && selectedAccount && amount && upiPin) {
      try {
        const response = await axios.post("http://localhost:8080/transaction/initiateTransfer", {
          senderMobileNumber: user.phoneNumber,
          receiverMobileNumber,
          amount,
          upiPin,
          fromAccount: selectedAccount,
        });

        console.log(response.data);
        setResponseMessage(response.data.message || "Transaction successful.");
        setStep(1); // Reset to the first step after successful transaction
        setReceiverMobileNumber("");
        setAmount("");
        setUpiPin("");
        setSelectedAccount("");
        navigate("/home"); // Navigate to home page after successful transaction
        
      } catch (error) {
        setResponseMessage("Transaction failed. Please try again.");
      }
    } else {
      setResponseMessage("Please fill in all fields before sending.");
    }
  };

  return (
    <div className="transaction-container">
      <h2>Transfer Money</h2>
      {step === 1 && (
        <form onSubmit={handleProceed}>
          <div className="form-group">
            <label>Receiver Mobile Number:</label>
            <input
              type="text"
              value={receiverMobileNumber}
              onChange={(e) => setReceiverMobileNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Select Account:</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              required
            >
              <option value="">Select an account</option>
              {bankAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.bankName} - {account.balance}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="proceed-btn">Proceed</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleMoney}>
          <div className="form-group">
            <label>UPI Pin:</label>
            <input
              type="password"
              value={upiPin}
              onChange={(e) => setUpiPin(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="send-btn">Send</button>
        </form>
      )}

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default TransactionMoney;
