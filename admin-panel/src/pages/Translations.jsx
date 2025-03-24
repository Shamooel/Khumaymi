"use client"

import { useState, useEffect } from "react"
import "../styles/Translations.css"

const Translations = () => {
  const [translations, setTranslations] = useState({})
  const [languages, setLanguages] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingKey, setEditingKey] = useState(null)
  const [editValue, setEditValue] = useState("")
  const [showAddLanguage, setShowAddLanguage] = useState(false)
  const [newLanguage, setNewLanguage] = useState({ code: "", name: "" })

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "common", name: "Common" },
    { id: "navigation", name: "Navigation" },
    { id: "products", name: "Products" },
    { id: "checkout", name: "Checkout" },
    { id: "account", name: "User Account" },
    { id: "errors", name: "Error Messages" },
  ]

  useEffect(() => {
    fetchLanguages()
  }, [])

  useEffect(() => {
    if (selectedLanguage) {
      fetchTranslations(selectedLanguage)
    }
  }, [selectedLanguage])

  const fetchLanguages = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("http://localhost:5000/api/translations/languages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLanguages(data)

        // Set default selected language to the first one
        if (data.length > 0 && !selectedLanguage) {
          setSelectedLanguage(data[0].code)
        }
      } else {
        console.error("Failed to fetch languages")
      }
    } catch (error) {
      console.error("Error fetching languages:", error)
    }
  }

  const fetchTranslations = async (languageCode) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`http://localhost:5000/api/translations/${languageCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTranslations(data)
      } else {
        console.error("Failed to fetch translations")
      }
    } catch (error) {
      console.error("Error fetching translations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value)
    setEditingKey(null)
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
    setEditingKey(null)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleEditStart = (key, value) => {
    setEditingKey(key)
    setEditValue(value)
  }

  const handleEditCancel = () => {
    setEditingKey(null)
    setEditValue("")
  }

  const handleEditSave = async () => {
    if (!editingKey) return

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`http://localhost:5000/api/translations/${selectedLanguage}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: editingKey,
          value: editValue,
        }),
      })

      if (response.ok) {
        // Update the translation in the local state
        setTranslations({
          ...translations,
          [editingKey]: editValue,
        })

        setEditingKey(null)
        setEditValue("")
      } else {
        console.error("Failed to update translation")
      }
    } catch (error) {
      console.error("Error updating translation:", error)
    }
  }

  const handleAddLanguage = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("http://localhost:5000/api/translations/languages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLanguage),
      })

      if (response.ok) {
        // Refresh languages list
        fetchLanguages()
        setShowAddLanguage(false)
        setNewLanguage({ code: "", name: "" })
      } else {
        console.error("Failed to add language")
      }
    } catch (error) {
      console.error("Error adding language:", error)
    }
  }

  const filteredTranslations = Object.entries(translations).filter(([key, value]) => {
    const matchesCategory = selectedCategory === "all" || key.startsWith(`${selectedCategory}.`)
    const matchesSearch =
      searchTerm === "" ||
      key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      value.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="translations-container">
      <h1>Translation Management</h1>

      <div className="translations-header">
        <div className="language-selector">
          <label htmlFor="language-select">Language:</label>
          <select
            id="language-select"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="language-select"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.code})
              </option>
            ))}
          </select>
          <button className="add-language-button" onClick={() => setShowAddLanguage(true)}>
            Add Language
          </button>
        </div>

        <div className="category-selector">
          <label htmlFor="category-select">Category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-select"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search translations..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading translations...</div>
      ) : (
        <div className="translations-table-container">
          <table className="translations-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Translation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTranslations.map(([key, value]) => (
                <tr key={key}>
                  <td className="key-cell">{key}</td>
                  <td className="value-cell">
                    {editingKey === key ? (
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="edit-textarea"
                      />
                    ) : (
                      value
                    )}
                  </td>
                  <td className="actions-cell">
                    {editingKey === key ? (
                      <>
                        <button onClick={handleEditSave} className="save-button">
                          Save
                        </button>
                        <button onClick={handleEditCancel} className="cancel-button">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleEditStart(key, value)} className="edit-button">
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddLanguage && (
        <div className="add-language-modal">
          <div className="add-language-content">
            <button className="close-button" onClick={() => setShowAddLanguage(false)}>
              ×
            </button>

            <h2>Add New Language</h2>

            <div className="form-group">
              <label htmlFor="language-code">Language Code:</label>
              <input
                type="text"
                id="language-code"
                placeholder="e.g., en, fr, es"
                value={newLanguage.code}
                onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value })}
                className="language-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="language-name">Language Name:</label>
              <input
                type="text"
                id="language-name"
                placeholder="e.g., English, French, Spanish"
                value={newLanguage.name}
                onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                className="language-input"
              />
            </div>

            <div className="form-actions">
              <button onClick={() => setShowAddLanguage(false)} className="cancel-button">
                Cancel
              </button>
              <button
                onClick={handleAddLanguage}
                className="add-button"
                disabled={!newLanguage.code || !newLanguage.name}
              >
                Add Language
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Translations

