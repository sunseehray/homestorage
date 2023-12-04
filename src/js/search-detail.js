import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";
import ItemInfo from "./ItemInfo.mjs";

const headerPath = "../partials/header.html";
const footerPath = "../partials/footer.html";
loadHeaderFooter(headerPath, footerPath);

//extract the id of the item that the user indicated previously
const foodId = getLocalStorage("food-id");
console.log(foodId);

//get the data source which is the results of the search that the user generated
const searchResults = getLocalStorage("search-results");
console.log(searchResults);

//extract the food from the data using the id
const foundItem = searchResults.find((item) => (item.food.foodId = foodId));
console.log(foundItem);

// extract the food from the data using the index
const itemIndex = getLocalStorage("food-index");
const itemFromIndex = searchResults[itemIndex];
console.log(itemFromIndex);

// use this food data to generate the content of this page
// const renderedItem = new ItemInfo(foundItem);
// renderedItem.init();

// use the itemFromIndex to generate the specific food item
const renderedItem = new ItemInfo(itemFromIndex);
renderedItem.init();