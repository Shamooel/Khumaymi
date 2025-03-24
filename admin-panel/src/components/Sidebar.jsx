"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaChartBar, FaBox, FaList, FaUsers, FaShoppingCart, FaLanguage, FaCog } from "react-icons/fa"
import "../styles/Sidebar.css"

const Sidebar = () => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const menuItems = [
    { path: "/", name: "Dashboard", icon: <FaChartBar /> },
    { path: "/products", name: "Products", icon: <FaBox /> },
    { path: "/categories", name: "Categories", icon: <FaList /> },
    { path: "/users", name: "Users", icon: <FaUsers /> },
    { path: "/orders", name: "Orders", icon: <FaShoppingCart /> },
    { path: "/translations", name: "Translations", icon: <FaLanguage /> },
    { path: "/settings", name: "Settings", icon: <FaCog /> },
  ]

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2 className="logo">Khumaymi</h2>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {collapsed ? "→" : "←"}
        </button>
      </div>
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className="icon">{item.icon}</span>
            <span className="text">{item.name}</span>
          </Link>
        ))}
      </div>
      <div className="sidebar-footer">
        <p>Admin Panel v1.0</p>
      </div>
    </div>
  )
}

export default Sidebar

