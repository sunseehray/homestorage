// this is the script for the search page
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// load header and footer
const headerPath = "../partials/header.html";
const footerPath = "../partials/footer.html";
loadHeaderFooter(headerPath, footerPath);

const dataSource = new ExternalServices();

document
  .querySelector("#search-button")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const data = await dataSource.getSearchProducts();
    setLocalStorage("search-results", data);

    // try specific target
    // const itemId = data[0].food.foodId;
    // const product = data.find((item) => item.food.foodId === itemId);
    // console.log(product);

    console.log(data);
    renderSearchResults();

    // try if we can get the food id when user clicks the image or h2
    const selector = document.querySelector(".see-detail");
    saveId(selector);
  });

function renderSearchResults() {
  const searchResults = getLocalStorage("search-results") || [];
  const htmlItems = searchResults.map((item) => searchResultTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function searchResultTemplate(item) {
  let image;
  if (!item.food.image) {
    image = "../images/filled-basket.jpg";
  } else {
    image = item.food.image;
  }
  let brand;
  if (!item.food.brand) {
    brand = "Generic";
  } else {
    brand = item.food.brand;
  }

  const newItem = `<li class="result-card divider">
        <a href="../product/index.html" class="result-card__image see-detail" id="${item.food.foodId}" data-id="${item.food.foodId}">
            <img
                src="${image}"
                alt="${brand}${item.food.label}"
            />
            <h2 class="result-card__name">${brand} ${item.food.label}</h2>
        </a>
        <p class="result-card__calories">Calories: ${item.food.nutrients.ENERC_KCAL}</p>
        </li>`;

  return newItem;
}

function saveId(selector) {
  const id = selector.getAttribute("data-id");
  selector.addEventListener("click", () => {
    setLocalStorage("food-id", id);
  });
}
