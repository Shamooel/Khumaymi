"use client"

import { createContext, useState, useContext, useEffect } from "react"
import translations from "../data/translations"

const LanguageContext = createContext()

export const useLanguage = () => useContext(LanguageContext)

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en")
  const [translationData, setTranslationData] = useState(translations)

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem("language", language)

    // In a real app, you might want to load additional translations from the server
    const loadAdditionalTranslations = async () => {
      try {
        const response = await fetch(`/api/translations/${language}`)
        if (response.ok) {
          const additionalTranslations = await response.json()
          setTranslationData((prevTranslations) => ({
            ...prevTranslations,
            [language]: {
              ...prevTranslations[language],
              ...additionalTranslations,
            },
          }))
        }
      } catch (error) {
        console.error("Error loading translations:", error)
      }
    }

    // Uncomment to enable loading translations from server
    // loadAdditionalTranslations();
  }, [language])

  const translate = (key, fallback = "") => {
    const keys = key.split(".")
    let result = translationData[language]

    for (const k of keys) {
      if (result && result[k]) {
        result = result[k]
      } else {
        return fallback
      }
    }

    return result || fallback
  }

  const value = {
    language,
    setLanguage,
    translate,
    supportedLanguages: ["en", "ur", "fr", "ar"],
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

