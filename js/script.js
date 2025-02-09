
import { fetchUser } from "./fetchUser.js";
//----------------------------------------------------- API ----------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded successfully");
    updateMokepointDisplay();

    // 1st API
    // const apiUrl = 'https://fedassignment2-eef5.restdb.io/rest/products';
    // const apikey = '678b1d1a19b96a08c0af6336';

    // 2nd API
    const apiUrl = 'https://fedassg-78fe.restdb.io/rest/products';
    const apikey = '67a6f93e76011910f95afd4b';

    // 3rd API 
    // const apiUrl = 'https://fedassg2-cd74.restdb.io/rest/products';
    // const apikey = '67a76d364d8744a119828030';  

    // Check if user account information exists in sessionStorage
    let userAccount = JSON.parse(sessionStorage.getItem("userProfile")); // Check for user profile

    if (!userAccount) {
        console.log("No user account in sessionStorage");

    } else {
        console.log("User account found:", userAccount);
    }

    // Check if products are already stored in sessionStorage
    let products = JSON.parse(sessionStorage.getItem("products"));

    if (!products) {
        // Fetch products if not in sessionStorage
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-apikey': apikey,
                'Content-Type': 'application/json',
                "Cache-Control": "no-cache"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to load products from API");
                }
                return response.json();
            })
            .then(fetchedProducts => {
                console.log("Products loaded:", fetchedProducts);
                products = fetchedProducts;

                // Store products in sessionStorage for future use
                sessionStorage.setItem("products", JSON.stringify(products));

                updateCartNotification();
                handlePageContent(products); // Use the function to handle page content
            })
            .catch(error => {
                console.error("Error loading products:", error);
            });

    } else {
        // Use cached products from sessionStorage
        console.log("Using cached products");
        updateCartNotification();
        handlePageContent(products); // Use the function to handle page content
    }
});

// Function to handle page content
function handlePageContent(products) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    let category = urlParams.get("category") || "Products";
    let subcategory = urlParams.get("subcategory") || "all";

    // Force category to "bestsellers" for the homepage (index.html)
    if (window.location.pathname.includes("index.html")) {
        category = "bestsellers";
    }

    // Load cart data only if we're on the cart page
    const cartContainer = document.getElementById("cart-items-container");
    if (cartContainer) {
        renderCartItems();
    }

    // Load checkout summary only if we're on the checkout page
    const checkoutContainer = document.getElementById("checkout-items");
    if (checkoutContainer) {
        renderCheckout();
    }

    if (productId) {
        console.log("Product ID found, displaying product details");
        const product = products.find(p => p.id === productId);
        if (product) {
            displayProductDetails(productId, products);
        } else {
            console.error("Product not found");
        }
    } else {
        console.log("Displaying product gallery");
        displayProductGallery(category, subcategory, products);
    }
}

// ----------------------------------------------------- Product Details ----------------------------------------------------
function displayProductDetails(productId, products) {
    const product = products.find(p => p.id == productId);
    if (!product) {
        console.error("Product not found.");
        return;
    }

    // Display product name, price, and description
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-price").textContent = `S$${product.price.toFixed(2)}`;
    document.getElementById("product-desc").textContent = product.description;

    const carouselInner = document.querySelector(".carousel-inner");
    const carouselIndicators = document.querySelector(".carousel-indicators");
    const images = [product.image1, product.image2, product.image3];

    // Clear existing carousel items and indicators
    carouselInner.innerHTML = "";
    carouselIndicators.innerHTML = "";

    // Loop through images to create carousel items and indicators
    images.forEach((image, index) => {
        const indicator = document.createElement("button");
        indicator.setAttribute("type", "button");
        indicator.setAttribute("data-bs-target", "#carouselExampleIndicators");
        indicator.setAttribute("data-bs-slide-to", index);
        indicator.setAttribute("aria-label", `Slide ${index + 1}`);
        if (index === 0) indicator.classList.add("active"); // Make the first indicator active

        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");
        if (index === 0) carouselItem.classList.add("active");

        const img = document.createElement("img");
        img.src = image;
        img.classList.add("d-block", "mx-auto");
        img.alt = product.name;

        carouselItem.appendChild(img);
        carouselInner.appendChild(carouselItem);
        carouselIndicators.appendChild(indicator);
    });

    // Display category and subcategory
    const categories = product.category.split(",").map(sub => sub.trim());
    const filteredCategories = categories.filter(sub => sub.toLowerCase() !== "bestsellers");
    const categoryText = filteredCategories
        .map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))
        .join(", ");
    const subcategories = product.subcategory.split(",").map(sub => sub.trim());
    const filteredSubcategories = subcategories.filter(sub => sub.toLowerCase() !== "all");
    const subcategoryText = filteredSubcategories
        .map(sub => sub.charAt(0).toUpperCase() + sub.slice(1))
        .join(", ");

    const displayText = [categoryText, subcategoryText].filter(Boolean).join(", ");
    if (displayText) {
        document.getElementById("product-cat").textContent = displayText;
    }

    // Handle size selection and stock level
    const sizeSelect = document.getElementById("product-size");
    const sizes = product.size.split(", "); // ["S", "M", "L"]
    const stocks = product.stock.split(", "); // ["5", "10", "0"]

    // Reset size options and add new ones based on product sizes
    sizeSelect.innerHTML = "<option selected>Choose Size</option>";
    sizes.forEach((size, index) => {
        const option = document.createElement("option");
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });

    // Handle stock levels for selected size
    sizeSelect.addEventListener("change", function () {
        const selectedSize = sizeSelect.value;
        const sizeIndex = sizes.indexOf(selectedSize);

        if (sizeIndex !== -1) {
            const stock = parseInt(stocks[sizeIndex], 10); // Convert stock to number
            if (stock === 0) {
                // Show the sold-out alert if the size is out of stock
                document.getElementById("size-alert").style.display = "block";
            } else {
                // Hide the alert if the size is available
                document.getElementById("size-alert").style.display = "none";
            }
        }
    });


    // Initialize quantity control (assuming `handleQuantityControls` is a function you have elsewhere)
    const quantityDisplay = document.querySelector(".quantity-display");
    const decrementButton = document.querySelector(".decrement");
    const incrementButton = document.querySelector(".increment");
    handleQuantityControls(quantityDisplay, decrementButton, incrementButton);

    // Handle adding product to cart
    document.getElementById("add-to-cart").addEventListener("click", function () {
        const selectedSize = sizeSelect.value;
        const sizeIndex = sizes.indexOf(selectedSize);

        // Check if no size is selected
        if (selectedSize === "Choose Size" || selectedSize === "") {
            const alert = document.getElementById("size-alert");
            alert.style.display = "block"; // Show the alert
            alert.classList.add("show");

            // Hide the alert after 3 seconds
            setTimeout(function () {
                alert.classList.remove("show");
                alert.style.display = "none";
            }, 3000);
        }
        // Check if the selected size is sold out
        else if (parseInt(stocks[sizeIndex], 10) === 0) {
            const soldOutAlert = document.getElementById("sold-out-alert");
            soldOutAlert.style.display = "block"; // Show sold-out alert
            soldOutAlert.classList.add("show");
            console.log("Product is sold out.");
            // Hide the alert after 3 seconds
            setTimeout(function () {
                soldOutAlert.classList.remove("show");
                soldOutAlert.style.display = "none";
            }, 3000);
        }
        // Proceed with adding to the cart
        else {
            addToCart(product);
        }
    });
}

// ----------------------------------------------------- Product Gallery ----------------------------------------------------
function displayProductGallery(category, subcategory, products) {
    // Filter products by exact category match
    let filteredProducts = products.filter(product => {
        const categories = product.category.split(",").map(cat => cat.trim().toLowerCase());
        return categories.includes(category.toLowerCase());
    });

    // If subcategory isn't "all", filter further based on exact match
    if (subcategory.toLowerCase() !== "all") {
        filteredProducts = filteredProducts.filter(product => {
            const subcategories = product.subcategory.split(",").map(sub => sub.trim().toLowerCase());
            return subcategories.includes(subcategory.toLowerCase());
        });
    }

    const gallery = document.getElementById("product-gallery");
    const subcategoryNav = document.querySelector(".subcategory-nav");
    const categoryHeading = document.getElementById("category-heading");

    // Display category name in the heading (capitalize first letter)
    if (categoryHeading) {
        categoryHeading.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    } else {
        console.warn("Element with ID 'category-heading' not found.");
    }

    const displayedProductNames = new Set();
    const subcategoriesSet = new Set();

    // Loop through products and gather subcategories (excluding "bestsellers")
    products.forEach(product => {
        const productCategories = product.category.split(",").map(cat => cat.trim().toLowerCase());
        if (productCategories.includes(category.toLowerCase())) {
            product.subcategory.split(",")
                .map(sub => sub.trim())
                .forEach(sub => {
                    // Only add subcategories that correspond to the current category
                    if (productCategories.some(cat => cat === category.toLowerCase())) {
                        subcategoriesSet.add(sub);
                    }
                });
        }
    });

    // Loop through filtered products and create product cards
    filteredProducts.forEach(product => {
        if (!displayedProductNames.has(product.name)) {
            displayedProductNames.add(product.name);

            const productCard = document.createElement("div");
            productCard.classList.add("col-6", "col-sm-6", "col-md-4", "col-lg-3", "mb-2", "p-2");

            const productLink = document.createElement("a");
            productLink.href = `product-details.html?id=${product.id}`;
            productLink.classList.add("card-link");

            const card = document.createElement("div");
            card.classList.add("card");

            const productImage = document.createElement("img");
            productImage.src = product.image1;
            productImage.classList.add("card-img-top");
            productImage.alt = product.name;

            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            const productName = document.createElement("h5");
            productName.classList.add("card-title");
            productName.textContent = product.name;

            const productCategory = document.createElement("p");
            productCategory.classList.add("card-text");

            // Capitalize the category and exclude "bestsellers" from display
            const categories = product.category.split(",").map(cat => cat.trim());
            const categoryText = categories.filter(cat => cat.toLowerCase() !== "bestsellers")
                .map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))
                .join(", ");

            // Handle subcategory (exclude and "all")
            let subcategoryText = product.subcategory
                .split(",")
                .map(sub => sub.trim())
                .filter(sub => sub.toLowerCase() !== "all")
                .map(sub => sub.charAt(0).toUpperCase() + sub.slice(1))
                .join(", ");

            productCategory.textContent = `${categoryText}, ${subcategoryText}`;

            const productPrice = document.createElement("p");
            productPrice.classList.add("card-price");
            productPrice.textContent = `$${product.price}`;

            cardBody.appendChild(productName);
            cardBody.appendChild(productCategory);
            cardBody.appendChild(productPrice);
            card.appendChild(productImage);
            card.appendChild(cardBody);
            productLink.appendChild(card);
            productCard.appendChild(productLink);
            gallery.appendChild(productCard);

        }
    });

    // Only add subcategory navigation links if not on the homepage (index.html)
    if (window.location.pathname !== "/index.html") {
        // Add links for all subcategories
        subcategoriesSet.forEach(subcat => {
            const subcategoryItem = document.createElement("a");
            subcategoryItem.href = `?category=${category}&subcategory=${subcat}`;
            subcategoryItem.classList.add("subcategory-link");
            subcategoryItem.textContent = subcat.charAt(0).toUpperCase() + subcat.slice(1);

            if (subcategory.toLowerCase() === subcat.toLowerCase()) {
                subcategoryItem.classList.add("active-subcategory");
            }
            subcategoryNav.appendChild(subcategoryItem);
        });
    }
}

// ----------------------------------------------------- Cart ----------------------------------------------------
// Retrieve cart data from sessionStorage
function getCart() {
    return JSON.parse(sessionStorage.getItem("cart")) || [];
}

// Function to clear the cart (you'll need to implement this according to your cart logic)
function clearCart() {
    sessionStorage.removeItem('cart'); // Clear cart from session storage
    console.log("🛒 Cart cleared successfully.");
}

// Save cart data to sessionStorage
function saveCart(cart) {
    sessionStorage.setItem("cart", JSON.stringify(cart));
}

// Function to render cart items
function renderCartItems() {
    const cartItemsContainer = document.querySelector("#cart-items-container");

    // Check if the container exists before proceeding
    if (!cartItemsContainer) {
        console.error("Error: #cart-items-container not found.");
        return;
    }

    let cart = getCart(); // Always fetch updated cart data
    cartItemsContainer.innerHTML = ""; // Clear previous items before rendering

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach((product, index) => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('row', 'align-items-center');

            const cartCardDiv = document.createElement('div');
            cartCardDiv.classList.add('card', 'cart-card');

            // Create the remove button and set its attributes
            const closeButton = document.createElement('button');
            closeButton.classList.add('btn-close');
            closeButton.setAttribute('aria-label', 'Close');

            // Create the card-body div
            const cartCardBody = document.createElement('div');
            cartCardBody.classList.add('card-body');

            // Product Row (Image + Details)
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row', 'g-0', 'align-items-center');

            // Product Image
            const productImageDiv = document.createElement('div');
            productImageDiv.classList.add('col-4', 'col-sm-3'); // Image takes 4 cols on mobile, 3 on small+
            const productImage = document.createElement('img');
            productImage.classList.add('img-fluid', 'rounded');
            productImage.src = product.image1;
            productImageDiv.appendChild(productImage);

            // Product Details (Name, Category, Price)
            const productInfoDiv = document.createElement('div');
            productInfoDiv.classList.add('col-8', 'col-sm-9');

            const cardBodyDiv = document.createElement('div');
            cardBodyDiv.classList.add('card-body', 'd-flex', 'flex-column', 'justify-content-between');

            const productName = document.createElement("h5");
            productName.classList.add("card-title", "cart-title");
            productName.textContent = product.name;

            const productCategory = document.createElement('p');
            productCategory.classList.add('card-text', 'cart-text');

            // Handle subcategory (exclude "bestsellers")
            let categoryText = product.category
                .split(",")
                .map(sub => sub.trim())
                .filter(sub => sub.toLowerCase() !== "bestsellers")
                .map(sub => sub.charAt(0).toUpperCase() + sub.slice(1))
                .join(", ");

            // Handle subcategory (exclude "all")
            let subcategoryText = product.subcategory
                .split(",")
                .map(sub => sub.trim())
                .filter(sub => sub.toLowerCase() !== "all")
                .map(sub => sub.charAt(0).toUpperCase() + sub.slice(1))
                .join(", ");

            productCategory.textContent = `${categoryText}, ${subcategoryText}, ${product.size}`;

            const productPrice = document.createElement("p");
            productPrice.classList.add("card-text", "cart-price");
            productPrice.textContent = `S$${product.price.toFixed(2)}`;

            cardBodyDiv.appendChild(productName);
            cardBodyDiv.appendChild(productCategory);
            cardBodyDiv.appendChild(productPrice);

            // Quantity Controls (using provided HTML structure)
            const quantityControlsDiv = document.createElement("div");
            quantityControlsDiv.classList.add("quantity-controls", "d-flex", "align-items-center");

            const decrementButton = document.createElement("button");
            decrementButton.textContent = "-";
            decrementButton.classList.add("decrement");
            decrementButton.setAttribute("id", "decrement");

            const quantityDisplay = document.createElement("span");
            quantityDisplay.textContent = product.quantity;
            quantityDisplay.classList.add("quantity-display");
            quantityDisplay.setAttribute("id", "quantity");

            const incrementButton = document.createElement("button");
            incrementButton.textContent = "+";
            incrementButton.classList.add("increment");
            incrementButton.setAttribute("id", "increment");

            quantityControlsDiv.appendChild(decrementButton);
            quantityControlsDiv.appendChild(quantityDisplay);
            quantityControlsDiv.appendChild(incrementButton);
            cardBodyDiv.appendChild(quantityControlsDiv);

            // Append elements to card
            productInfoDiv.appendChild(cardBodyDiv);
            rowDiv.appendChild(productImageDiv);
            rowDiv.appendChild(productInfoDiv);
            cartCardDiv.appendChild(cartCardBody); // Add the card body with product details
            cartCardDiv.appendChild(rowDiv);
            cartCardDiv.appendChild(closeButton); // Directly add the close button here
            cartItemDiv.appendChild(cartCardDiv);
            cartItemsContainer.appendChild(cartItemDiv);

            // Event Listeners
            incrementButton.addEventListener("click", () => updateCartQuantity(index, product.quantity + 1));
            decrementButton.addEventListener("click", () => updateCartQuantity(index, Math.max(1, product.quantity - 1)));
            closeButton.addEventListener('click', () => removeCartItem(index));
        });
    }

    updateCartTotal();
    updateCartNotification();
}

// Update Cart Quantity
function updateCartQuantity(index, newQuantity) {
    let cart = getCart();
    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
    } else {
        cart.splice(index, 1);
    }
    saveCart(cart);
    renderCartItems();
}

// Remove Cart Item
function removeCartItem(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCartItems();
}

// Add to Cart
function addToCart(product) {
    const sizeSelect = document.getElementById("product-size");
    const selectedSize = sizeSelect.value;
    const quantity = parseInt(document.getElementById("quantity").textContent);

    let cart = getCart();
    const existingProductIndex = cart.findIndex(item => item.id === product.id && item.size === selectedSize);
    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += quantity;
    } else {
        cart.push({ ...product, size: selectedSize, quantity });
    }
    saveCart(cart);
    updateCartNotification();
}

// Update Cart Notification
function updateCartNotification() {
    const cartCountElement = document.getElementById("cart-count");
    let cart = getCart();
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems > 0) {
        cartCountElement.textContent = totalItems > 99 ? "99+" : totalItems;
        cartCountElement.classList.add("badge", "rounded-pill", "bg-danger", "position-absolute", "top-0", "start-100", "translate-middle");
    } else {
        cartCountElement.textContent = "";
        cartCountElement.classList.remove("badge", "rounded-pill", "bg-danger", "position-absolute", "top-0", "start-100", "translate-middle");
    }
}

// Update Cart Total
function handleQuantityControls(quantityDisplay, decrementButton, incrementButton) {
    let quantity = parseInt(quantityDisplay.textContent, 10) || 1; // Ensure the starting quantity is valid

    // Decrement quantity
    decrementButton.addEventListener("click", function () {
        if (quantity > 1) {
            quantity--; // Decrease quantity by 1
            quantityDisplay.textContent = quantity;
        }
    });

    // Increment quantity
    incrementButton.addEventListener("click", function () {
        quantity++; // Increase quantity by 1
        quantityDisplay.textContent = quantity;
    });

    return quantity; // Return the current quantity (in case you need to use it elsewhere)
}

// Function to render checkout summary (on the checkout page)
async function renderCheckout() {
    const checkoutItemsContainer = document.querySelector("#checkout-items");

    // Check if the container exists before proceeding
    if (!checkoutItemsContainer) {
        console.error("Error: #checkout-items not found.");
        return;
    }

    let cart = getCart(); // Always fetch updated cart data
    checkoutItemsContainer.innerHTML = ""; // Clear previous items before rendering

    if (cart.length === 0) {
        checkoutItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach((product, index) => {
            const checkoutItemDiv = document.createElement('div');
            checkoutItemDiv.classList.add('row', 'align-items-center', 'mb-3'); // Add spacing between items

            const checkoutCardDiv = document.createElement('div');
            checkoutCardDiv.classList.add('card', 'checkout-card', 'd-flex', 'flex-row');

            // Create the remove button and set its attributes
            const closeButton = document.createElement('button');
            closeButton.classList.add('btn-close');
            closeButton.setAttribute('aria-label', 'Close');

            // Use removeCartItem() to remove item on click
            closeButton.addEventListener("click", () => {
                removeCartItem(index);
                renderCheckout(); // Re-render the checkout page
            });

            // Product Row (Image + Details)
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row', 'g-0', 'align-items-center');

            // Product Image
            const productImageDiv = document.createElement('div');
            productImageDiv.classList.add('col-4', 'col-sm-3'); // Image takes 4 cols on mobile, 3 on small+
            const productImage = document.createElement('img');
            productImage.classList.add('img-fluid', 'rounded');
            productImage.src = product.image1; // Assuming the product has an image property
            productImage.alt = product.name; // Alt text for accessibility
            productImageDiv.appendChild(productImage);

            // Product Details (Name, Price, Category, Size, Quantity)
            const productInfoDiv = document.createElement('div');
            productInfoDiv.classList.add('col-8', 'col-sm-9');

            const cardBodyDiv = document.createElement('div');
            cardBodyDiv.classList.add('card-body', 'checkout-card-body', 'd-flex', 'flex-column', 'justify-content-between');

            const productName = document.createElement("h5");
            productName.classList.add("card-title", "checkout-title");
            productName.textContent = `${product.name} x${product.quantity}`;

            const productCategory = document.createElement('p');
            productCategory.classList.add('card-text', 'checkout-text');

            // Handle subcategory (exclude "bestsellers" and "all")
            let categoryText = product.category
                .split(",")
                .map(sub => sub.trim())
                .filter(sub => sub.toLowerCase() !== "bestsellers")
                .map(sub => sub.charAt(0).toUpperCase() + sub.slice(1))
                .join(", ");

            let subcategoryText = product.subcategory
                .split(",")
                .map(sub => sub.trim())
                .filter(sub => sub.toLowerCase() !== "all")
                .map(sub => sub.charAt(0).toUpperCase() + sub.slice(1))
                .join(", ");

            productCategory.textContent = `${categoryText}, ${subcategoryText}, ${product.size}`;

            const productPrice = document.createElement("p");
            productPrice.classList.add("card-text", "checkout-price");
            productPrice.textContent = `S$${(product.price * product.quantity).toFixed(2)}`; // Total price based on quantity

            // Append product details to the card body
            cardBodyDiv.appendChild(productName);
            cardBodyDiv.appendChild(productCategory);
            cardBodyDiv.appendChild(productPrice);

            // Append the card body and image to the row
            productInfoDiv.appendChild(cardBodyDiv);
            rowDiv.appendChild(productImageDiv);
            rowDiv.appendChild(productInfoDiv);

            // Append everything to the checkout card
            checkoutCardDiv.appendChild(closeButton);
            checkoutCardDiv.appendChild(rowDiv);
            checkoutItemDiv.appendChild(checkoutCardDiv);

            // Append the checkout item to the container
            checkoutItemsContainer.appendChild(checkoutItemDiv);
        });
    }

    populateCheckoutDetails(); // Populate the checkout details (Moke Points, Address, etc.)
    updateCartNotification(); // Update the cart notification (if necessary)
}

async function populateCheckoutDetails() {
    // Fetch the user data from session storage
    let user = JSON.parse(sessionStorage.getItem('user'));

    if (!user) {
        console.error("No user data available in session");
        return;
    }

    console.log('User from sessionStorage:', user);  // Log the user data to ensure it's correct

    // Left Section: Billing Details (Address)
    const addressContainer = document.querySelector('.billing-details .address-option-container');
    addressContainer.innerHTML = ''; // Clear any existing content

    if (!user["Address"] || user["Address"].trim() === "") {
        // If no address is set, show a button to redirect to profile.html
        const noAddressMessage = document.createElement('p');
        noAddressMessage.textContent = "No address found. Please set your address in your profile.";

        const goToProfileButton = document.createElement('button');
        goToProfileButton.textContent = "Set Address";
        goToProfileButton.classList.add('checkout-button', 'btn', 'btn-primary', 'w-100'); // Add a class for styling
        goToProfileButton.addEventListener('click', () => {
            window.location.href = "profile.html"; // Redirect to profile page
        });

        addressContainer.appendChild(noAddressMessage);
        addressContainer.appendChild(goToProfileButton);
        return; // Stop execution since no address is available
    }

    // Split the addresses into an array
    const addresses = user["Address"].split(',').map(address => address.trim());
    const addressOwners = user["Address Owner"].split(',').map(owner => owner.trim());

    let selectedAddress = ''; // Store the selected address globally

    // Check if addresses and address owners have the same length
    if (addresses.length !== addressOwners.length) {
        console.error("Mismatch between addresses and address owners.");
        return;
    }

    // Create address radio buttons dynamically
    addresses.forEach((address, index) => {
        const addressOption = document.createElement('div');
        addressOption.classList.add('address-option');

        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'billing';
        radioButton.id = `billing-${index}`;
        radioButton.value = `${addressOwners[index]}: ${address}`;

        const label = document.createElement('label');
        label.setAttribute('for', `billing-${index}`);
        label.innerHTML = `${addressOwners[index]}<br>${address}`;

        addressOption.appendChild(radioButton);
        addressOption.appendChild(label);
        addressContainer.appendChild(addressOption);

        // Add event listener to detect when an address is selected
        radioButton.addEventListener('change', () => {
            if (radioButton.checked) {
                selectedAddress = radioButton.value;
                console.log(`Selected address: ${selectedAddress}`);
            }
        });
    });

    console.log('Address options populated:', addressContainer); // Debugging

    // Right Section: Moke Coins (Redeem Section)
    const mokeCoinsToggle = document.getElementById('moke-coins-toggle');
    const mokePointsLabel = document.querySelector('.moke-coins');

    const mokePointsText = `Redeem ${user["Moke Points"]} MokeCoins`;

    if (mokePointsLabel) {
        mokePointsLabel.innerHTML = `<input type="checkbox" id="moke-coins-toggle">${mokePointsText}`;
    }

    if (mokeCoinsToggle) {
        // Disable the checkbox if Moke Points are 0
        if (user["Moke Points"] === 0) {
            mokeCoinsToggle.disabled = true;
            mokeCoinsToggle.checked = false;
        } else {
            mokeCoinsToggle.checked = true;
        }
        updateCartTotal(); // Update cart total based on toggle state
    }

    // "Place Order" button click event
    const placeOrderButton = document.getElementById('place-order-btn');
    placeOrderButton.addEventListener('click', async () => {
        if (!selectedAddress) {
            console.warn("No address selected.");
            return;
        }

        const cartItems = getCart();
        if (cartItems.length === 0) {
            console.warn("No items in the cart.");
            return;
        }

        const mokeCoinsRedeemed = mokeCoinsToggle.checked ? user["Moke Points"] : 0;

        // Proceed with placing the order
        await placeOrder(selectedAddress, mokeCoinsRedeemed);
    });

    // Return an object containing selected address and moke coins redeemed
    return { selectedAddress, mokeCoinsRedeemed: mokeCoinsToggle.checked };
}

// Function to update the cart total based on the Moke Coins toggle state
async function updateCartTotal() {
    const subtotalElement = document.getElementById("subtotal");
    const discountElement = document.getElementById("discount");
    const totalElement = document.getElementById("total");
    const mokeCoinsLabel = document.querySelector('.moke-coins'); // Label where the redeem text is

    if (!subtotalElement || !discountElement || !totalElement) {
        console.error("Required elements for displaying prices are missing on the page.");
        return; // Exit if these elements are not found on the page
    }

    let cart = getCart();  // Fetch the cart items
    let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Check if we're on the checkout page using a URL or element-based check
    const isCheckoutPage = window.location.href.includes('checkout') || document.querySelector('.checkout-page-element') !== null;

    const userProfile = await fetchUser();  // Ensure fetchUser returns the latest profile
    let userMokePoints = isCheckoutPage ? userProfile["Moke Points"] : 0;

    console.log("User Moke Points:", userMokePoints);

    // Ensure userMokePoints is a valid number
    userMokePoints = isNaN(userMokePoints) ? 0 : userMokePoints;

    // Define the redemption value per Moke Coin (only for checkout page)
    const redemptionValue = 0.01;  // Define how much each Moke Coin is worth (e.g., 10 cents per Moke Coin)

    // Ensure subtotal is a valid number
    subtotal = isNaN(subtotal) ? 0 : subtotal;

    let discount = 0;
    let total = subtotal;

    // Only try to access the mokeCoinsToggle if we are on the checkout page
    if (isCheckoutPage) {
        const mokeCoinsToggle = document.getElementById("moke-coins-toggle");

        // Check if mokeCoinsToggle exists
        if (mokeCoinsToggle) {
            // Check if the user has Moke Coins
            if (userMokePoints === 0) {
                // If the user has 0 Moke Coins, disable the checkbox and change the redeem text
                mokeCoinsToggle.disabled = true;

                if (mokeCoinsLabel) {
                    mokeCoinsLabel.innerHTML = "You have no Moke Coins to redeem."; // Change the text to inform the user
                }
            } else {
                // Enable the checkbox if they have Moke Coins and update the redeem text
                mokeCoinsToggle.disabled = false;

                if (mokeCoinsLabel) {
                    mokeCoinsLabel.innerHTML = `Redeem ${userMokePoints} MokeCoins`; // Default redeem text
                }
            }

            // Set the initial discount based on the toggle state for checkout
            if (mokeCoinsToggle.checked) {
                discount = redemptionValue * userMokePoints;
            }

            // Add event listener for toggle change to apply discount in checkout
            mokeCoinsToggle.addEventListener('change', function () {
                if (mokeCoinsToggle.checked) {
                    discount = redemptionValue * userMokePoints;
                } else {
                    discount = 0;
                }

                // Recalculate total after applying the discount
                total = subtotal - discount;

                // Update the DOM elements with the recalculated values
                updateTotalDisplay(subtotal, discount, total);
            });
        }
    }

    // Recalculate the total when the page is initially loaded
    total = subtotal - discount;

    // Update the DOM with the values
    subtotalElement.textContent = `S$${subtotal.toFixed(2)}`;
    discountElement.textContent = `S$${discount.toFixed(2)}`;
    totalElement.textContent = `S$${total.toFixed(2)}`;
}


async function placeOrder(selectedAddress, mokeCoinsRedeemed) {
    const cartItems = getCart(); // Fetch cart items
    const user = JSON.parse(sessionStorage.getItem("user")); // Fetch user data

    if (!user || !user._id) {
        console.error("User not found or invalid user ID, cannot place order.");
        return;
    }

    const orderData = {
        orderid: `ORDER_${Date.now()}`,  // Generate a unique order ID based on timestamp
        username: user.Username,  // Ensure username is a string
        products: cartItems.map(item => ({
            id: item.id,
            size: item.size,
            quantity: item.quantity
        })),
        address: selectedAddress,
        date: new Date().toISOString(),
    };

    // 1st API
    // const apiUrl = 'https://fedassignment2-eef5.restdb.io/rest/products';
    // const apikey = '678b1d1a19b96a08c0af6336';

    // 2nd API
    // const apiUrl = 'https://fedassg-78fe.restdb.io/rest/products';
    // const apikey = '67a6f93e76011910f95afd4b';

    // 3rd API 
    // const apiUrl = 'https://fedassg2-cd74.restdb.io/rest/products';
    // const apikey = '67a76d364d8744a119828030';  

    const apiKey = '67a6f93e76011910f95afd4b'; // Replace with your actual API key
    const orderApiUrl = 'https://fedassg-78fe.restdb.io/rest/orders';
    const userApiUrl = `https://fedassg-78fe.restdb.io/rest/account/${user._id}`; // Use RestDB ObjectId

    try {
        // 🛒 **Place Order**
        const orderResponse = await fetch(orderApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': apiKey,
            },
            body: JSON.stringify(orderData),
        });

        const orderResult = await orderResponse.json();

        if (!orderResponse.ok) {
            console.error("Error placing order:", orderResult);
            return;
        }

        console.log("✅ Order placed successfully:", orderResult);

        // 🎟 **Update Moke Coins**
        const newMokeCoinsBalance = Math.max(0, user["Moke Points"] - mokeCoinsRedeemed); // Ensure non-negative balance

        const userResponse = await fetch(userApiUrl, {
            method: 'PATCH', // Update the user document
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': apiKey,
            },
            body: JSON.stringify({
                "Moke Points": newMokeCoinsBalance, // Update Moke Coins
            }),
        });

        const userResult = await userResponse.json();

        if (!userResponse.ok) {
            console.error("⚠️ Error updating Moke Coins:", userResult);
            return;
        }

        console.log("✅ User Moke Coins updated successfully:", userResult);

        clearCart();

    } catch (error) {
        console.error("❌ Failed to place order:", error);
    }
}

// ----------------------------------------------------- MokePoints ----------------------------------------------------
// Function to update the UI with the current MokePoints
function updateMokepointDisplay() {
    // Get the user data from sessionStorage
    const user = JSON.parse(sessionStorage.getItem("user"));

    // Check if the element exists before trying to update it
    const mokepointDisplayElement = document.getElementById("mokepoint-display");
    if (!mokepointDisplayElement) {
        console.warn('Element with ID "mokepoint-display" not found');
        return; // Exit if the element is not found
    }

    // Check if user exists and has Moke Points
    if (user && user["Moke Points"] !== undefined) {
        // Get Moke Points value
        let mokepoints = user["Moke Points"];

        // Update the UI
        document.getElementById("mokepoint-display").textContent = `MokeCoins: ${mokepoints}`;
    } else {
        // If Moke Points is not available or user data doesn't exist, show 0
        document.getElementById("mokepoint-display").textContent = "MokeCoins: 0";
    }
}






