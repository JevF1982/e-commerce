import React, { useEffect, useState } from "react";
import Axios from "axios";
import moment from "moment";

function HistoryPage() {
  const [History, setHistory] = useState([]);

  useEffect(() => {
    Axios.get("/api/users/getHistory").then((res) => {
      if (res.data.success) {
        setHistory(res.data.history);
      } else {
        alert("Failed to get History");
      }
    });
  }, []);

  console.log(History);

  return (
    <div style={{ width: "80%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h1>History</h1>
      </div>
      <br />
      <table>
        <thead>
          <tr>
            <th>Payment Id</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Date of Purchase</th>
          </tr>
        </thead>
        <tbody>
          {History.map((item) => (
            <tr key={item._id}>
              <td>{item.paymentId}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>
                {moment(item.dateOfPurchase).format("YYYY/MM/D hh:mm:ss SSS")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryPage;
