// Get category from the URL parameter (e.g., gallery.html?category=women)
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category'); // Get the category from the URL

// API URL to fetch the products
const apiUrl = "https://fedassignment2-eef5.restdb.io/rest/products";
const apiKey = "678b1d1a19b96a08c0af6336";

// Function to fetch products based on category
function fetchProducts() {
    fetch(apiUrl)
        .then(response => response.json()) // Get the JSON response from the API
        .then(products => {
            // Filter products based on the category (this is a case-sensitive check)
            const filteredProducts = products.filter(product => product.Category.toLowerCase() === category.toLowerCase());

            // Call function to render the filtered products
            renderProducts(filteredProducts);
        })
        .catch(error => {
            console.error("Error loading products:", error);
        });
}

// Function to render the products dynamically in the gallery section
function renderProducts(products) {
    const productsContainer = document.querySelector(".gallery-section .row"); // The parent container to append products
    productsContainer.innerHTML = ""; // Clear the existing products

    // If no products match the category, show a message
    if (products.length === 0) {
        const noProductsMessage = document.createElement("p");
        noProductsMessage.textContent = "No products found in this category.";
        productsContainer.appendChild(noProductsMessage);
        return;
    }

    // Loop through the filtered products and create HTML structure for each product
    products.forEach(product => {
        // Create the product card container
        const productCard = document.createElement('div');
        productCard.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4');

        // Create the link for the product details
        const productLink = document.createElement('a');
        productLink.href = `product-details.html?id=${product._id}`;
        productLink.classList.add('card-link');

        // Create the card itself
        const card = document.createElement('div');
        card.classList.add('card');

        // Create the image element
        const img = document.createElement('img');
        img.src = product.Image;
        img.classList.add('card-img-top');
        img.alt = product.Name;

        // Create the card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Create the product name
        const productName = document.createElement('h5');
        productName.classList.add('card-title');
        productName.textContent = product.Name;

        // Create the product category and subcategory text
        const productText = document.createElement('p');
        productText.classList.add('card-text');
        productText.textContent = `${product.Category}, ${product.Subcategory}`;

        // Create the product price
        const productPrice = document.createElement('p');
        productPrice.classList.add('card-price');
        productPrice.textContent = `$${product.Price}`;

        // Append everything to the respective elements
        cardBody.appendChild(productName);
        cardBody.appendChild(productText);
        cardBody.appendChild(productPrice);
        card.appendChild(img);
        card.appendChild(cardBody);
        productLink.appendChild(card);
        productCard.appendChild(productLink);

        // Append the product card to the container
        productsContainer.appendChild(productCard);
    });
}


// Fetch and render products when the page loads
fetchProducts();
fetch(apiUrl)
  .then(response => response.json())
  .then(products => {
      console.log(products);  // Check what is being returned
      const filteredProducts = products.filter(product => product.Category.toLowerCase() === category.toLowerCase());
      renderProducts(filteredProducts);
  })
  .catch(error => {
      console.error("Error loading products:", error);
  });
