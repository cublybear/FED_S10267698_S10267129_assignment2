document.addEventListener('DOMContentLoaded', function() {
    // Fetch the JSON file containing the product data
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            // Filter products by category and subcategory (if specified in URL)
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category');
            const subcategory = urlParams.get('subcategory');
            
            let filteredProducts = products;
            
            if (category) {
                filteredProducts = filteredProducts.filter(product => product.category === category);
            }
            
            if (subcategory) {
                filteredProducts = filteredProducts.filter(product => 
                    product.subcategory.includes(subcategory)
                );
            }

            // Get the product gallery element
            const gallery = document.getElementById('product-gallery');

            // Clear any existing products
            gallery.innerHTML = '';

            // Use a set to track products already displayed by their name (ignores size)
            const displayedProductNames = new Set();

            // Loop through the filtered products and display them in the gallery
            filteredProducts.forEach(product => {
                // Skip the product if it has already been displayed (based on product name)
                if (displayedProductNames.has(product.name)) {
                    return;
                }

                // Add the product name to the set so it won't be displayed again
                displayedProductNames.add(product.name);
                
                // Create the product card container
                const productCard = document.createElement('div');
                productCard.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4');
                
                // Create the anchor tag for the card link
                const productLink = document.createElement('a');
                productLink.href = `product-details.html?id=${product.id}`;
                productLink.classList.add('card-link');
                
                // Create the card element
                const card = document.createElement('div');
                card.classList.add('card');
                
                // Create and set the product image
                const productImage = document.createElement('img');
                productImage.src = product.image1;
                productImage.classList.add('card-img-top');
                productImage.alt = product.name;
                
                // Create the card body
                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
                
                // Create the product name
                const productName = document.createElement('h5');
                productName.classList.add('card-title');
                productName.textContent = product.name;
                
                // Create the product category and subcategory text
                const productCategory = document.createElement('p');
                productCategory.classList.add('card-text');
                
                // Capitalize category and subcategory
                const categoryText = product.category.charAt(0).toUpperCase() + product.category.slice(1);
                
                // Prepare subcategory text, exclude 'all' and 'bestsellers' if found in the subcategory
                let subcategoryText = product.subcategory;
                
                // Filter out 'all' and 'bestsellers' and capitalize remaining subcategories
                subcategoryText = product.subcategory
                    .split(',')
                    .map(sub => sub.trim())
                    .filter(sub => sub.toLowerCase() !== 'all' && sub.toLowerCase() !== 'bestsellers')
                    .map(sub => sub.charAt(0).toUpperCase() + sub.slice(1))
                    .join(', ');

                // Set the text content of category and subcategory
                productCategory.textContent = `${categoryText}, ${subcategoryText}`;
                
                // Create the product price
                const productPrice = document.createElement('p');
                productPrice.classList.add('card-price');
                productPrice.textContent = `$${product.price}`;

                // Append all the elements to the card body
                cardBody.appendChild(productName);
                cardBody.appendChild(productCategory);
                cardBody.appendChild(productPrice);
                
                // Append the image and card body to the card
                card.appendChild(productImage);
                card.appendChild(cardBody);
                
                // Append the card to the product link
                productLink.appendChild(card);
                
                // Append the product link to the product card container
                productCard.appendChild(productLink);
                
                // Append the product card to the gallery
                gallery.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });
});
