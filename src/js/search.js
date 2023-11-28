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

    //   console.log(data);
    renderSearchResults();
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

  let servingSize;
  if (!item.food.servingsPerContainer) {
    servingSize = "-";
  } else {
    servingSize = item.food.servingsPerContainer;
  }
  const newItem = `<li class="result-card divider">
        <a href="" class="result-card__image">
            <img
                src="${image}"
                alt="${item.food.label}"
            />
        </a>
        <a href="#">
            <h2 class="card__name">${item.food.brand} ${item.food.label}</h2>
        </a>
        <p class="result-card__serving">Serving Size: ${servingSize}</p>
        </li>`;

  return newItem;
}