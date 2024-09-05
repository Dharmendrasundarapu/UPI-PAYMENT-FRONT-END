import axios from "axios";
import { useEffect, useState } from "react";

const Transfer = ({ userDetails }) => {
  const [transferData, setTransferData] = useState([]);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        if (userDetails && userDetails.phoneNumber) {
          const response = await axios.get(`http://localhost:9090/transaction/history/${userDetails.phoneNumber}`);
          setTransferData(response.data);
        }
      } catch (err) {
        console.error('Error fetching transaction history:', err);
      }
    };

    fetchTransactionHistory();
  }, [userDetails]); 

  return (
    <>
      <h1>Transaction History</h1>
      <ul>
        {transferData.length > 0 ? (
          transferData.map((transfer) => (
            <li key={transfer.transactionId}>
              <strong>SENDER:</strong> {transfer.senderMobileNumber}<br />
              <strong>RECEIVER:</strong> {transfer.receiverMobileNumber}<br />
              <strong>AMOUNT:</strong> {transfer.amount}<br />
              <strong>Transaction Id:</strong> {transfer.transactionId}<br />
              <strong>Transaction Date:</strong> {transfer.transactionDate}<br />
              <strong>Status:</strong> {transfer.status}<br />
            </li>
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </ul>
    </>
  );
};

export default Transfer;
