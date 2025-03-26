"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./src/pages/Dashboard"
import ManageProducts from "./src/pages/ManageProducts"
import ManageCategories from "./src/pages/ManageCategories"
import ManageUsers from "./src/pages/ManageUsers"
import ManageOrders from "./src/pages/ManageOrders"
import Translations from "./src/pages/Translations"
import Sidebar from "./src/components/Sidebar"
import Header from "./src/components/Header"
import Login from "./src/pages/Login"
import "./App.css"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem("adminToken")
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="loading">Loading...</div>
    if (!isAuthenticated) return <Navigate to="/login" />
    return children
  }

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Sidebar />}
        <div className="main-content">
          {isAuthenticated && <Header setIsAuthenticated={setIsAuthenticated} />}
          <Routes>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ManageProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <ManageCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <ManageOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/translations"
              element={
                <ProtectedRoute>
                  <Translations />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App

