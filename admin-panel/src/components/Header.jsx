"use client"

import { useState } from "react"
import { FaBell, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa"
import "../styles/Header.css"

const Header = ({ setIsAuthenticated }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New order received", time: "5 minutes ago" },
    { id: 2, text: "Product stock low", time: "1 hour ago" },
    { id: 3, text: "New user registered", time: "3 hours ago" },
  ])
  const [showNotifications, setShowNotifications] = useState(false)

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
    if (showNotifications) setShowNotifications(false)
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    if (showDropdown) setShowDropdown(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    setIsAuthenticated(false)
  }

  return (
    <header className="header">
      <div className="header-left">
        <h1>Admin Dashboard</h1>
      </div>
      <div className="header-right">
        <div className="notification-container">
          <button className="notification-btn" onClick={toggleNotifications}>
            <FaBell />
            {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
          </button>
          {showNotifications && (
            <div className="notification-dropdown">
              <h3>Notifications</h3>
              {notifications.length > 0 ? (
                <ul className="notification-list">
                  {notifications.map((notification) => (
                    <li key={notification.id} className="notification-item">
                      <p>{notification.text}</p>
                      <span className="notification-time">{notification.time}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-notifications">No new notifications</p>
              )}
              <button className="clear-all-btn">Clear All</button>
            </div>
          )}
        </div>
        <div className="user-container">
          <button className="user-btn" onClick={toggleDropdown}>
            <FaUser />
            <span className="username">Admin</span>
          </button>
          {showDropdown && (
            <div className="user-dropdown">
              <ul className="dropdown-menu">
                <li className="dropdown-item">
                  <FaUser />
                  <span>Profile</span>
                </li>
                <li className="dropdown-item">
                  <FaCog />
                  <span>Settings</span>
                </li>
                <li className="dropdown-item logout" onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

