
/* ========================================
   1. PRODUCT DATA
======================================== */

// Product IDs and prices must match script.js.

const cartProducts = [
    { id: 1, name: "Classic Beige Shirt", category: "Clothing", price: 2499, image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=600&q=80" },
    { id: 2, name: "Elegant Summer Dress", category: "Clothing", price: 3499, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80" },
    { id: 3, name: "Minimal White Sneakers", category: "Shoes", price: 4299, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" },
    { id: 4, name: "Everyday Shoulder Bag", category: "Accessories", price: 2799, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80" },
    { id: 5, name: "Soft Knit Sweater", category: "Clothing", price: 3199, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80" },
    { id: 6, name: "Casual Everyday Shoes", category: "Shoes", price: 3899, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80" },
    { id: 7, name: "Classic Sunglasses", category: "Accessories", price: 1499, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80" },
    { id: 8, name: "Premium Casual Shirt", category: "Clothing", price: 2199, image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80" }
];


/* ========================================
   2. FIND HTML ELEMENTS
======================================== */

const cartItemsContainer = document.getElementById("cart-items");
const emptyCartMessage = document.getElementById("cart-empty");
const itemCountLabel = document.getElementById("cart-items-count");
const subtotalLabel = document.getElementById("cart-subtotal");
const shippingLabel = document.getElementById("cart-shipping");
const totalLabel = document.getElementById("cart-total");
const cartBadge = document.getElementById("cart-count");
const checkoutButton = document.getElementById("checkout-button");
const shippingNote = document.getElementById("shipping-note");


/* ========================================
   3. FORMAT PRICES
======================================== */

function formatCartPrice(price) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0
    }).format(price);
}


/* ========================================
   4. LOAD SAVED CART
======================================== */

function getSavedCart() {
    try {
        const stored = localStorage.getItem("styleNestCart");
        const parsed = stored ? JSON.parse(stored) : [];

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(item =>
            Number.isInteger(item.id) &&
            cartProducts.some(product => product.id === item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );
    } catch (error) {
        console.error("Unable to read cart data:", error);
        return [];
    }
}

let shoppingCart = getSavedCart();


/* ========================================
   5. SAVE CART AND COUNT ITEMS
======================================== */

function saveShoppingCart() {
    try {
        localStorage.setItem(
            "styleNestCart",
            JSON.stringify(shoppingCart)
        );
        return true;
    } catch (error) {
        console.error("Unable to save cart:", error);
        alert("Could not save your cart. Please check your browser settings.");
        return false;
    }
}

function updateCartBadge() {
    const count = shoppingCart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    if (cartBadge) {
        cartBadge.textContent = count;
    }
}


/* ========================================
   6. CHANGE A PRODUCT QUANTITY
======================================== */

function changeQuantity(productId, change) {
    const item = shoppingCart.find(entry => entry.id === productId);

    if (!item) return;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
        // Prevent zero or negative quantities.
        return;
    }

    item.quantity = newQuantity;

    if (saveShoppingCart()) {
        renderCart();
    }
}


/* ========================================
   7. REMOVE A PRODUCT
======================================== */

function removeCartItem(productId) {
    shoppingCart = shoppingCart.filter(
        item => item.id !== productId
    );

    if (saveShoppingCart()) {
        renderCart();
    }
}


/* ========================================
   8. DISPLAY CART ITEMS
======================================== */

function renderCart() {
    cartItemsContainer.innerHTML = "";

    let subtotal = 0;
    let totalUnits = 0;

    shoppingCart.forEach(item => {
        const product = cartProducts.find(
            entry => entry.id === item.id
        );

        if (!product) return;

        subtotal += product.price * item.quantity;
        totalUnits += item.quantity;

        const row = document.createElement("article");
        row.className = "cart-item";

        const image = document.createElement("img");
        image.className = "cart-item-image";
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        image.addEventListener("error", () => {
            image.alt = `${product.name} image unavailable`;
            image.style.visibility = "hidden";
        }, { once: true });

        const details = document.createElement("div");
        details.className = "cart-item-details";

        const category = document.createElement("p");
        category.className = "cart-item-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.className = "cart-item-name";
        name.textContent = product.name;

        const price = document.createElement("p");
        price.className = "cart-item-price";
        price.textContent = formatCartPrice(product.price);

        const quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls";

        const decreaseButton = document.createElement("button");
        decreaseButton.type = "button";
        decreaseButton.className = "quantity-button";
        decreaseButton.textContent = "−";
        decreaseButton.setAttribute(
            "aria-label",
            `Decrease quantity of ${product.name}`
        );
        decreaseButton.disabled = item.quantity <= 1;

        decreaseButton.addEventListener("click", () => {
            changeQuantity(product.id, -1);
        });

        const quantity = document.createElement("span");
        quantity.className = "quantity-value";
        quantity.textContent = item.quantity;
        quantity.setAttribute("aria-label", "Quantity");

        const increaseButton = document.createElement("button");
        increaseButton.type = "button";
        increaseButton.className = "quantity-button";
        increaseButton.textContent = "+";
        increaseButton.setAttribute(
            "aria-label",
            `Increase quantity of ${product.name}`
        );

        increaseButton.addEventListener("click", () => {
            changeQuantity(product.id, 1);
        });

        quantityControls.append(
            decreaseButton,
            quantity,
            increaseButton
        );

        details.append(category, name, price, quantityControls);

        const actions = document.createElement("div");
        actions.className = "cart-item-actions";

        const lineTotal = document.createElement("p");
        lineTotal.className = "cart-line-total";
        lineTotal.textContent = formatCartPrice(
            product.price * item.quantity
        );

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-button";
        removeButton.textContent = "Remove";
        removeButton.setAttribute(
            "aria-label",
            `Remove ${product.name} from cart`
        );

        removeButton.addEventListener("click", () => {
            removeCartItem(product.id);
        });

        actions.append(lineTotal, removeButton);
        row.append(image, details, actions);
        cartItemsContainer.appendChild(row);
    });

    // Free shipping on orders of Rs. 5,000 or more.
    const shipping = subtotal === 0 || subtotal >= 5000 ? 0 : 250;
    const total = subtotal + shipping;

    subtotalLabel.textContent = formatCartPrice(subtotal);
    shippingLabel.textContent =
        shipping === 0 && subtotal > 0
            ? "FREE"
            : formatCartPrice(shipping);
    totalLabel.textContent = formatCartPrice(total);

    itemCountLabel.textContent =
        `${totalUnits} item${totalUnits === 1 ? "" : "s"}`;

    updateCartBadge();

    emptyCartMessage.hidden = totalUnits !== 0;
    cartItemsContainer.hidden = totalUnits === 0;

    checkoutButton.disabled = totalUnits === 0;

    if (subtotal === 0) {
        shippingNote.textContent = "Add products to calculate shipping.";
    } else if (subtotal >= 5000) {
        shippingNote.textContent = "You qualify for free shipping!";
    } else {
        shippingNote.textContent =
            `Add ${formatCartPrice(5000 - subtotal)} more for free shipping.`;
    }
}


/* ========================================
   9. DEMO CHECKOUT
======================================== */

checkoutButton.addEventListener("click", () => {
    if (shoppingCart.length === 0) return;

    alert(
        "Thank you for trying StyleNest! " +
        "This is a frontend demo, so real checkout and payment are not available."
    );
});


/* ========================================
   10. START CART PAGE
======================================== */

renderCart();
