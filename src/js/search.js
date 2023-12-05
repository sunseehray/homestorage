// this is the script for the search page
import { loadHeaderFooter } from "./utils.mjs";
import { setLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import SearchItem from "./SearchItem.mjs";

// load header and footer
const headerPath = "../partials/header.html";
const footerPath = "../partials/footer.html";
loadHeaderFooter(headerPath, footerPath);

const dataSource = new ExternalServices();
setLocalStorage("food-id", "");

document
  .querySelector("#search-button")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    //fetch results based on search query
    const data = await dataSource.getSearchProducts();
    //save this data to local storage
    setLocalStorage("search-results", data);

    const element = document.querySelector(".product-list");
    renderSearchResults(data, element);

    // try if we can get the food id when user clicks the image or h2
    // const selector = document.querySelector(".see-detail");
    // saveId(selector);
  });

function renderSearchResults(data, parentElement) {
  // clear first, otherwise, it will pile up as user searches again and again
  parentElement.innerHTML = "";
  data.forEach((p) => {
    const item = new SearchItem(p.food.foodId, data, parentElement);
    item.init();
  });
}
