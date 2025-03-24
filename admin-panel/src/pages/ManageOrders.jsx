"use client"

import { useState, useEffect } from "react"
import "../styles/ManageOrders.css"

const ManageOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        console.error("Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status.toLowerCase() === filterStatus
    const matchesSearch =
      searchTerm === "" ||
      order._id.includes(searchTerm) ||
      (order.user && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesStatus && matchesSearch
  })

  const handleViewOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const orderData = await response.json()
        setSelectedOrder(orderData)
        setShowOrderDetails(true)
      } else {
        console.error("Failed to fetch order details")
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
    }
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update the order in the local state
        setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)))

        // If we're viewing this order's details, update that too
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
      } else {
        console.error("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const closeOrderDetails = () => {
    setShowOrderDetails(false)
    setSelectedOrder(null)
  }

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    return allStatuses.filter((status) => status !== currentStatus.toLowerCase())
  }

  return (
    <div className="manage-orders-container">
      <h1>Manage Orders</h1>

      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="status-filter">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select id="status-filter" value={filterStatus} onChange={handleFilterChange} className="status-select">
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{order.user ? order.user.name : "Unknown"}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => handleViewOrder(order._id)} className="view-button">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showOrderDetails && selectedOrder && (
        <div className="order-details-modal">
          <div className="order-details-content">
            <button className="close-button" onClick={closeOrderDetails}>
              ×
            </button>

            <h2>Order Details</h2>
            <div className="order-id">Order #{selectedOrder._id.slice(-6)}</div>

            <div className="order-info">
              <div className="order-info-group">
                <h3>Order Information</h3>
                <div className="info-row">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span className={`status-badge ${selectedOrder.status.toLowerCase()}`}>{selectedOrder.status}</span>
                </div>
                <div className="info-row">
                  <span className="label">Total Amount:</span>
                  <span className="value">${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Payment Method:</span>
                  <span className="value">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="info-row">
                  <span className="label">Payment Status:</span>
                  <span className={`status-badge ${selectedOrder.paymentStatus.toLowerCase()}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="order-info-group">
                <h3>Customer Information</h3>
                <div className="info-row">
                  <span className="label">Name:</span>
                  <span className="value">{selectedOrder.user.name}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{selectedOrder.user.email}</span>
                </div>
              </div>

              <div className="order-info-group">
                <h3>Shipping Address</h3>
                <div className="address">
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                    {selectedOrder.shippingAddress.zipCode}
                  </p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            <div className="order-items">
              <h3>Order Items</h3>
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item._id}>
                      <td className="product-cell">
                        <div className="product-info">
                          <img
                            src={item.product.imageUrl || "/placeholder.svg"}
                            alt={item.product.name}
                            className="product-thumbnail"
                          />
                          <span>{item.product.name}</span>
                        </div>
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-right">
                      Subtotal:
                    </td>
                    <td>${selectedOrder.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-right">
                      Shipping:
                    </td>
                    <td>${selectedOrder.shippingCost.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-right">
                      Tax:
                    </td>
                    <td>${selectedOrder.tax.toFixed(2)}</td>
                  </tr>
                  <tr className="total-row">
                    <td colSpan="3" className="text-right">
                      Total:
                    </td>
                    <td>${selectedOrder.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="order-actions">
              <div className="status-update">
                <label htmlFor="status-update">Update Status:</label>
                <select
                  id="status-update"
                  className="status-select"
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleUpdateStatus(selectedOrder._id, e.target.value)
                      e.target.value = ""
                    }
                  }}
                >
                  <option value="" disabled>
                    Select new status
                  </option>
                  {getStatusOptions(selectedOrder.status).map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <button className="print-button">Print Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageOrders

