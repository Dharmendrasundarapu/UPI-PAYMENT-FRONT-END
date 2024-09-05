import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext"; // Import UserContext
import "../styles/Transfer.css"; // Import from your style folder

const Transfer = () => {
  const { user } = useContext(UserContext); // Access the user from UserContext
  const [transferData, setTransferData] = useState([]);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        // Check if the user is defined and has a phoneNumber
        if (user && user.phoneNumber) {
          const response = await axios.get(`http://localhost:9090/transaction/history/${user.phoneNumber}`);
          setTransferData(response.data);
        }
      } catch (err) {
        console.error("Error fetching transaction history:", err);
      }
    };

    fetchTransactionHistory();
  }, [user]); // Fetch when the user changes

  return (
    <div className="transfer-container">
      <h1>Transaction History</h1>
      <div className="transaction-list">
        {transferData.length > 0 ? (
          transferData.map((transfer) => (
            <div className="transaction-row" key={transfer.transactionId}>
              <span className="transaction-item"><strong>SENDER:</strong> {transfer.senderMobileNumber}</span>
              <span className="transaction-item"><strong>RECEIVER:</strong> {transfer.receiverMobileNumber}</span>
              <span className="transaction-item"><strong>AMOUNT:</strong> {transfer.amount}</span>
              <span className="transaction-item"><strong>ID:</strong> {transfer.transactionId}</span>
              <span className="transaction-item"><strong>DATE:</strong> {transfer.transactionDate}</span>
              <span className="transaction-item"><strong>STATUS:</strong> {transfer.status}</span>
            </div>
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Transfer;
