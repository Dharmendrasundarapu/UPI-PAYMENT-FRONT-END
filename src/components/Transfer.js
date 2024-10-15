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

  const getTransactionType = (transfer) => {
    console.log("Sender:", transfer.senderMobileNumber); // Debug sender number
    console.log("Receiver:", transfer.receiverMobileNumber); // Debug receiver number
    console.log("User Phone:", user.phoneNumber); // Debug user's phone number

    if (transfer.senderMobileNumber === user.phoneNumber) {
      return "Debit"; // If the user is the sender, it's a debit transaction
    } else if (transfer.receiverMobileNumber === user.phoneNumber) {
      return "Credit"; // If the user is the receiver, it's a credit transaction
    }
    return "Unknown"; // Just in case, if neither matches
  };

  return (
    <div className="transfer-container">
      <h1>Transaction History</h1>
      <div className="transaction-list">
        {transferData.length > 0 ? (
          transferData.map((transfer) => (
            <div className="transaction-row" key={transfer.transactionId}>
              <span className="transaction-item"><strong>SENDER:</strong> {transfer.senderMobileNumber}</span>
              <span className="transaction-item"><strong>RECEIVER:</strong> {transfer.receiverMobileNumber} ({transfer.receiverName})</span>
              <span className="transaction-item"><strong>AMOUNT:</strong> {transfer.amount}</span>
              <span className="transaction-item"><strong>TYPE:</strong> {getTransactionType(transfer)}</span> {/* Display transaction type */}
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
