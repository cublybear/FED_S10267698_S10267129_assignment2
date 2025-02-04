document.addEventListener("DOMContentLoaded", function () {
    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get("id");
            const category = urlParams.get("category") || "Products";
            const subcategory = urlParams.get("subcategory") || "all";

            if (productId) {
                displayProductDetails(productId, products);
            } else {
                displayProductGallery(category, subcategory, products);
            }
        })
        .catch(error => {
            console.error("Error loading products:", error);
        });
});

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

    // Size selection logic
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

        // Show "Sold out" message if stock is 0, otherwise hide it
        if (stocks[sizeIndex] === "0") {
            document.getElementById("size-status").style.display = "block"; // Show "Sold out"
        } else {
            document.getElementById("size-status").style.display = "none"; // Hide "Sold out"
        }
    });

    // Quantity controls
    const quantityDisplay = document.getElementById("quantity");
    let quantity = 1;

    document.getElementById("increment").addEventListener("click", function() {
        quantity++;
        quantityDisplay.textContent = quantity;
    });

    document.getElementById("decrement").addEventListener("click", function() {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
        }
    });

    // Add to cart button
    document.getElementById("add-to-cart").addEventListener("click", function() {
        alert(`Added ${quantity} x ${product.name} to the cart.`);
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

    gallery.innerHTML = "";
    subcategoryNav.innerHTML = "";
    categoryHeading.textContent = category.charAt(0).toUpperCase() + category.slice(1);

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