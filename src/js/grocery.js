import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";

const headerPath = "../partials/header.html";
const footerPath = "../partials/footer.html";
loadHeaderFooter(headerPath, footerPath);

function groceryListTemplate(item) {
  let brand;
  let image;

  if (!item.food.brand) {
    brand = "generic";
  } else {
    brand = item.food.brand;
  }

  if (!item.food.image) {
    image = "../images/filled-basket.jpg";
  } else {
    image = item.food.image;
  }

  return `<li class="divider">
        <img src="${image}" 
            alt = "${item.food.label}"
        />
        <h3>${item.food.knownAs}<h3>
        <p>${brand}</p>
        <p>${item.GroceryQuantity}x</p>
    </li>`;
}

function renderGroceryList() {
  const groceryListItems = getLocalStorage("grocery-list");
  const element = document.querySelector(".grocery-list");
  const htmlItems = groceryListItems.map((item) => groceryListTemplate(item));
  element.innerHTML = htmlItems.join("");
}

renderGroceryList();
