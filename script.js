
/* ========================================
   1. PRODUCT DATA
======================================== */

// Each product has an ID, name, category, price, image and description.

const products = [
    {
        id: 1,
        name: "Classic Beige Shirt",
        category: "Clothing",
        price: 2499,
        description: "A timeless everyday style.",
        badge: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Elegant Summer Dress",
        category: "Clothing",
        price: 3499,
        description: "Lightweight and comfortable.",
        badge: "POPULAR",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Minimal White Sneakers",
        category: "Shoes",
        price: 4299,
        description: "A clean look for every day.",
        badge: "NEW",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Everyday Shoulder Bag",
        category: "Accessories",
        price: 2799,
        description: "A simple and versatile bag.",
        badge: "",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Soft Knit Sweater",
        category: "Clothing",
        price: 3199,
        description: "A cozy wardrobe essential.",
        badge: "NEW",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Casual Everyday Shoes",
        category: "Shoes",
        price: 3899,
        description: "Comfort meets modern style.",
        badge: "",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Classic Sunglasses",
        category: "Accessories",
        price: 1499,
        description: "A finishing touch to your look.",
        badge: "TRENDING",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Premium Casual Shirt",
        category: "Clothing",
        price: 2199,
        description: "Easy styling for everyday wear.",
        badge: "",
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80"
    }
];


/* ========================================
   2. FIND HTML ELEMENTS
======================================== */

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const priceFilter = document.getElementById("price-filter");
const priceValue = document.getElementById("price-value");
const resetButton = document.getElementById("reset-filters");
const resultsCount = document.getElementById("results-count");
const emptyMessage = document.getElementById("empty-message");
const cartCount = document.getElementById("cart-count");


/* ========================================
   3. FORMAT PRICES IN PAKISTANI RUPEES
======================================== */

function formatPrice(price) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0
    }).format(price);
}


/* ========================================
   4. LOAD CART FROM LOCAL STORAGE
======================================== */

// localStorage keeps the cart data in this browser,
// even after the page is refreshed.

function loadCart() {
    try {
        const savedCart = localStorage.getItem("styleNestCart");
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];

        if (!Array.isArray(parsedCart)) {
            return [];
        }

        // Keep only valid products and positive quantities.
        return parsedCart.filter(item => {
            return (
                Number.isInteger(item.id) &&
                products.some(product => product.id === item.id) &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0
            );
        });
    } catch (error) {
        console.error("Could not load the saved cart:", error);
        return [];
    }
}

let cart = loadCart();


/* ========================================
   5. SAVE CART AND UPDATE CART COUNT
======================================== */

function saveCart() {
    try {
        localStorage.setItem("styleNestCart", JSON.stringify(cart));
        updateCartCount();
        return true;
    } catch (error) {
        console.error("Could not save the cart:", error);
        alert("Your browser could not save the cart. Please check your browser settings.");
        return false;
    }
}

function updateCartCount() {
    // Count total units, including repeated quantities.
    const totalItems = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}


/* ========================================
   6. DISPLAY PRODUCT CARDS
======================================== */

function displayProducts(productList) {
    productGrid.innerHTML = "";

    resultsCount.textContent =
        `${productList.length} product${productList.length === 1 ? "" : "s"} found`;

    emptyMessage.hidden = productList.length !== 0;

    productList.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const imageWrapper = document.createElement("div");
        imageWrapper.className = "product-image-wrapper";

        const image = document.createElement("img");
        image.className = "product-image";
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        // Display a fallback if a product image fails to load.
        image.addEventListener("error", () => {
            image.alt = `${product.name} image unavailable`;
            image.style.display = "none";
            imageWrapper.style.background = "#e8e1d8";
        }, { once: true });

        imageWrapper.appendChild(image);

        if (product.badge) {
            const badge = document.createElement("span");
            badge.className = "product-badge";
            badge.textContent = product.badge;
            imageWrapper.appendChild(badge);
        }

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.className = "product-name";
        name.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = formatPrice(product.price);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "add-to-cart-button";
        button.textContent = "Add to Cart";
        button.setAttribute(
            "aria-label",
            `Add ${product.name} to cart`
        );

        button.addEventListener("click", () => {
            addToCart(product.id);
        });

        info.append(
            category,
            name,
            description,
            price,
            button
        );

        card.append(imageWrapper, info);
        productGrid.appendChild(card);
    });
}


/* ========================================
   7. SEARCH, CATEGORY AND PRICE FILTERS
======================================== */

function filterProducts() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const maximumPrice = Number(priceFilter.value);

    // Update the number shown beside the price slider.
    priceValue.textContent = maximumPrice.toLocaleString("en-PK");

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        const matchesPrice = product.price <= maximumPrice;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    displayProducts(filteredProducts);
}


/* ========================================
   8. ADD PRODUCTS TO THE CART
======================================== */

function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // If already in the cart, increase its quantity.
        existingItem.quantity += 1;
    } else {
        // Otherwise, create a new cart entry.
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    const saved = saveCart();

    if (saved) {
        alert("Product added to your cart!");
    }
}


/* ========================================
   9. RESET ALL FILTERS
======================================== */

function resetFilters() {
    searchInput.value = "";
    categoryFilter.value = "all";
    priceFilter.value = "10000";

    filterProducts();
}


/* ========================================
   10. CONNECT EVENTS TO THE CONTROLS
======================================== */

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
priceFilter.addEventListener("input", filterProducts);
resetButton.addEventListener("click", resetFilters);


/* ========================================
   11. START THE WEBSITE
======================================== */

// Show products and the current saved cart count
// when the page first opens.

filterProducts();
updateCartCount();
