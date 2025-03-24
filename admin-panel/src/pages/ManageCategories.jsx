"use client"

import { useState, useEffect } from "react"
import "../styles/ManageCategories.css"

const ManageCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  })
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("http://localhost:5000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        console.error("Failed to fetch categories")
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("adminToken")
      const formDataToSend = new FormData()

      for (const key in formData) {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key])
        }
      }

      const url = editingId
        ? `http://localhost:5000/api/categories/${editingId}`
        : "http://localhost:5000/api/categories"

      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (response.ok) {
        resetForm()
        fetchCategories()
      } else {
        console.error("Failed to save category")
      }
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      image: null,
    })
    setEditingId(category._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This will also affect all products in this category.",
      )
    ) {
      try {
        const token = localStorage.getItem("adminToken")
        const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          fetchCategories()
        } else {
          console.error("Failed to delete category")
        }
      } catch (error) {
        console.error("Error deleting category:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: null,
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="manage-categories-container">
      <h1>Manage Categories</h1>

      <div className="actions">
        <button className="add-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New Category"}
        </button>
      </div>

      {showForm && (
        <div className="category-form-container">
          <h2>{editingId ? "Edit Category" : "Add New Category"}</h2>
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
              <label htmlFor="name">Category Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label htmlFor="image">Category Image</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                required={!editingId}
              />
              {editingId && <p className="note">Leave empty to keep current image</p>}
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="submit-button">
                {editingId ? "Update Category" : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading categories...</div>
      ) : (
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category._id} className="category-card">
              <div className="category-image">
                <img src={category.imageUrl || "/placeholder.svg"} alt={category.name} />
              </div>
              <div className="category-details">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <div className="product-count">{category.productCount} products</div>
              </div>
              <div className="category-actions">
                <button onClick={() => handleEdit(category)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleDelete(category._id)} className="delete-button">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageCategories

