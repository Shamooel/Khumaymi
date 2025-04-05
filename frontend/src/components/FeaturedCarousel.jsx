"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useLanguage } from "../contexts/LanguageContext"

const FeaturedCarousel = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(null)
  const { translate } = useLanguage()

  // Auto-advance the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [products.length])

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length)
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
  }

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  if (!products || products.length === 0) {
    return null
  }

  const currentProduct = products[currentIndex]

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-xl">
      {/* Carousel Navigation */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 z-10 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 z-10 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-rose-600 dark:bg-rose-400" : "bg-gray-300 dark:bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Carousel Content */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          <div className="relative h-full w-full bg-gradient-to-r from-rose-100 to-pink-100 dark:from-gray-900 dark:to-gray-800">
            <div className="absolute inset-0 flex flex-col md:flex-row">
              {/* Text Content */}
              <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <h2 className="text-sm md:text-base text-rose-600 dark:text-rose-400 font-semibold mb-2">
                    {translate("featured.newCollection", "New Collection")}
                  </h2>
                  <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                    {currentProduct.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">{currentProduct.description}</p>
                  <Link
                    to={`/product/${currentProduct.id}`}
                    className="inline-block px-8 py-3 bg-rose-600 text-white rounded-full text-lg font-semibold hover:bg-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {translate("featured.shopNow", "Shop Now")}
                  </Link>
                </motion.div>
              </div>

              {/* Image */}
              <div className="w-full md:w-1/2 relative">
                <motion.img
                  src={currentProduct.image_url || "/placeholder.svg"}
                  alt={currentProduct.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default FeaturedCarousel

