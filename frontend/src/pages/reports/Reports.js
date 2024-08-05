import React, { useEffect, useState } from "react";
import "./reports.css";

const Reports = () => {
  const [exportedData, setExportedData] = useState([]);
  const [reportType, setReportType] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("exportedData");
    if (data) {
      const parsedData = JSON.parse(data);
      setExportedData(parsedData.data);
      setReportType(parsedData.type);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-container">
      <div className="header">
        <h1>Exported {reportType === "users" ? "Users" : "Products"} Report</h1>
        <button className="print-button" onClick={handlePrint}>
          Print
        </button>
      </div>
      {reportType === "users" ? (
        <table className="reports-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Avatar</th>
              <th>f.Name</th>
              <th>l.Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created At</th>
              <th>Verified</th>
            </tr>
          </thead>
          <tbody>
            {exportedData.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="avatar"
                    />
                  ) : (
                    <div className="avatar-initials">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </div>
                  )}
                </td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`status ${
                      user.verified ? "verified" : "not-verified"
                    }`}
                  >
                    {user.verified ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="reports-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Created At</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {exportedData.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="image-placeholder">
                      {product.name.charAt(0)}
                    </div>
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`status ${
                      product.available ? "available" : "not-available"
                    }`}
                  >
                    {product.available ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reports;
