# FED_S10267698_S10267129_assignment2
Welcome to our dynamic clothing e-commerce platform, where fashion meets fun and community! Discover an extensive collection of stylish products, from the latest trends to timeless classics. With the added bonus of earning loyalty points through engaging mini-games, shopping here is more rewarding than ever. Our user-friendly interface allows you to easily navigate and find exactly what you need, while enjoying a seamless shopping experience from start to finish.

But shopping is just the beginning — our platform thrives on community interaction. Post your own fashion looks, like and comment on others’ posts, and show off your creativity. Whether you’re sharing your style inspiration or discovering new trends, the community experience is all about connection, creativity, and fun. Plus, with convenient account management and dedicated customer support, we’re here to ensure your experience is always smooth and enjoyable.
## Design Process
Provide us insights about your design process, focusing on who this website is for, what it is that they want to achieve and how your project is the best way to help them achieve these things.

In particular, as part of this section we recommend that you provide a list of User Stories, with the following general structure:

As a user type, I want to perform an action, so that I can achieve a goal.
This section is also where you would share links to any wireframes, mockups, diagrams etc. that you created as part of the design process. These files should themselves either be included as a pdf file in the project itself (in an separate directory) Include the Adobe XD wireframe as a folder. You can include the XD share url.
## Features
### Existing Features
- Feature jy - gdfhgj
- Feature jy - asdefgh
- Feature jy - asdefgh

- **Product Gallery**: The product gallery is dynamically populated with items, categorized into categories and subcategories. The inventory is fetched in real-time from the database using API calls to ensure that the latest products are always displayed.

- **Cart**: Cart items are updated in real-time via JavaScript. Subtotals and quantities are automatically recalculated to reflect any changes made by the user.

- **Checkout** - During checkout, users can select from addresses they've previously entered on the profile edit page. Moke points can also be redeemed for discounts. Once the order is placed, it is stored in the database using the backend API.

- **Account Management**: Users can update their account details, including up to two shipping addresses. Any changes are immediately reflected through API calls to keep the profile data synchronized.
### Features Left to Implement
- Feature adsfg
## Technologies Used
In this section, you should mention all of the languages, frameworks, libraries, and any other tools that you have used to construct this project. For each, provide its name, a link to its official site and a short sentence of why it was used.

- JQuery
  - The project uses JQuery to simplify DOM manipulation.
## Assistive AI
1. **Using API**: ChatGPT helped generate JavaScript code for API calls, async operations, for areas that needed API. It greatly helped me understand how APIs work.
[images/source-code-ss1]

## Testing
For any scenarios that have not been automated, test the user stories manually and provide as much detail as is relevant. A particularly useful form for describing your testing process is via scenarios, such as:

1. Testing jy:
   1. Go to the "Contact Us" page
   2. Try to submit the empty form and verify that an error message about the required fields appears
   3. Try to submit the form with an invalid email address and verify that a relevant error message appears
   4. Try to submit the form with all inputs valid and verify that a success message appears.
## 2. Product Details Page
1. **Add to Cart (No Size Selected)**: Try adding a product to the cart without selecting a size. An alert should pop up, preventing the product from being added to the cart.
2. **Add to Cart (Size Out of Stock)**: Choose size 'L' for a product where all 'L' sizes are out of stock in the database. An alert should pop up, and the product should not be added to the cart.

## 3. Checkout Page
1. **Select an Address**: Ensure that you can select an address from those entered in your profile during checkout.
2. **Moke Coins (No Coins)**: If no Moke Coins are available, the checkbox for redeeming Moke Coins should be disabled, and a message indicating that there are no Moke Coins should appear.
3. **Moke Coins (Available)**: If Moke Coins are available, the checkbox should become enabled, allowing the user to redeem their Moke Coins for discounts during checkout.



   
In addition, you should mention in this section how your project looks and works on different browsers and screen sizes.
### Responsiveness
- **Product Cards Layout**: On mobile devices, product cards are displayed in 2 columns; on smaller screens, 3 columns; and on full screens, 4 columns.
- **Responsive Layout**: Pages with a left and right layout will shift the right section to the bottom on all smaller screen sizes.
- **Responsive Grid**: The website utilizes Bootstrap's responsive grid system for adapting layouts to different screen sizes.


You should also mention in this section any interesting bugs or problems you discovered during your testing, even if you haven't addressed them yet.

If this section grows too long, you may want to split it off into a separate file and link to it from here.
## Credits
### Content
- sdfghjk
### Media
- sdfghjk
### Acknowledgements
- sdfghjk
