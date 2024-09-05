import React, { useState, useEffect,useContext } from "react";
import { UserContext } from '../context/UserContext';
import axios from "axios";

const TransactionMoney = () => {
  const { user, selectedAccount, setSelectedAccount } = useContext(UserContext); // Access user and selectedAccount from context
  const [receiverMobileNumber, setReceiverMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [upiPin, setUpiPin] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [accounts, setAccounts] = useState([]);

  // Effect to load accounts from context or a relevant source
  useEffect(() => {
    if (user && user.accounts) {
      setAccounts(user.accounts);
    }
  }, [user]);

  const handleMoney = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:9090/transaction/transfer", {
        senderMobileNumber: user.mobileNumber, // Use mobile number from context
        receiverMobileNumber,
        amount,
        upiPin,
        fromAccount: selectedAccount, // Include selected account in request
      });

      setResponseMessage(response.data.message || "Transaction successful.");
    } catch (error) {
      setResponseMessage("Transaction failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Transfer Money</h2>
      <form onSubmit={handleMoney}>
        <div>
          <label>Receiver Mobile Number:</label>
          <input
            type="text"
            value={receiverMobileNumber}
            onChange={(e) => setReceiverMobileNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>UPI Pin:</label>
          <input
            type="password"
            value={upiPin}
            onChange={(e) => setUpiPin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Select Account:</label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            required
          >
            <option value="">Select an account</option>
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} - {account.balance}
                </option>
              ))
            ) : (
              <option value="">No accounts available</option>
            )}
          </select>
        </div>
        <button type="submit">Transfer</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default TransactionMoney;
