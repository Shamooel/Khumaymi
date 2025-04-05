"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { useWishlist } from "../contexts/WishlistContext"
import { useLanguage } from "../contexts/LanguageContext"
import { useTheme } from "../contexts/ThemeContext"
import { fetchCategories } from "../services/api"
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  ShoppingCart,
  Globe,
} from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [categories, setCategories] = useState([])
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  const { isAuthenticated, user, logout } = useAuth()
  const { cartItems } = useCart()
  const { wishlistItems } = useWishlist()
  const { language, setLanguage, translate } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const searchRef = useRef(null)
  const categoryMenuRef = useRef(null)
  const userMenuRef = useRef(null)
  const languageMenuRef = useRef(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data)
      } catch (error) {
        console.error("Error loading categories:", error)
      }
    }

    loadCategories()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setShowCategoryMenu(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // Search functionality
    if (searchQuery.trim() !== "") {
      // This would be an API call in a real application
      const fetchSearchResults = async () => {
        try {
          const response = await fetch(`/api/products/search?q=${searchQuery}`)
          const data = await response.json()
          setSearchResults(data)
        } catch (error) {
          console.error("Error searching products:", error)
          setSearchResults([])
        }
      }

      const timeoutId = setTimeout(() => {
        fetchSearchResults()
      }, 300)

      return () => clearTimeout(timeoutId)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById("search-input")?.focus()
      }, 100)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-rose-600 dark:text-rose-400">Khumaymi</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              {translate("nav.home", "Home")}
            </Link>

            <div
              className="relative"
              ref={categoryMenuRef}
              onMouseEnter={() => setShowCategoryMenu(true)}
              onMouseLeave={() => setShowCategoryMenu(false)}
            >
              <button
                className="flex items-center text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              >
                {translate("nav.categories", "Categories")}
                <ChevronDown size={16} className="ml-1" />
              </button>

              <AnimatePresence>
                {showCategoryMenu && (
                  <motion.div
                    className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.slug}`}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-gray-700 hover:text-rose-600 dark:hover:text-rose-400"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/new-arrivals"
              className="text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              {translate("nav.newArrivals", "New Arrivals")}
            </Link>

            <Link
              to="/sale"
              className="text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              {translate("nav.sale", "Sale")}
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg p-4 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={handleSearch} className="relative">
                      <input
                        id="search-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={translate("nav.searchPlaceholder", "Search products...")}
                        className="w-full p-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-2 text-gray-500 dark:text-gray-400"
                        aria-label="Submit search"
                      >
                        <Search size={18} />
                      </button>
                    </form>

                    {searchResults.length > 0 && (
                      <div className="mt-2 max-h-60 overflow-y-auto">
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="flex items-center p-2 hover:bg-rose-50 dark:hover:bg-gray-700 rounded-md"
                            onClick={() => setIsSearchOpen(false)}
                          >
                            <img
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-md mr-2"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{product.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">${product.price}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {searchQuery && searchResults.length === 0 && (
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {translate("nav.noResults", "No results found. Try a different search term.")}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language Selector */}
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="p-2 text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                aria-label="Change language"
              >
                <Globe size={20} />
              </button>

              <AnimatePresence>
                {showLanguageMenu && (
                  <motion.div
                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {["en", "ur", "fr", "ar"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang)
                          setShowLanguageMenu(false)
                        }}
                        className={`block w-full text-left px-4 py-2 ${language === lang ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-gray-700" : "text-gray-700 dark:text-gray-200"} hover:bg-rose-50 dark:hover:bg-gray-700`}
                      >
                        {lang === "en" ? "English" : lang === "ur" ? "اردو" : lang === "fr" ? "Français" : "العربية"}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                aria-label="User menu"
              >
                <User size={20} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-gray-700 hover:text-rose-600 dark:hover:text-rose-400"
                        >
                          {translate("nav.profile", "Profile")}
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-gray-700 hover:text-rose-600 dark:hover:text-rose-400"
                        >
                          {translate("nav.orders", "My Orders")}
                        </Link>
                        <button
                          onClick={() => {
                            logout()
                            setShowUserMenu(false)
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-gray-700 hover:text-rose-600 dark:hover:text-rose-400"
                        >
                          <span className="flex items-center">
                            <LogOut size={16} className="mr-2" />
                            {translate("nav.logout", "Logout")}
                          </span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-gray-700 hover:text-rose-600 dark:hover:text-rose-400"
                        >
                          {translate("nav.login", "Login")}
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-gray-700 hover:text-rose-600 dark:hover:text-rose-400"
                        >
                          {translate("nav.register", "Register")}
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white dark:bg-gray-800 shadow-lg"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col p-4 space-y-4">
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {translate("nav.home", "Home")}
              </Link>

              <div className="space-y-2">
                <button
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                  className="flex items-center justify-between w-full text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                >
                  <span>{translate("nav.categories", "Categories")}</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${showCategoryMenu ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {showCategoryMenu && (
                    <motion.div
                      className="pl-4 space-y-2"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.slug}`}
                          className="block text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/new-arrivals"
                className="text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {translate("nav.newArrivals", "New Arrivals")}
              </Link>

              <Link
                to="/sale"
                className="text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {translate("nav.sale", "Sale")}
              </Link>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center py-2 text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} className="mr-2" />
                      {translate("nav.profile", "Profile")}
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center py-2 text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      {translate("nav.orders", "My Orders")}
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center py-2 text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 w-full"
                    >
                      <LogOut size={18} className="mr-2" />
                      {translate("nav.logout", "Logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center py-2 text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} className="mr-2" />
                      {translate("nav.login", "Login")}
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center py-2 text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} className="mr-2" />
                      {translate("nav.register", "Register")}
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar

