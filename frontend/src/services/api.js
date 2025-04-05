// API service for making requests to the backend

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Helper function for making API requests
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token")

  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    throw error
  }
}

// Auth API
export const login = async (email, password) => {
  return fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export const register = async (userData) => {
  return fetchAPI("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

export const logout = async () => {
  return fetchAPI("/auth/logout", {
    method: "POST",
  })
}

// Products API
export const fetchProducts = async (params = {}) => {
  const queryParams = new URLSearchParams()

  if (params.category) queryParams.append("category", params.category)
  if (params.limit) queryParams.append("limit", params.limit)
  if (params.page) queryParams.append("page", params.page)
  if (params.sort) queryParams.append("sort", params.sort)

  const queryString = queryParams.toString()
  return fetchAPI(`/products${queryString ? `?${queryString}` : ""}`)
}

export const fetchProductById = async (productId) => {
  return fetchAPI(`/products/${productId}`)
}

export const fetchFeaturedProducts = async () => {
  return fetchAPI("/products?featured=true")
}

export const fetchNewArrivals = async () => {
  return fetchAPI("/products?sort=newest&limit=8")
}

export const fetchRelatedProducts = async (productId, category) => {
  return fetchAPI(`/products?category=${category}&exclude=${productId}&limit=4`)
}

export const searchProducts = async (query) => {
  return fetchAPI(`/products/search?q=${encodeURIComponent(query)}`)
}

// Categories API
export const fetchCategories = async () => {
  return fetchAPI("/categories")
}

// Cart API
export const fetchCart = async () => {
  return fetchAPI("/cart")
}

export const addToCart = async (productId, quantity) => {
  return fetchAPI("/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  })
}

export const removeFromCart = async (cartItemId) => {
  return fetchAPI(`/cart/${cartItemId}`, {
    method: "DELETE",
  })
}

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  return fetchAPI(`/cart/${cartItemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  })
}

export const clearCart = async () => {
  return fetchAPI("/cart", {
    method: "DELETE",
  })
}

// Wishlist API
export const fetchWishlist = async () => {
  return fetchAPI("/wishlist")
}

export const addToWishlist = async (productId) => {
  return fetchAPI("/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId }),
  })
}

export const removeFromWishlist = async (wishlistItemId) => {
  return fetchAPI(`/wishlist/${wishlistItemId}`, {
    method: "DELETE",
  })
}

export const clearWishlist = async () => {
  return fetchAPI("/wishlist", {
    method: "DELETE",
  })
}

// Orders API
export const createOrder = async (orderData) => {
  return fetchAPI("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  })
}

export const fetchOrders = async () => {
  return fetchAPI("/orders")
}

export const fetchOrderById = async (orderId) => {
  return fetchAPI(`/orders/${orderId}`)
}

