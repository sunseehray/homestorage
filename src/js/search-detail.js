import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";
import SearchResult from "./SearchResult.mjs";

const headerPath = "../partials/header.html";
const footerPath = "../partials/footer.html";
loadHeaderFooter(headerPath, footerPath);

//extract the id of the item that the user indicated previously
const foodId = getLocalStorage("food-id");
console.log(foodId);

//get the data source which is the results of the search that the user generated
const data = getLocalStorage("search-results");
console.log(data);

//extract the food from the data using the id
const foundItem = data.find((item) => (item.food.foodId = foodId));
console.log(foundItem);

// use this food data to generate the content of this page
const renderedItem = new SearchResult(foundItem);
renderedItem.init();
