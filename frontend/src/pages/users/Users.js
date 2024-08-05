import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./users.css";

const ITEMS_PER_PAGE = 10;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [editForm, setEditForm] = useState({
    avatar: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    createdAt: "",
    verified: false
  });

  const [newUserForm, setNewUserForm] = useState({
    avatar: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    createdAt: new Date().toISOString(),
    verified: false
  });

  const [filterField, setFilterField] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users");
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setEditForm({
      avatar: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      verified: user.verified
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/users/${editingUser.id}`,
        editForm
      );
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...editForm } : user
        )
      );
      setEditingUser(null);
    } catch (err) {
      console.error("Error editing user", err);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewUserForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/users",
        newUserForm
      );
      setUsers([...users, response.data]);
      setAddingUser(false);
    } catch (err) {
      console.error("Error adding user", err);
    }
  };

  const handleFilterFieldChange = (e) => {
    setFilterField(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // the export function
  const navigate = useNavigate();
  const handleExport = () => {
    const dataToExport = displayedUsers;
    localStorage.removeItem("exportedData"); // Clear previous data
    localStorage.setItem(
      "exportedData",
      JSON.stringify({ type: "users", data: dataToExport })
    );
    navigate("/reports");
  };

  // Filter and search logic
  const filteredAndSortedUsers = users
    .filter((user) => {
      const matchesFilter =
        filterField === "" ||
        user[filterField]
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesSearch =
        searchQuery === "" ||
        Object.keys(user).some((key) =>
          user[key].toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (filterField === "") return 0;
      if (a[filterField] < b[filterField]) return -1;
      if (a[filterField] > b[filterField]) return 1;
      return 0;
    });

  const pageCount = Math.ceil(filteredAndSortedUsers.length / ITEMS_PER_PAGE);
  const displayedUsers = filteredAndSortedUsers.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="users-container">
      <div className="header">
        <h1>Users</h1>
        <button className="add-user-button" onClick={() => setAddingUser(true)}>
          Add User
        </button>
      </div>
      {/* Search and filter inputs */}
      <div className="filters">
        <div className="search-container">
          <img src="/search.svg" alt="" className="icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search here ..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filter-container">
          <label className="filter-label">Filter</label>
          <select
            value={filterField}
            onChange={handleFilterFieldChange}
            className="filter-select"
          >
            <option value="">Select field</option>
            <option value="id">ID</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="createdAt">Created At</option>
            <option value="verified">Verified</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="users-table">
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map((user) => (
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
                <td>
                  <button onClick={() => deleteUser(user.id)}>Delete</button>
                  <button onClick={() => startEditing(user)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>
          Page {page + 1} of {pageCount}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          disabled={page === pageCount - 1}
        >
          Next
        </button>
        <button className="export-button" onClick={handleExport}>
          Export
        </button>
      </div>

      {editingUser && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Edit User</h2>
            <form onSubmit={handleEditSubmit}>
              <div>
                <label>First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={editForm.firstName}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>Verified:</label>
                <select
                  name="verified"
                  value={editForm.verified}
                  onChange={handleEditChange}
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingUser(null)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {addingUser && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Add User</h2>
            <form onSubmit={handleAddSubmit}>
              <div>
                <label>Avatar URL:</label>
                <input
                  type="text"
                  name="avatar"
                  value={newUserForm.avatar}
                  onChange={handleAddChange}
                />
              </div>
              <div>
                <label>First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={newUserForm.firstName}
                  onChange={handleAddChange}
                />
              </div>
              <div>
                <label>Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={newUserForm.lastName}
                  onChange={handleAddChange}
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={newUserForm.email}
                  onChange={handleAddChange}
                />
              </div>
              <div>
                <label>Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={newUserForm.phone}
                  onChange={handleAddChange}
                />
              </div>
              <div>
                <label>Verified:</label>
                <select
                  name="verified"
                  value={newUserForm.verified}
                  onChange={handleAddChange}
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setAddingUser(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
