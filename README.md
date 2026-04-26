# Welcome To ShopComp!
Welcome Grader. This is our website. Below is the steps on how to operate the website. Please read because there are caveats to our website :)

[![Watch the video](https://img.youtube.com/vi/BXEgU15b7so/0.jpg)](https://youtu.be/BXEgU15b7so)

## Categories: The Ambiguous, The Menacing?
Regarding categories. We treat categories as super simple types of the complex names. So "Fairlife Dairy 2% Skim Milk" is of category "Milk". "Grey Goose Vodka" is "Vodka". "Honey Nut Cheerios" is "Cereal". "Soy Sauce" is "Sauce". You get the picture. Every item has its simplest form. This is also how the AI inputs categories.

## AI: We Paid For It, Please Use Ours!
Regarding the OpenAI stuff, please use our key. we have put 5 dollars into this and you should not be able to use it all for this assignment. Each request to the API uses around 50 thousand tokens because we are encoding the image to tokens, rather than pushing it to the DB. So, using a free trial will not give you a lot of tokens to use. Please use our key! You will be able to run as many tests as you want. We only used 50 cents when testing it, which is a lot of tests. Also, for report options please use CATEGORYS for the shopping list items when making them, not the ITEM NAME. We look through the database on the basis of category for best item price. If you put Fairlife Dairy 2% Skim Milk it will not find anything. If you put Milk it will find the best deal.

## Some Quirks About ShopComp
Amplify and Cognito are a bit finnicky sometimes. If you click a button and the page doesnt redirect immediatley, click the button again. It should work a second time. Also, if the page becomes white/blank, you can click the reload button. This should load the page properly. The scanning portion of the AI capabilities takes a while to do. It works, but takes some time.

## Links For Everything
Here is a list of all the links we use for each page
<br>
https://development.d2nri1um37r4vb.amplifyapp.com/
<br>
https://development.d2nri1um37r4vb.amplifyapp.com/search-recent-purchases
<br>
https://development.d2nri1um37r4vb.amplifyapp.com/review-receipts-history
<br>
https://development.d2nri1um37r4vb.amplifyapp.com/shopping-list
<br>
https://development.d2nri1um37r4vb.amplifyapp.com/chains-and-stores
<br>
https://development.d2nri1um37r4vb.amplifyapp.com/account-info
<br>
https://development.d2nri1um37r4vb.amplifyapp.com/receipt-add
<br>

## Create Account / Login / Admin Login
To create an account, you can either click "Join Now And Save" or the "Sign In" button. When you click that, it will redirect you to the Cognito user page. From there you can either log in or create an acccount. If you want to log in as Admin to check the admin use cases, please use the following credentials
- Username: tri-admin
- Password: Softeng25!

When using the AI capabilities for adding a receipt, you will need to provide a key. I have an account and key with 4 and a half dollars left. The half that is gone was used for testing, so you will have more than enough tokens to use to test this assignment.

- Key: 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

## What To Do / Order To Do Use Cases In
Some use cases rely on others being done. To view everything in full, one should first create a bunch of chains and stores according to how the website asks (100 Institute Road, Worcester, MA, 01609 commas are optional). Then, one should create a bunch of receipts with valid items and categories, and with different chains and stores. Vary dates as well, since review activitiy works well with data from different dates. To use tha AI, one should get a notepad, and write specifically an address and chain name that works with previously submitted data, and pictures off the internet. The written receipts will automatically populate the chain and store dropdown options, and also the items. The receipt from an online image, however, will probably not be able to populate the chain and store unless you have already made a chain and store in the database. You have to manually create stores and chains, the program will not auotmatically do so. The items, however, are automatically populated onto the page. Then, when the receipts are submitted, all other use cases should work as intended with populated information.

## Shopper
For each use case, we will show you how to do them
### Logout Shopper
Click the top right button Logout. Boom, you are logged out!
### Show Account
In the Navbar, click Show Account. This will lead you to your account information
### Review History
In the Navbar, click My Receipts. This will take you to your specific receipts that you as a shopper have made. To expand the receipt to view the items, click the plus button on a receipt. This will show all the items
### Review Activity
In the Navbar, click Show Account. On this page there should be a tab called Activities. Clcik this. You will then be able to see all your activity either daily, weekly, or monthly. 
### Search Recent Purchases
On the homepage, click the Search Recent Purchases. You can then search for items that you have submitted by name. 
### Create Receipt
Either clcik My Receipts in the Navbar and then click Add Receipt, or click the Add Receipt button on the homepage
### Add Item To Receipt
When you have a receipt template created, you can fill out the necessary information (Store, Chain, Date). Then, fill out the item information, and click add item. This adds the item
### Edit Item in Receipt
If you have created an item, there will be a pencil icon to the right of the item. Click this, and you can redo the information for that item.
### Remove Item From Receipt
If you have created an item or are editing an item, you can click the minus icon. This deletes the item
### Analyze Receipt Image (AI)
Clicking the Scan Receipt button brings up a modal. You will have to input a valid receipt image (png, jpg, etc) and a valid key. We have given you a valid key. When you click Scan, it will take a while to scan, but it will work. It just takes a while.
### Submit Receipt
When you have all information filled with valid data, and at least one item created, you can press the submit button. This submits the receipt to the database and redirects you to receipt history. You can view your recently created receipt, along with all your other ones, here.
### List Shopping Lists
Click Shopping Lists on the Navbar. This takes you to your shopping lists.
### Create Shopping List
In the Shopping Lists page, fill in the name field and click New List. This will redirect you to that lists page where you can add items/
### Add To Shopping List
To add an item, fill in the category and quantity fields, then click add item. For report options please use CATEGORYS for the shopping list items when making them, not the ITEM NAME. We look through the database on the basis of category for best item price. If you put Fairlife Dairy 2% Skim Milk it will not find anything. If you put Milk it will find the best deal. 
### Edit item in Shopping List
Click a list to edit, and then click the edit button on a list item to edit the items. Submit the new data to update the item.
### Remove From Shopping List
To remove an item, click remove item to the right of the item
### Report Options For Shopping List
Click get best prices, and wait for the page to load. On the new page, if your item is found in the database, it will get the lowest price for that item. 
### Delete Shopping List
When viewing all shopping lists, each list has a button next to the arrow icon called delete. Press it to delete the receipt. The button works, but make sure its underlined before you click delete. You might accidently click the list itself, not the button. But the button works
### List Store Chains
Click Chains and Stores either on the homepage or in the navbar. 
### List Stores in Chain
Each Chain has Stores. Click the plus button next to the chain, which will drop down the stores for that chain.
### Add Chain
On Chains and Stores, click add chain. Fill out the necessary information, and submit this. 
### Add Store To Chain
Expand the chains to view the stores, fill out the necessary information, and submit the store. 

## Admin:
For each use case, we will show you how to do them
### Logout Administrator
Same as shopper
### Show Dashboard
Same as shopper
### Review Store Chain Sales
View Chains and Stores same as shopper, admin has access to total sales for chains and stores
### List Store Chains
Same as shopper
### Add Chain
Same as shopper
### Remove Chain
Remove button is available for admin next to every chain, press to delete chain
### List Stores in Chain
Same as shopper
### Add Store To Chain
Same as shopper
### Remove Store From Chain
Remove button is available for admin next to every store, press to delete store
