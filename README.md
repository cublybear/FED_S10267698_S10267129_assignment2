# FED_S10267698_S10267129_assignment2
Welcome to our dynamic clothing e-commerce platform, where fashion meets fun and community! Discover an extensive collection of stylish products, from the latest trends to timeless classics. With the added bonus of earning loyalty points through engaging mini-games, shopping here is more rewarding than ever. Our user-friendly interface allows you to easily navigate and find exactly what you need, while enjoying a seamless shopping experience from start to finish.

But shopping is just the beginning — our platform thrives on community interaction. Post your own fashion looks, like and comment on others’ posts, and show off your creativity. Whether you’re sharing your style inspiration or discovering new trends, the community experience is all about connection, creativity, and fun. Plus, with convenient account management and dedicated customer support, we’re here to ensure your experience is always smooth and enjoyable.

## Design Process
### **Target Audience**
Mokesell is designed to offer users an engaging and interactive shopping experience, while connecting them with a vibrant community of like-minded individuals.

### **User Goals**
Explore Products: Users want to easily browse products and view detailed descriptions to make informed purchases.

Engage in Fun Activities: Users want to play mini-games for entertainment and possibly earn rewards.

Build and Manage Profiles: Users want to create and edit their profiles, track their activities, and manage personal details.

Make Purchases: Users aim to add items to their cart, proceed with checkout, and complete their purchases smoothly.

Engage in Community: Users want to interact with others through the community, share posts, and be part of discussions.

### **User Stories**
As a buyer, I want to view product details, so that I can make an informed decision before purchasing.

As a buyer, I want to play mini-games, so that I can have fun and possibly earn rewards or points.

As a buyer, I want to manage my account, so that I can update my personal details and preferences.

As a buyer, I want to add items to my cart and proceed to checkout, so that I can make a purchase.

As a seller, I want to participate in the community, so that I can connect with others and promote my products or creations.

As a user, I want to share posts, so that I can interact with the community and engage in discussions.

As a user, I want to manage my profile, so that I can keep my information up-to-date and track my activity.

### **Wireframe**
Link to Figma wireframe [here](https://www.figma.com/design/4J5M9PRrJN0UuTvAqg594X/FED?node-id=0-1&t=2PEObHQbDKjO9HeG-1)

## Features
### Existing Features
- **Account Page** - Allow user to sign in or sign up for an account
- **Minigame Page** - Let user to earn Moke Points by hitting the game requirements, which can be used to offset transaction amount
- **Community Page** - Page designed for social interaction, allowing users to connect, share content and participate in community discussions
- **Post Page** - Page where users can and interact with posts by commenting or liking, enhancing interaction between users
- **Product Gallery**: The product gallery is dynamically populated with items, categorized into categories and subcategories. The inventory is fetched in real-time from the database using API calls to ensure that the latest products are always displayed.
- **Cart**: Cart items are updated in real-time via JavaScript. Subtotals and quantities are automatically recalculated to reflect any changes made by the user.
- **Checkout** - During checkout, users can select from addresses they've previously entered on the profile edit page. Moke points can also be redeemed for discounts. Once the order is placed, it is stored in the database using the backend API.
- **Account Management**: Users can update their account details, including up to two shipping addresses. Any changes are immediately reflected through API calls to keep the profile data synchronized.

## Technologies Used
- **RestDB** - Database to store user's account details, items ordered and product lists

## Assistive AI
1. **Using API**: ChatGPT helped generate JavaScript code for API calls, async operations, for areas that needed API. It greatly helped me understand how APIs work.
[images/source-code-ss1]

## Testing
For any scenarios that have not been automated, test the user stories manually and provide as much detail as is relevant. A particularly useful form for describing your testing process is via scenarios, such as:

## 1. Account Page
1. **Empty form input**: Try to submit empty form in sign up page, an alert will show.
2. **Wrong password**: Try to submit the form with a wrong password, an alert will pop up.

## 2. Product Details Page
1. **Add to Cart (No Size Selected)**: Try adding a product to the cart without selecting a size. An alert should pop up, preventing the product from being added to the cart.
2. **Add to Cart (Size Out of Stock)**: Choose size 'L' for a product where all 'L' sizes are out of stock in the database. An alert should pop up, and the product should not be added to the cart.

## 3. Checkout Page
1. **Select an Address**: Ensure that you can select an address from those entered in your profile during checkout.
2. **Moke Coins (No Coins)**: If no Moke Coins are available, the checkbox for redeeming Moke Coins should be disabled, and a message indicating that there are no Moke Coins should appear.
3. **Moke Coins (Available)**: If Moke Coins are available, the checkbox should become enabled, allowing the user to redeem their Moke Coins for discounts during checkout.

### Responsiveness
- **Product Cards Layout**: On mobile devices, product cards are displayed in 2 columns; on smaller screens, 3 columns; and on full screens, 4 columns.
- **Responsive Layout**: Pages with a left and right layout will shift the right section to the bottom on all smaller screen sizes.
- **Responsive Grid**: The website utilizes Bootstrap's responsive grid system for adapting layouts to different screen sizes.

### Interesting Bugs
- Image is weirdly placed 
[images/interestingbugsss]

If this section grows too long, you may want to split it off into a separate file and link to it from here.
## Credits
### Media
- All product images are credited to ZARA. https://www.zara.com/sg/
- Profile Picture image: Redirect notice. (n.d.). Retrieved February 9, 2025, from https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fprofile-pic&psig=AOvVaw28oeLZomLiNWnzM2YXYjz2&ust=1739186808314000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIivzPC9tosDFQAAAAAdAAAAABAE
- Game images were made by us using Canva and Flaticon. https://www.flaticon.com/
### Acknowledgements
- I would like to acknowledge OpenAI’s ChatGPT for assisting us with the overall code of our project. https://chatgpt.com/g/g-3bxChvw71-link
