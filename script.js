//----------------------------------------------------- JSON (testing) ----------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    console.log("Script loaded successfully");
    fetch("products.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load products.json");
            }
            return response.json();
        })
        .then(products => {
            console.log("Products loaded:", products);
            updateCartNotification();

            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get("id");
            let category = urlParams.get("category") || "Products";
            let subcategory = urlParams.get("subcategory") || "all";

            // Force category to "bestsellers" for the homepage (index.html)
            if (window.location.pathname.includes("index.html")) {
                category = "bestsellers"; // Set category to "bestsellers" for homepage
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
                // Display product gallery based on the category and subcategory
                console.log("Displaying product gallery");
                displayProductGallery(category, subcategory, products);
            }
        })
        .catch(error => {
            console.error("Error loading products:", error);
        });
});

//----------------------------------------------------- API ----------------------------------------------------
// document.addEventListener("DOMContentLoaded", function () {
//     const apiUrl = 'https://fedassignment2-eef5.restdb.io/rest/products';  // Your RestDB API URL
//     const apikey = '678b1d1a19b96a08c0af6336';  // Your RestDB API key

//     fetch(apiUrl, {
//         method: 'GET',
//         headers: {
//             'x-apikey': apikey,  // Your RestDB API key
//             'Content-Type': 'application/json',
//             "Cache-Control": "no-cache"
//         }
//     })
//         .then(response => response.json()) // Parse the response as JSON
//         .then(products => {
//             console.log(products);

//             const urlParams = new URLSearchParams(window.location.search);
//             const productId = urlParams.get("id");
//             const category = urlParams.get("category") || "Products";
//             const subcategory = urlParams.get("subcategory") || "all";

//             if (productId) {
//                 displayProductDetails(productId, products);
//             } else {
//                 displayProductGallery(category, subcategory, products);
//             }
//         })
//         .catch(error => {
//             console.error("Error loading products:", error);
//         });
// });

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
        // Create the carousel indicator button
        const indicator = document.createElement("button");
        indicator.setAttribute("type", "button");
        indicator.setAttribute("data-bs-target", "#carouselExampleIndicators");
        indicator.setAttribute("data-bs-slide-to", index);
        indicator.setAttribute("aria-label", `Slide ${index + 1}`);
        if (index === 0) indicator.classList.add("active"); // Make the first indicator active

        // Create the carousel item (image container)
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");
        if (index === 0) carouselItem.classList.add("active"); // Make the first image active

        // Create the image element
        const img = document.createElement("img");
        img.src = image;
        img.classList.add("d-block", "mx-auto");
        img.alt = product.name;

        // Append the image to the carousel item
        carouselItem.appendChild(img);

        // Append the carousel item and the indicator to their respective parent elements
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

    // Display the combined category and subcategory text
    if (displayText) {
        document.getElementById("product-cat").textContent = displayText;
    }

    // Handle size selection and stock level
    const sizeSelect = document.getElementById("product-size");
    const sizes = product.size.split(", ");
    const stocks = product.stock.split(", ");
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
            if (parseInt(stocks[sizeIndex], 10) === 0) {
                document.getElementById("size-status").style.display = "block"; // Show "Sold out"
            }
        }
    });

    // Initialize quantity control
    const quantityDisplay = document.querySelector(".quantity-display");
    const decrementButton = document.querySelector(".decrement");
    const incrementButton = document.querySelector(".increment");

    // Call the quantity control function
    handleQuantityControls(quantityDisplay, decrementButton, incrementButton);

    // Handle adding product to cart
    document.getElementById("add-to-cart").addEventListener("click", function () {
        const selectedSize = sizeSelect.value;
        const sizeIndex = sizes.indexOf(selectedSize);
        // Check if size is selected
        if (selectedSize === "Choose Size" || selectedSize === "") {
            // Show the alert if no size is selected
            const alert = document.getElementById("size-alert");
            alert.style.display = "block"; // Show the alert
            alert.classList.add("show");  // Make the alert visible with Bootstrap animation
            // Hide the alert after 3 seconds
            setTimeout(function () {
                alert.classList.remove("show");  // Fade out the alert smoothly
                alert.style.display = "none"; // Actually hide the alert after fade
            }, 3000); // 3 seconds for the alert to disappear
        } else if (parseInt(stocks[sizeIndex], 10) === 0) {
            // If the selected size is sold out, show a different alert
            const soldOutAlert = document.getElementById("sold-out-alert");
            soldOutAlert.style.display = "block"; // Show the sold-out alert
            soldOutAlert.classList.add("show");
            // Hide the alert after 3 seconds
            setTimeout(function () {
                soldOutAlert.classList.remove("show");
                soldOutAlert.style.display = "none";
            }, 3000);
        } else {
            addToCart(product);
        }
    });
}

// ----------------------------------------------------- Product Gallery ----------------------------------------------------
function displayProductGallery(category, subcategory, products) {
    // Filter products by category
    let filteredProducts = products.filter(product => product.category.toLowerCase().includes(category.toLowerCase()));

    // If subcategory isn't "all", filter further based on subcategory
    if (subcategory.toLowerCase() !== "all") {
        filteredProducts = filteredProducts.filter(product =>
            product.subcategory.toLowerCase().includes(subcategory.toLowerCase())
        );
    }

    const gallery = document.getElementById("product-gallery");
    const subcategoryNav = document.querySelector(".subcategory-nav");
    const categoryHeading = document.getElementById("category-heading");

    // Display category name in the heading (capitalize first letter)
    if (categoryHeading) {
        categoryHeading.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    } else {
        console.error("Element with ID 'category-heading' not found.");
    }

    const displayedProductNames = new Set();
    const subcategoriesSet = new Set();

    // Loop through products and gather subcategories (excluding "bestsellers")
    products.forEach(product => {
        if (product.category.toLowerCase().includes(category.toLowerCase())) {
            product.subcategory.split(",")
                .map(sub => sub.trim())
                .forEach(sub => subcategoriesSet.add(sub));
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

            // Handle subcategory (exclude "bestsellers" and "all")
            let subcategoryText = product.subcategory
                .split(",")
                .map(sub => sub.trim())
                .filter(sub => sub.toLowerCase() !== "all" && sub.toLowerCase() !== "bestsellers")
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

// Save cart data to sessionStorage
function saveCart(cart) {
    sessionStorage.setItem("cart", JSON.stringify(cart));
}

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
function updateCartTotal() {
    const subtotalElement = document.getElementById("subtotal");
    const discountElement = document.getElementById("discount");
    const totalElement = document.getElementById("total");

    let cart = getCart();
    let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0; // Modify as needed
    let total = subtotal - discount;

    subtotalElement.textContent = `S$${subtotal.toFixed(2)}`;
    discountElement.textContent = `S$${discount.toFixed(2)}`;
    totalElement.textContent = `S$${total.toFixed(2)}`;
}

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
function renderCheckout() {
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
            cardBodyDiv.classList.add('card-body', 'd-flex', 'flex-column', 'justify-content-between');

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

    updateCartTotal(); // Update the total price
    updateCartNotification(); // Update the cart notification (if necessary)
}


// ----------------------------------------------------- MokePoints ----------------------------------------------------
// Function to update the UI with the current MokePoints
function updateMokepointDisplay() {
    let mokepoints = sessionStorage.getItem("Moke Points") || 0; // Get MokePoints from localStorage (default to 0 if none found)
    console.groupCollapsed(mokepoints);
    document.getElementById("mokepoint-display").textContent = `MokeCoins: ${mokepoints}`; // Update the display text
}

updateMokepointDisplay(); // Call this function to update the UI when the page loads




