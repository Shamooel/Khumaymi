import axios from "axios"

// Create axios instance with environment variables
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (expired token)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("adminToken")
      localStorage.removeItem("adminUser")
      window.location.href = "/admin/login"
    }
    return Promise.reject(error)
  },
)

// Helper functions for common API operations
export const fetchDashboardStats = () => {
  return api.get("/admin/dashboard")
}

export const fetchProducts = (page = 1, limit = process.env.REACT_APP_DEFAULT_PAGE_SIZE) => {
  return api.get(`/admin/products?page=${page}&limit=${limit}`)
}

export const createProduct = (productData) => {
  return api.post("/admin/products", productData)
}

export const updateProduct = (id, productData) => {
  return api.put(`/admin/products/${id}`, productData)
}

export const deleteProduct = (id) => {
  return api.delete(`/admin/products/${id}`)
}

export const fetchCategories = () => {
  return api.get("/admin/categories")
}

export const createCategory = (categoryData) => {
  return api.post("/admin/categories", categoryData)
}

export const updateCategory = (id, categoryData) => {
  return api.put(`/admin/categories/${id}`, categoryData)
}

export const deleteCategory = (id) => {
  return api.delete(`/admin/categories/${id}`)
}

export const fetchOrders = (page = 1, limit = process.env.REACT_APP_DEFAULT_PAGE_SIZE) => {
  return api.get(`/admin/orders?page=${page}&limit=${limit}`)
}

export const updateOrderStatus = (id, status) => {
  return api.put(`/admin/orders/${id}/status`, { status })
}

export const fetchUsers = (page = 1, limit = process.env.REACT_APP_DEFAULT_PAGE_SIZE) => {
  return api.get(`/admin/users?page=${page}&limit=${limit}`)
}

export const adminLogin = (credentials) => {
  return api.post("/admin/auth/login", credentials)
}

export const getImageUrl = (path) => {
  return `${process.env.REACT_APP_UPLOADS_URL}/${path}`
}

export default api

