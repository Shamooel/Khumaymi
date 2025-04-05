// Translations for the application
// This is a simplified version. In a real app, you might want to use a library like i18next

const translations = {
    en: {
      // Common
      common: {
        loading: "Loading...",
        error: "An error occurred",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        view: "View",
        search: "Search",
        filter: "Filter",
        sort: "Sort",
        all: "All",
        yes: "Yes",
        no: "No",
        back: "Back",
        next: "Next",
        previous: "Previous",
        submit: "Submit",
        confirm: "Confirm",
      },
  
      // Navigation
      nav: {
        home: "Home",
        shop: "Shop",
        categories: "Categories",
        newArrivals: "New Arrivals",
        sale: "Sale",
        login: "Login",
        register: "Register",
        profile: "Profile",
        orders: "My Orders",
        wishlist: "Wishlist",
        cart: "Cart",
        logout: "Logout",
        searchPlaceholder: "Search products...",
        noResults: "No results found. Try a different search term.",
      },
  
      // Welcome Page
      welcome: {
        tagline: "Elegant Pakistani Fashion for the Modern Woman",
        getStarted: "Get Started",
        autoRedirect: "You will be automatically redirected in a few seconds...",
      },
  
      // Home Page
      home: {
        shopByCategory: "Shop By Category",
        newArrivals: "New Arrivals",
        viewAll: "View All",
        specialOffer: "Special Eid Collection",
        specialOfferDesc: "Discover our exclusive Eid collection with up to 30% off. Limited time offer.",
        shopNow: "Shop Now",
      },
  
      // Featured Products
      featured: {
        newCollection: "New Collection",
        shopNow: "Shop Now",
      },
  
      // Product Page
      product: {
        reviews: "reviews",
        inStock: "In Stock",
        outOfStock: "Out of Stock",
        off: "OFF",
        color: "Color",
        size: "Size",
        sizeGuide: "Size Guide",
        quantity: "Quantity",
        addToCart: "Add to Cart",
        addToWishlist: "Add to Wishlist",
        inWishlist: "In Wishlist",
        freeDelivery: "Free Delivery",
        deliveryNote: "Free delivery for orders over $100",
        warranty: "1 Year Warranty",
        warrantyNote: "Covered under our standard warranty",
        returns: "Easy Returns",
        returnsNote: "30 day return policy",
        relatedProducts: "You May Also Like",
        selectSize: "Please select a size",
        selectColor: "Please select a color",
        notFound: "Product not found",
      },
  
      // Cart Page
      cart: {
        title: "Shopping Cart",
        empty: "Your cart is empty",
        emptyMessage: "Looks like you haven't added anything to your cart yet.",
        continueShopping: "Continue Shopping",
        product: "Product",
        price: "Price",
        quantity: "Quantity",
        total: "Total",
        size: "Size",
        color: "Color",
        remove: "Remove",
        clearCart: "Clear Cart",
        orderSummary: "Order Summary",
        subtotal: "Subtotal",
        shipping: "Shipping",
        freeShipping: "Free",
        tax: "Tax (5%)",
        proceedToCheckout: "Proceed to Checkout",
        secureCheckout: "Secure checkout powered by Stripe",
        confirmClear: "Are you sure you want to clear your cart?",
      },
  
      // Wishlist Page
      wishlist: {
        title: "My Wishlist",
        empty: "Your wishlist is empty",
        emptyMessage: "Looks like you haven't added anything to your wishlist yet.",
        continueShopping: "Continue Shopping",
        product: "Product",
        price: "Price",
        stock: "Stock Status",
        actions: "Actions",
        inStock: "In Stock",
        outOfStock: "Out of Stock",
        addToCart: "Add to Cart",
        remove: "Remove",
        clearWishlist: "Clear Wishlist",
        confirmClear: "Are you sure you want to clear your wishlist?",
      },
  
      // Login Page
      login: {
        welcome: "Welcome Back",
        signInToContinue: "Sign in to continue shopping",
        email: "Email Address",
        password: "Password",
        rememberMe: "Remember me",
        forgotPassword: "Forgot your password?",
        signIn: "Sign In",
        noAccount: "Don't have an account?",
        signUp: "Sign up",
        allFieldsRequired: "Please fill in all fields",
        invalidCredentials: "Invalid email or password",
        serverError: "An error occurred. Please try again.",
      },
  
      // Register Page
      register: {
        createAccount: "Create Account",
        joinUs: "Join us and start shopping",
        fullName: "Full Name",
        email: "Email Address",
        password: "Password",
        confirmPassword: "Confirm Password",
        passwordRequirements: "Password must be at least 8 characters long",
        agreeToTerms: "I agree to the",
        termsAndConditions: "Terms and Conditions",
        signIn: "Sign in",
        alreadyHaveAccount: "Already have an account?",
        allFieldsRequired: "Please fill in all fields",
        passwordsDoNotMatch: "Passwords do not match",
        passwordTooShort: "Password must be at least 8 characters long",
        agreeTerms: "Please agree to the terms and conditions",
        registrationFailed: "Registration failed",
        serverError: "An error occurred. Please try again.",
      },
    },
  
    // Urdu translations (simplified)
    ur: {
      nav: {
        home: "ہوم",
        shop: "شاپ",
        categories: "زمرہ جات",
        newArrivals: "نئی آمد",
        sale: "سیل",
        login: "لاگ ان",
        register: "رجسٹر",
        profile: "پروفائل",
        orders: "میرے آرڈرز",
        wishlist: "مطلوبہ",
        cart: "کارٹ",
        logout: "لاگ آؤٹ",
      },
      welcome: {
        tagline: "جدید خواتین کے لیے پاکستانی فیشن",
        getStarted: "شروع کریں",
      },
      home: {
        shopByCategory: "زمرہ کے مطابق خریداری کریں",
        newArrivals: "نئی آمد",
        viewAll: "سب دیکھیں",
        shopNow: "ابھی خریدیں",
      },
    },
  
    // French translations (simplified)
    fr: {
      nav: {
        home: "Accueil",
        shop: "Boutique",
        categories: "Catégories",
        newArrivals: "Nouveautés",
        sale: "Soldes",
        login: "Connexion",
        register: "S'inscrire",
        profile: "Profil",
        orders: "Mes Commandes",
        wishlist: "Liste de Souhaits",
        cart: "Panier",
        logout: "Déconnexion",
      },
      welcome: {
        tagline: "Mode Pakistanaise Élégante pour la Femme Moderne",
        getStarted: "Commencer",
      },
      home: {
        shopByCategory: "Acheter par Catégorie",
        newArrivals: "Nouveautés",
        viewAll: "Voir Tout",
        shopNow: "Acheter Maintenant",
      },
    },
  
    // Arabic translations (simplified)
    ar: {
      nav: {
        home: "الرئيسية",
        shop: "المتجر",
        categories: "الفئات",
        newArrivals: "وصل حديثاً",
        sale: "تخفيضات",
        login: "تسجيل الدخول",
        register: "التسجيل",
        profile: "الملف الشخصي",
        orders: "طلباتي",
        wishlist: "المفضلة",
        cart: "سلة التسوق",
        logout: "تسجيل الخروج",
      },
      welcome: {
        tagline: "أزياء باكستانية أنيقة للمرأة العصرية",
        getStarted: "ابدأ الآن",
      },
      home: {
        shopByCategory: "تسوق حسب الفئة",
        newArrivals: "وصل حديثاً",
        viewAll: "عرض الكل",
        shopNow: "تسوق الآن",
      },
    },
  }
  
  export default translations
  
  