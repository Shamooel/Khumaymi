"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { login as apiLogin, register as apiRegister, logout as apiLogout } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          // Verify token with backend
          const response = await fetch("/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
            setIsAuthenticated(true)
          } else {
            // Token is invalid or expired
            localStorage.removeItem("token")
          }
        }
      } catch (error) {
        console.error("Auth verification error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email, password) => {
    setError(null)
    try {
      const { token, user } = await apiLogin(email, password)
      localStorage.setItem("token", token)
      setUser(user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      setError(error.message || "Login failed")
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    setError(null)
    try {
      const { token, user } = await apiRegister(userData)
      localStorage.setItem("token", token)
      setUser(user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      setError(error.message || "Registration failed")
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

