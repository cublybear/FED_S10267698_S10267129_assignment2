//----------------------------------------------------- JSON (testing) ----------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get("id");
            const category = urlParams.get("category") || "Products";
            const subcategory = urlParams.get("subcategory") || "all";

            if (productId) {
                // Find the specific product based on the 'productId'
                const product = products.find(p => p.id === productId);
                if (product) {
                    displayProductDetails(productId, products);
                    setupCartFunctions(product); // Now pass the 'product' object
                } else {
                    console.error('Product not found');
                }
            } else {
                displayProductGallery(category, subcategory, products);
            }

            // Load cart from sessionStorage and render cart items if on cart page
            cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            console.log("cart", cart);

            // Only render cart items if on cart page
            if (document.getElementById("cart-items-container")) {
                renderCartItems();
            }

            // Only render checkout summary if on checkout page
            if (document.getElementById("checkout-summary")) {
                renderCheckoutSummary();
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

    // Display category and subcategory together (e.g., Women, Dress)
    const subcategories = product.subcategory.split(",").map(sub => sub.trim());
    const filteredSubcategories = subcategories.filter(sub => sub.toLowerCase() !== "all" && sub.toLowerCase() !== "bestsellers");

    // Capitalize the category and subcategory
    const categoryText = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    const subcategoryText = filteredSubcategories
        .map(sub => sub.charAt(0).toUpperCase() + sub.slice(1))
        .join(", ");

    const displayText = [categoryText, subcategoryText].filter(Boolean).join(", ");

    // Display the combined category and subcategory text
    if (displayText) {
        document.getElementById("product-cat").textContent = displayText;
    }

    document.getElementById("add-to-cart").addEventListener("click", function () {
        addToCart(product);
    });
    

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

    // Ensure the index is valid
    if (sizeIndex !== -1) {
        // Show "Sold out" message if stock is 0, otherwise hide it
        if (parseInt(stocks[sizeIndex], 10) === 0) {
            document.getElementById("size-status").style.display = "block"; // Show "Sold out"
        } else {
            document.getElementById("size-status").style.display = "none"; // Hide "Sold out"
        }
    }
});

}

// ----------------------------------------------------- Product Gallery ----------------------------------------------------
function displayProductGallery(category, subcategory, products) {
    let filteredProducts = products.filter(product => product.category.toLowerCase() === category.toLowerCase());
    if (subcategory.toLowerCase() !== "all") {
        filteredProducts = filteredProducts.filter(product =>
            product.subcategory.toLowerCase().includes(subcategory.toLowerCase())
        );
    }

    const gallery = document.getElementById("product-gallery");
    const subcategoryNav = document.querySelector(".subcategory-nav");
    const categoryHeading = document.getElementById("category-heading");

    categoryHeading.textContent = category && category.charAt(0).toUpperCase() + category.slice(1) || "Category";
    console.log(categoryHeading);  // This will print null if the element isn't found

    if (categoryHeading) {
    categoryHeading.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    } else {
    console.error("Element with ID 'category-heading' not found.");
    }

    const displayedProductNames = new Set();
    const subcategoriesSet = new Set();

    products.forEach(product => {
        if (product.category.toLowerCase() === category.toLowerCase()) {
            product.subcategory.split(",")
                .map(sub => sub.trim())
                .filter(sub => sub.toLowerCase() !== "bestsellers")
                .forEach(sub => subcategoriesSet.add(sub));
        }
    });

    filteredProducts.forEach(product => {
        if (!displayedProductNames.has(product.name)) {
            displayedProductNames.add(product.name);

            const productCard = document.createElement("div");
            productCard.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3", "mb-4");

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
            const categoryText = category.charAt(0).toUpperCase() + category.slice(1);
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

    const allLink = document.createElement("a");
    allLink.classList.add("subcategory-link");
    if (subcategory.toLowerCase() === "all") {
        allLink.classList.add("active-subcategory");
    }
    subcategoryNav.appendChild(allLink);

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

// ----------------------------------------------------- Cart ----------------------------------------------------
// f: render cart items
function renderCartItems() {
    const cartItemsContainer = document.querySelector('#cart-items-container'); // Adjust to the correct container
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cartItemsContainer.innerHTML = ''; // Clear the container before rendering new items

        cart.forEach((product, index) => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('col-lg-6', 'col-md-12');

            const cartCardDiv = document.createElement('div');
            cartCardDiv.classList.add('card', 'mb-3', 'cart-card');
            cartItemDiv.appendChild(cartCardDiv);

            const productImageDiv = document.createElement('div');
            productImageDiv.classList.add('col-5', 'col-sm-4');
            const productImage = document.createElement('img');
            productImage.classList.add('img-fluid', 'product-image');
            productImage.src = product.imageUrl;
            productImage.alt = product.name;
            productImageDiv.appendChild(productImage);

            const productInfoDiv = document.createElement('div');
            productInfoDiv.classList.add('col-7', 'col-sm-8', 'd-flex', 'flex-column', 'justify-content-between');
            const cardBodyDiv = document.createElement('div');
            cardBodyDiv.classList.add('d-flex', 'justify-content-between', 'align-items-center');
            
            const productDetailsDiv = document.createElement('div');
            productDetailsDiv.classList.add('card-body');
            
            const productName = document.createElement('h5');
            productName.classList.add('card-title', 'cart-title');
            productName.textContent = product.name;
            
            const productCategory = document.createElement('p');
            productCategory.classList.add('card-text', 'cart-text');
            productCategory.textContent = `${product.category}, Size: ${product.size}`;
            
            const productPrice = document.createElement('p');
            productPrice.classList.add('card-text', 'cart-price');
            productPrice.textContent = `$${product.price.toFixed(2)}`;
            
            productDetailsDiv.appendChild(productName);
            productDetailsDiv.appendChild(productCategory);
            productDetailsDiv.appendChild(productPrice);
            cardBodyDiv.appendChild(productDetailsDiv);

            // Quantity Controls (Increment/Decrement)
            const quantityControlsDiv = document.createElement('div');
            quantityControlsDiv.classList.add('quantity-controls');
            const incrementButton = document.createElement('button');
            incrementButton.textContent = '+';
            const decrementButton = document.createElement('button');
            decrementButton.textContent = '-';
            const quantityDisplay = document.createElement('span');
            quantityDisplay.textContent = product.quantity;

            quantityControlsDiv.appendChild(decrementButton);
            quantityControlsDiv.appendChild(quantityDisplay);
            quantityControlsDiv.appendChild(incrementButton);
            cardBodyDiv.appendChild(quantityControlsDiv);

            // Remove Button
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            cardBodyDiv.appendChild(removeButton);

            // Append elements to the card
            cartCardDiv.appendChild(productImageDiv);
            cartCardDiv.appendChild(productInfoDiv);
            cartInfoDiv.appendChild(cardBodyDiv);

            // Event Listeners for Quantity Adjustment
            incrementButton.addEventListener("click", () => {
                product.quantity++;
                quantityDisplay.textContent = product.quantity;
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCartItems(); // Re-render the cart
                updateCartTotal();
            });

            decrementButton.addEventListener("click", () => {
                if (product.quantity > 1) {
                    product.quantity--;
                    quantityDisplay.textContent = product.quantity;
                    localStorage.setItem("cart", JSON.stringify(cart));
                    renderCartItems(); // Re-render the cart
                    updateCartTotal();
                }
            });

            // Remove Button Logic
            removeButton.addEventListener("click", () => {
                cart.splice(index, 1); // Remove the item from the cart
                localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
                renderCartItems(); // Re-render cart items
                updateCartTotal(); // Update totals
            });

            cartItemsContainer.appendChild(cartItemDiv);
        });

        updateCartTotal(); // Ensure the total is updated after rendering
    }
}


//   // f: render checkout page
//   function renderCheckoutSummary() {
//     const cartItemsContainer = document.getElementById("checkout-items");
//     if (!cartItemsContainer) {
//       console.error("Cart container not found!");
//       return;
//     }
  
//     cartItemsContainer.innerHTML = ""; // Clear existing items
  
//     cart.forEach(item => {
//       const cartItemDiv = document.createElement("div");
//       cartItemDiv.classList.add("checkout-item");
  
//       // Product Image
//       const productImage = document.createElement("img");
//       productImage.src = item.images && item.images.length > 0 ? item.images[0] : "scrunchies/cute one.jpg";
//       productImage.alt = item.images && item.images.length > 0 ? item.name : "No image available";
  
//       // Product Details
//       const productDetails = document.createElement("div");
//       productDetails.classList.add("checkout-details");
  
//       const productName = document.createElement("p");
//       productName.textContent = `${item.name}`;
//       productName.classList.add("checkout-product-name");
  
//       const productQuantity = document.createElement("p");
//       productQuantity.textContent = `qty : ${item.quantity}`;
//       productQuantity.classList.add("product-subname");
  
//       const productPrice = document.createElement("p");
//       productPrice.textContent = `S$${(item.price * item.quantity).toFixed(2)}`;
//       productPrice.classList.add("checkout-product-price");
  
//       productDetails.appendChild(productName);
//       productDetails.appendChild(productQuantity);
//       productDetails.appendChild(productPrice);
  
//       // Append elements to cart item
//       cartItemDiv.appendChild(productImage);
//       cartItemDiv.appendChild(productDetails);
//       cartItemsContainer.appendChild(cartItemDiv);
//     });
  
//     updateCheckoutTotal();
//   }
  
  // f: setup cart functions (quantity, add to cart)
  function setupCartFunctions(product) {
    const addToCartButton = document.getElementById("add-to-cart");
    const incrementButton = document.getElementById("increment");
    const decrementButton = document.getElementById("decrement");
    const quantityDisplay = document.getElementById("quantity");
  
    if (!incrementButton || !decrementButton || !quantityDisplay) {
      console.error("Quantity buttons or display not found.");
      return;
    }
  
    // Initialize quantity button logic
    const getQuantity = setupQuantityButtons(incrementButton, decrementButton, quantityDisplay);
  
    if (addToCartButton) {
      addToCartButton.addEventListener("click", () => {
        const quantity = getQuantity(); // Get the current quantity
        console.log("Adding to cart:", product.id, quantity);
        addToCart(product.id, quantity);
        showCartNotification(product, quantity);
      });
    } else {
      console.error("Add to Cart button not found.");
    }
  }
  
  // f: add to cart
  function addToCart(product) {
    const sizeSelect = document.getElementById("product-size");
    const selectedSize = sizeSelect.value;
    const quantity = parseInt(document.getElementById("quantity").textContent);

    if (selectedSize === "Choose Size") {
        alert("Please choose a size.");
        return;
    }

    const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory,
        size: selectedSize,
        quantity: quantity,
        image1: product.image1
    };

    let cartItems = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    const existingProductIndex = cartItems.findIndex(item => item.id === cartProduct.id && item.size === cartProduct.size);

    if (existingProductIndex > -1) {
        cartItems[existingProductIndex].quantity += quantity;
    } else {
        cartItems.push(cartProduct);
    }

    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    console.log(sessionStorage.getItem("cartItems"));
}

  
  // f: update cart total price summary
  function updateCartTotal() {
    const subtotalElement = document.getElementById("subtotal");
    const discountElement = document.getElementById("discount");
    const totalElement = document.getElementById("total");
  
    let subtotal = 0;
  
    cart.forEach(item => {
      subtotal += item.price * item.quantity;
    });
  
    const discount = 0; // Adjust this based on promo code logic
    const total = subtotal - discount;
  
    subtotalElement.textContent = `S$${subtotal.toFixed(2)}`;
    discountElement.textContent = `S$${discount.toFixed(2)}`;
    totalElement.textContent = `S$${total.toFixed(2)}`;
  }
  
  // f: update checkout total price summary
  function updateCheckoutTotal() {
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += item.price * item.quantity;
    });
  
    const shipping = 5.00; // Shipping cost (could be dynamic)
    const total = subtotal + shipping;
  
    document.getElementById("subtotal").textContent = `S$${subtotal.toFixed(2)}`;
    document.getElementById("shipping").textContent = `S$${shipping.toFixed(2)}`;
    document.getElementById("total").textContent = `S$${total.toFixed(2)}`;
  }
  
  // f: quantity update
  function setupQuantityButtons(incrementButton, decrementButton, quantityDisplay, initialQuantity = 1) {
    let quantity = initialQuantity;
  
    const updateQuantityDisplay = () => {
      quantityDisplay.textContent = quantity;
    };
  
    incrementButton.addEventListener("click", () => {
      quantity++;
      updateQuantityDisplay();
    });
  
    decrementButton.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        updateQuantityDisplay();
      }
    });
  
    updateQuantityDisplay(); // Initialize display
    return () => quantity; // Return a function to get the current quantity
  }
  
  // f: update the cart notification
  function updateCartNotification() {
  
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0); // Calculate the total number of items in the cart
    const cartNotification = document.getElementById("cart-notification");
    const cartCountElement = document.getElementById("cart-count");
  
    cartCountElement.textContent = cartCount; // Update the count in the notification
  
    // show notification if cart is not empty
    if (cartCount > 0) {
      cartNotification.classList.add("visible");
    } else {
      cartNotification.classList.remove("visible");
    }
  }
  
  // f: show notification in product.html
  function showCartNotification(product, quantity) {
    const notification = document.querySelector(".notification");
    const body = document.body;
    const notificationContainer = document.querySelector(".notification-container");  // To find the notification container
  
    if (notification.classList.contains("visible")) {
      notification.classList.remove("visible");
    }
  
    document.getElementById("notification-name").textContent = `"${product.name}" x${quantity}`;
    notification.classList.add("visible");
  
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  
    setTimeout(() => {
      notification.classList.remove("visible");
      body.classList.remove("notification-visible"); // Remove the space after notification disappears
    }, 4000);
  }

  function showCartNotification() {
    const cartNotification = document.getElementById("cart-notification");

    if (cartNotification) {  // Ensure the element exists before interacting with it
        cartNotification.classList.add("visible");
        setTimeout(() => {
            cartNotification.classList.remove("visible");
        }, 3000);
    } else {
        console.error("Cart notification element not found!");
    }
}
