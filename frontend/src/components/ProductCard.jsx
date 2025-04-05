"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, Eye } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import { useWishlist } from "../contexts/WishlistContext"
import { useLanguage } from "../contexts/LanguageContext"

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { translate } = useLanguage()

  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = `/login?redirect=/product/${product.id}`
      return
    }

    addToCart(product, 1)
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = `/login?redirect=/product/${product.id}`
      return
    }

    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <motion.div
      className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex gap-2">
              <motion.button
                className="p-2 bg-white dark:bg-gray-800 rounded-full text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-colors"
                onClick={handleToggleWishlist}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? "fill-rose-600 dark:fill-rose-400" : ""}`} />
              </motion.button>

              <motion.button
                className="p-2 bg-white dark:bg-gray-800 rounded-full text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-colors"
                onClick={handleAddToCart}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingBag className="h-5 w-5" />
              </motion.button>

              <Link
                to={`/product/${product.id}`}
                className="p-2 bg-white dark:bg-gray-800 rounded-full text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-colors"
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Eye className="h-5 w-5" />
                </motion.div>
              </Link>
            </div>
          </div>

          {/* Discount badge if applicable */}
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discount}%
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">{product.category}</h3>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">{product.name}</h2>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {product.discount > 0 ? (
                <>
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-800 dark:text-white">${product.price.toFixed(2)}</span>
              )}
            </div>

            {/* Rating stars */}
            {product.rating && (
              <div className="flex items-center">
                <span className="text-amber-500">★</span>
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{product.rating}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard

