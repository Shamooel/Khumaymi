"use client"

import { useState, useEffect } from "react"
import "../styles/ManageUsers.css"

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserDetails, setShowUserDetails] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        console.error("Failed to fetch users")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewUser = async (userId) => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setSelectedUser(userData)
        setShowUserDetails(true)
      } else {
        console.error("Failed to fetch user details")
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
    }
  }

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("adminToken")
      const newStatus = currentStatus === "active" ? "inactive" : "active"

      const response = await fetch(`http://localhost:5000/api/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update the user in the local state
        setUsers(users.map((user) => (user._id === userId ? { ...user, status: newStatus } : user)))

        // If we're viewing this user's details, update that too
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser({ ...selectedUser, status: newStatus })
        }
      } else {
        console.error("Failed to update user status")
      }
    } catch (error) {
      console.error("Error updating user status:", error)
    }
  }

  const closeUserDetails = () => {
    setShowUserDetails(false)
    setSelectedUser(null)
  }

  return (
    <div className="manage-users-container">
      <h1>Manage Users</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>{user.status}</span>
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => handleViewUser(user._id)} className="view-button">
                      View
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user._id, user.status)}
                      className={user.status === "active" ? "deactivate-button" : "activate-button"}
                    >
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showUserDetails && selectedUser && (
        <div className="user-details-modal">
          <div className="user-details-content">
            <button className="close-button" onClick={closeUserDetails}>
              ×
            </button>

            <h2>User Details</h2>

            <div className="user-info">
              <div className="user-info-group">
                <h3>Basic Information</h3>
                <div className="info-row">
                  <span className="label">Name:</span>
                  <span className="value">{selectedUser.name}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{selectedUser.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span className={`status-badge ${selectedUser.status}`}>{selectedUser.status}</span>
                </div>
                <div className="info-row">
                  <span className="label">Joined:</span>
                  <span className="value">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="user-info-group">
                <h3>Order History</h3>
                {selectedUser.orders && selectedUser.orders.length > 0 ? (
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUser.orders.map((order) => (
                        <tr key={order._id}>
                          <td>#{order._id.slice(-6)}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>${order.totalAmount.toFixed(2)}</td>
                          <td>
                            <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No orders found for this user.</p>
                )}
              </div>
            </div>

            <div className="user-actions">
              <button
                onClick={() => handleToggleStatus(selectedUser._id, selectedUser.status)}
                className={selectedUser.status === "active" ? "deactivate-button" : "activate-button"}
              >
                {selectedUser.status === "active" ? "Deactivate User" : "Activate User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUsers

